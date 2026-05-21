import { Component, inject, input, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MentorService } from '../../../core/services/mentor.service';
import type { Diagnostic } from '../../../core/services/compiler.service';

@Component({
  selector: 'tf-ai-mentor-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col h-full overflow-hidden">
      <!-- Header -->
      <div class="flex items-center gap-2 px-3 py-2 border-b shrink-0"
           style="border-color: var(--border)">
        <span class="text-xs font-semibold" style="color: var(--accent)">✦ AI Mentor</span>
        <span class="text-xs" style="color: var(--text-muted)">{{ modelLabel() }}</span>
        @if (mentor.isStreaming()) {
          <span class="ml-auto flex gap-0.5">
            <span class="w-1.5 h-1.5 rounded-full animate-bounce" style="background: var(--accent); animation-delay: 0ms"></span>
            <span class="w-1.5 h-1.5 rounded-full animate-bounce" style="background: var(--accent); animation-delay: 150ms"></span>
            <span class="w-1.5 h-1.5 rounded-full animate-bounce" style="background: var(--accent); animation-delay: 300ms"></span>
          </span>
        }
        @if (mentor.response() && !mentor.isStreaming()) {
          <button (click)="mentor.clear()" class="ml-auto text-xs px-2 py-0.5 rounded border transition-colors"
                  style="border-color: var(--border); color: var(--text-muted)">
            Clear
          </button>
        }
      </div>

      <!-- Action buttons -->
      <div class="flex flex-wrap gap-1.5 p-2 border-b shrink-0"
           style="border-color: var(--border); background: var(--bg-elevated)">
        @if (hasErrors()) {
          <button (click)="explainErrors()" [disabled]="mentor.isStreaming()"
                  class="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border transition-colors disabled:opacity-50"
                  style="border-color: #ef444440; color: var(--danger); background: #ef444410">
            ⚠ Explain Errors
          </button>
        }
        <button (click)="reviewCode()" [disabled]="mentor.isStreaming()"
                class="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border transition-colors disabled:opacity-50"
                style="border-color: var(--border); color: var(--text-secondary)">
          ⟳ Review Code
        </button>
        @if (mode() === 'challenge') {
          <button (click)="getHint()" [disabled]="mentor.isStreaming()"
                  class="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border transition-colors disabled:opacity-50"
                  style="border-color: #3b82f640; color: #3b82f6; background: #3b82f610">
            💡 Get Hint
          </button>
        }
      </div>

      <!-- Response area -->
      <div class="flex-1 overflow-auto p-3">
        @if (mentor.response()) {
          <pre class="text-xs leading-relaxed whitespace-pre-wrap"
               style="color: var(--text-primary); font-family: 'Menlo', 'Monaco', 'Consolas', monospace">{{ mentor.response() }}</pre>
        } @else if (mentor.isStreaming()) {
          <p class="text-xs" style="color: var(--text-muted)">Thinking…</p>
        } @else {
          <div class="space-y-2">
            <p class="text-xs leading-relaxed" style="color: var(--text-muted)">
              Ask the AI Mentor for help with your TypeScript code.
            </p>
            @if (hasErrors()) {
              <p class="text-xs" style="color: var(--text-muted)">
                → You have errors — try <strong style="color: var(--text-secondary)">Explain Errors</strong>
              </p>
            }
          </div>
        }
      </div>
    </div>
  `,
})
export class AiMentorPanelComponent {
  mentor = inject(MentorService);

  code = input.required<string>();
  errors = input<Diagnostic[]>([]);
  context = input<string>('');
  mode = input<'playground' | 'challenge'>('playground');
  hintTrigger = input(0);
  modelLabel = input<string>('gemini-2.0-flash');

  hasErrors = computed(() => (this.errors() ?? []).length > 0);

  private lastHandledHintTrigger = 0;

  constructor() {
    effect(() => {
      const trigger = this.hintTrigger();
      if (trigger <= this.lastHandledHintTrigger) return;
      this.lastHandledHintTrigger = trigger;
      this.getHint();
    });
  }

  explainErrors() {
    this.mentor.ask({
      type: 'explain_errors',
      code: this.code(),
      errors: this.errors(),
    });
  }

  reviewCode() {
    this.mentor.ask({
      type: 'review_code',
      code: this.code(),
      context: this.context(),
    });
  }

  getHint() {
    this.mentor.ask({
      type: 'hint',
      code: this.code(),
      context: this.context(),
    });
  }
}
