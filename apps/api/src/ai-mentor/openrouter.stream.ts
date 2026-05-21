import { Logger } from '@nestjs/common';
import { Response } from 'express';

export interface OpenRouterStreamOptions {
  apiKey: string;
  model: string;
}

interface OpenRouterChunk {
  choices?: Array<{
    delta?: { content?: string };
    finish_reason?: string | null;
  }>;
}

function writeSseText(res: Response, text: string): void {
  res.write(`data: ${JSON.stringify({ text })}\n\n`);
}

export async function streamViaOpenRouter(
  systemPrompt: string,
  userMessage: string,
  res: Response,
  options: OpenRouterStreamOptions,
  logger: Logger,
): Promise<void> {
  let httpRes: globalThis.Response;

  try {
    httpRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${options.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://typeforge.dev',
        'X-Title': 'TypeForge AI Mentor',
      },
      body: JSON.stringify({
        model: options.model,
        stream: true,
        max_tokens: 1024,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
      }),
    });
  } catch (err) {
    logger.error('OpenRouter fetch error', err);
    writeSseText(res, '\n\n[Error communicating with AI Mentor. Please try again.]');
    return;
  }

  if (!httpRes.ok || !httpRes.body) {
    const errText = await httpRes.text().catch(() => String(httpRes.status));
    logger.error(`OpenRouter API error ${httpRes.status}: ${errText}`);
    writeSseText(res, '\n\n[Error communicating with AI Mentor. Please try again.]');
    return;
  }

  const reader = httpRes.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('data: ')) continue;
        const payload = trimmed.slice(6);
        if (payload === '[DONE]') return;

        try {
          const chunk = JSON.parse(payload) as OpenRouterChunk;
          const content = chunk.choices?.[0]?.delta?.content;
          if (content) {
            writeSseText(res, content);
          }
        } catch {
          // ignore malformed SSE chunks
        }
      }
    }
  } catch (err) {
    logger.error('OpenRouter stream read error', err);
    writeSseText(res, '\n\n[Error communicating with AI Mentor. Please try again.]');
  }
}
