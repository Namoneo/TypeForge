import { openSync } from 'fs';
import { spawn } from 'child_process';
import * as readline from 'readline';
import { Logger } from '@nestjs/common';
import { Response } from 'express';

export interface ClaudeCliStreamOptions {
  cliPath: string;
  model?: string;
}

interface ClaudeStreamEvent {
  type?: string;
  error?: string;
  is_error?: boolean;
  result?: string;
  message?: {
    content?: Array<{ type?: string; text?: string }>;
  };
  event?: {
    delta?: {
      type?: string;
      text?: string;
    };
  };
}

function writeSseText(res: Response, text: string): void {
  res.write(`data: ${JSON.stringify({ text })}\n\n`);
}

function finishSse(res: Response): void {
  res.write('data: [DONE]\n\n');
  res.end();
}

function extractStreamDelta(event: ClaudeStreamEvent): string | null {
  if (
    event.type === 'stream_event' &&
    event.event?.delta?.type === 'text_delta' &&
    event.event.delta.text
  ) {
    return event.event.delta.text;
  }

  if (event.type === 'result' && event.is_error && event.result) {
    return event.result;
  }

  return null;
}

export function streamViaClaudeCli(
  systemPrompt: string,
  userMessage: string,
  res: Response,
  options: ClaudeCliStreamOptions,
  logger: Logger,
): Promise<void> {
  return new Promise((resolve) => {
    // Do not use --bare: it skips OAuth/keychain and requires ANTHROPIC_API_KEY.
    const args = [
      '-p',
      userMessage,
      '--append-system-prompt',
      systemPrompt,
      '--output-format',
      'stream-json',
      '--verbose',
      '--include-partial-messages',
      '--permission-mode',
      'dontAsk',
    ];

    if (options.model) {
      args.push('--model', options.model);
    }

    let finished = false;
    const complete = () => {
      if (finished) return;
      finished = true;
      finishSse(res);
      resolve();
    };

    const devNull = openSync('/dev/null', 'r');
    const child = spawn(options.cliPath, args, {
      stdio: [devNull, 'pipe', 'pipe'],
    });

    if (!child.stdout || !child.stderr) {
      writeSseText(res, '\n\n[Claude CLI failed to start a subprocess.]');
      complete();
      return;
    }

    let sawText = false;
    let sawErrorResult = false;
    const stderrChunks: string[] = [];

    const rl = readline.createInterface({ input: child.stdout });

    rl.on('line', (line) => {
      try {
        const event = JSON.parse(line) as ClaudeStreamEvent;

        if (event.error === 'authentication_failed') {
          sawErrorResult = true;
          return;
        }

        const text = extractStreamDelta(event);
        if (!text) return;

        sawText = true;
        if (event.type === 'result' && event.is_error) {
          sawErrorResult = true;
        }
        writeSseText(res, text);
      } catch {
        // ignore non-JSON lines from the CLI
      }
    });

    child.stderr.on('data', (chunk: Buffer) => {
      stderrChunks.push(chunk.toString());
    });

    res.on('close', () => {
      if (!child.killed) {
        child.kill('SIGTERM');
      }
    });

    child.on('error', (err) => {
      logger.error('Claude CLI process error', err);
      if (!sawText) {
        writeSseText(
          res,
          '\n\n[Claude CLI failed to start. Install it (`brew install anthropics/tap/claude`) or set AI_MENTOR_PROVIDER=api.]',
        );
      }
      complete();
    });

    child.on('close', (code) => {
      rl.close();

      if (!sawText) {
        const errDetail = stderrChunks.join('').trim().slice(0, 300);
        logger.warn(`Claude CLI exited with code ${code}: ${errDetail}`);

        if (sawErrorResult || errDetail.toLowerCase().includes('login')) {
          writeSseText(
            res,
            '\n\n[Claude CLI is not authenticated. Run `claude auth login` in your terminal, then retry.]',
          );
        } else if (errDetail) {
          writeSseText(res, `\n\n[Claude CLI error: ${errDetail}]`);
        } else if (code !== 0) {
          writeSseText(
            res,
            '\n\n[Claude CLI exited unexpectedly. Run `claude auth login` if needed.]',
          );
        }
      }

      complete();
    });
  });
}
