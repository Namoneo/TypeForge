import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';
import { Response } from 'express';
import { AskMentorDto } from './ai-mentor.dto';
import { resolveAiMentorProvider, type AiMentorProvider } from './ai-mentor.config';
import {
  AI_MENTOR_SYSTEM_PROMPT,
  buildMentorUserMessage,
} from './ai-mentor.prompt';
import { streamViaClaudeCli } from './claude-cli.stream';
import { streamViaGemini } from './gemini.stream';
import { streamViaOpenRouter } from './openrouter.stream';

@Injectable()
export class AiMentorService {
  private readonly logger = new Logger(AiMentorService.name);
  private readonly provider: AiMentorProvider;
  private readonly client: Anthropic | null;
  private readonly openRouterApiKey: string | null;
  private readonly openRouterModel: string;
  private readonly geminiApiKey: string | null;
  private readonly geminiModel: string;

  constructor(private config: ConfigService) {
    this.provider = resolveAiMentorProvider(config);

    if (this.provider === 'cli') {
      const cliPath = this.config.get<string>('CLAUDE_CLI_PATH') ?? 'claude';
      this.logger.log(
        `AI Mentor using Claude CLI at "${cliPath}" (local dev only)`,
      );
      this.client = null;
      this.openRouterApiKey = null;
      this.openRouterModel = '';
      this.geminiApiKey = null;
      this.geminiModel = '';
      return;
    }

    if (this.provider === 'openrouter') {
      this.client = null;
      this.geminiApiKey = null;
      this.geminiModel = '';
      this.openRouterApiKey =
        this.config.get<string>('OPENROUTER_API_KEY') ?? null;
      this.openRouterModel =
        this.config.get<string>('OPENROUTER_MODEL') ??
        'google/gemini-2.0-flash-001';
      if (!this.openRouterApiKey) {
        this.logger.warn('OPENROUTER_API_KEY not set — AI Mentor disabled');
      } else {
        this.logger.log(
          `AI Mentor using OpenRouter model "${this.openRouterModel}"`,
        );
      }
      return;
    }

    if (this.provider === 'gemini') {
      this.client = null;
      this.openRouterApiKey = null;
      this.openRouterModel = '';
      this.geminiApiKey = this.config.get<string>('GEMINI_API_KEY') ?? null;
      this.geminiModel =
        this.config.get<string>('GEMINI_MODEL') ?? 'gemini-2.0-flash';
      if (!this.geminiApiKey) {
        this.logger.warn('GEMINI_API_KEY not set — AI Mentor disabled');
      } else {
        this.logger.log(`AI Mentor using Gemini model "${this.geminiModel}"`);
      }
      return;
    }

    this.openRouterApiKey = null;
    this.openRouterModel = '';
    this.geminiApiKey = null;
    this.geminiModel = '';
    const apiKey = this.config.get<string>('ANTHROPIC_API_KEY');
    this.client = apiKey ? new Anthropic({ apiKey }) : null;
    if (!this.client) {
      this.logger.warn('ANTHROPIC_API_KEY not set — AI Mentor disabled');
    }
  }

  async streamResponse(dto: AskMentorDto, res: Response): Promise<void> {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const userMessage = buildMentorUserMessage(dto);

    if (this.provider === 'cli') {
      await streamViaClaudeCli(
        AI_MENTOR_SYSTEM_PROMPT,
        userMessage,
        res,
        {
          cliPath: this.config.get<string>('CLAUDE_CLI_PATH') ?? 'claude',
          model: this.config.get<string>('CLAUDE_CLI_MODEL'),
        },
        this.logger,
      );
      return;
    }

    if (this.provider === 'openrouter') {
      if (!this.openRouterApiKey) {
        res.write(
          `data: ${JSON.stringify({ text: 'AI Mentor is not configured. Set OPENROUTER_API_KEY.' })}\n\n`,
        );
        res.write('data: [DONE]\n\n');
        res.end();
        return;
      }

      await streamViaOpenRouter(
        AI_MENTOR_SYSTEM_PROMPT,
        userMessage,
        res,
        { apiKey: this.openRouterApiKey, model: this.openRouterModel },
        this.logger,
      );
      res.write('data: [DONE]\n\n');
      res.end();
      return;
    }

    if (this.provider === 'gemini') {
      if (!this.geminiApiKey) {
        res.write(
          `data: ${JSON.stringify({ text: 'AI Mentor is not configured. Set GEMINI_API_KEY.' })}\n\n`,
        );
        res.write('data: [DONE]\n\n');
        res.end();
        return;
      }

      await streamViaGemini(
        AI_MENTOR_SYSTEM_PROMPT,
        userMessage,
        res,
        { apiKey: this.geminiApiKey, model: this.geminiModel },
        this.logger,
      );
      res.write('data: [DONE]\n\n');
      res.end();
      return;
    }

    if (!this.client) {
      res.write(
        `data: ${JSON.stringify({ text: 'AI Mentor is not configured. Set ANTHROPIC_API_KEY, GEMINI_API_KEY, or AI_MENTOR_PROVIDER=cli (dev only).' })}\n\n`,
      );
      res.write('data: [DONE]\n\n');
      res.end();
      return;
    }

    try {
      const stream = this.client.messages.stream({
        model: 'claude-opus-4-7',
        max_tokens: 1024,
        thinking: { type: 'adaptive' },
        system: [
          {
            type: 'text',
            text: AI_MENTOR_SYSTEM_PROMPT,
            cache_control: { type: 'ephemeral' },
          },
        ],
        messages: [{ role: 'user', content: userMessage }],
      });

      for await (const event of stream) {
        if (
          event.type === 'content_block_delta' &&
          event.delta.type === 'text_delta'
        ) {
          res.write(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`);
        }
      }
    } catch (err) {
      this.logger.error('Anthropic API error', err);
      res.write(
        `data: ${JSON.stringify({ text: '\n\n[Error communicating with AI Mentor. Please try again.]' })}\n\n`,
      );
    }

    res.write('data: [DONE]\n\n');
    res.end();
  }
}
