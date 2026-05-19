import { Injectable, inject, signal } from '@angular/core';
import { AppStore } from '../store/app.store';
import type { Diagnostic } from './compiler.service';

export type MentorQueryType = 'explain_errors' | 'review_code' | 'hint' | 'explain_concept';

export interface AskMentorParams {
  type: MentorQueryType;
  code: string;
  context?: string;
  errors?: Diagnostic[];
}

@Injectable({ providedIn: 'root' })
export class MentorService {
  private store = inject(AppStore);

  readonly isStreaming = signal(false);
  readonly response = signal('');

  async ask(params: AskMentorParams): Promise<void> {
    this.isStreaming.set(true);
    this.response.set('');

    const token = this.store.token();
    try {
      const res = await fetch('/api/ai-mentor/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(params),
      });

      if (!res.ok || !res.body) {
        this.response.set('Failed to reach AI Mentor. Please try again.');
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const payload = line.slice(6).trim();
          if (payload === '[DONE]') return;
          try {
            const { text } = JSON.parse(payload) as { text: string };
            this.response.update((r) => r + text);
          } catch {
            // skip malformed events
          }
        }
      }
    } catch {
      this.response.set('Error connecting to AI Mentor. Please try again.');
    } finally {
      this.isStreaming.set(false);
    }
  }

  clear() {
    this.response.set('');
    this.isStreaming.set(false);
  }
}
