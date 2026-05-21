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

@Injectable()
export class AiMentorService {
  private readonly logger = new Logger(AiMentorService.name);
  private readonly provider: AiMentorProvider;
  private readonly client: Anthropic | null;

  constructor(private config: ConfigService) {
    this.provider = resolveAiMentorProvider(config);

    if (this.provider === 'cli') {
      const cliPath = this.config.get<string>('CLAUDE_CLI_PATH') ?? 'claude';
      this.logger.log(
        `AI Mentor using Claude CLI at "${cliPath}" (local dev only)`,
      );
      this.client = null;
      return;
    }

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

    if (!this.client) {
      res.write(
        `data: ${JSON.stringify({ text: 'AI Mentor is not configured. Set ANTHROPIC_API_KEY or AI_MENTOR_PROVIDER=cli (dev only).' })}\n\n`,
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
