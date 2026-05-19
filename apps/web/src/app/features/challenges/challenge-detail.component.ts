import { Component, inject, signal, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MonacoEditorComponent } from '../../shared/components/monaco-editor/monaco-editor.component';
import { AiMentorPanelComponent } from '../../shared/components/ai-mentor/ai-mentor-panel.component';
import { ChallengeService, Challenge, SubmitResult } from '../../core/services/challenge.service';
import type { Diagnostic } from '../../core/services/compiler.service';
import { AppStore } from '../../core/store/app.store';
import { DIFFICULTY_COLORS } from '@typeforge/shared/constants';

@Component({
  selector: 'tf-challenge-detail',
  standalone: true,
  imports: [CommonModule, MonacoEditorComponent, AiMentorPanelComponent],
  template: `
    <div class="flex h-screen" style="background: var(--bg-base)">

      <!-- Global error toast -->
      @if (toastMessage()) {
        <div class="fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-sm font-medium"
             style="background: var(--danger); color: white; max-width: 360px">
          {{ toastMessage() }}
        </div>
      }

      @if (loadError()) {
        <div class="flex flex-col items-center justify-center w-full gap-3"
             style="color: var(--text-muted)">
          <span style="color: var(--danger)">Failed to load challenge</span>
          <span class="text-xs">{{ loadError() }}</span>
        </div>
      } @else if (challenge(); as c) {
        <!-- Left: description + AI mentor -->
        <div class="w-96 shrink-0 flex flex-col border-r"
             style="background: var(--bg-surface); border-color: var(--border)">

          <!-- Tab bar -->
          <div class="flex border-b shrink-0" style="border-color: var(--border)">
            <button (click)="leftTab.set('description')"
                    class="flex-1 px-3 py-2 text-xs font-medium transition-colors"
                    [style.color]="leftTab() === 'description' ? 'var(--accent)' : 'var(--text-muted)'"
                    [style.borderBottom]="leftTab() === 'description' ? '2px solid var(--accent)' : '2px solid transparent'">
              Description
            </button>
            <button (click)="leftTab.set('mentor')"
                    class="flex-1 px-3 py-2 text-xs font-medium transition-colors"
                    [style.color]="leftTab() === 'mentor' ? 'var(--accent)' : 'var(--text-muted)'"
                    [style.borderBottom]="leftTab() === 'mentor' ? '2px solid var(--accent)' : '2px solid transparent'">
              ✦ AI Mentor
            </button>
          </div>

          @if (leftTab() === 'description') {
            <div class="flex-1 overflow-auto">
              <div class="p-4 border-b" style="border-color: var(--border)">
                <div class="flex items-center gap-2 mb-2">
                  <span class="text-xs px-2 py-0.5 rounded-full font-mono"
                        [style.background]="difficultyColor(c.difficulty) + '20'"
                        [style.color]="difficultyColor(c.difficulty)">
                    {{ c.difficulty }}
                  </span>
                  <span class="text-xs" style="color: var(--text-muted)">{{ c.track }}</span>
                  <span class="ml-auto text-xs font-semibold" style="color: var(--accent)">+{{ c.xpReward }} XP</span>
                </div>
                <h1 class="font-bold text-lg" style="color: var(--text-primary)">{{ c.title }}</h1>
              </div>

              <div class="p-4">
                <p class="text-sm leading-relaxed mb-4" style="color: var(--text-secondary)">{{ c.description }}</p>

                <h3 class="text-xs font-semibold mb-2 uppercase tracking-wide" style="color: var(--text-muted)">Test cases</h3>
                <div class="space-y-2">
                  @for (tc of c.testCases; track $index) {
                    <div class="rounded-lg p-3 text-xs" style="background: var(--bg-elevated)">
                      <div class="font-medium mb-1" style="color: var(--text-primary)">{{ tc.description }}</div>
                      @if (tc.input) {
                        <div class="font-mono" style="color: var(--text-secondary)">Input: {{ tc.input }}</div>
                      }
                      <div class="font-mono" style="color: var(--text-muted)">Expected: {{ tc.expected }}</div>
                    </div>
                  }
                </div>
              </div>
            </div>
          } @else {
            <tf-ai-mentor-panel
              [code]="code()"
              [errors]="submitErrors()"
              [context]="c.title + ': ' + c.description"
              mode="challenge"
              class="flex flex-col flex-1 overflow-hidden">
            </tf-ai-mentor-panel>
          }
        </div>

        <!-- Right: editor + results -->
        <div class="flex-1 flex flex-col overflow-hidden">
          <div class="flex items-center gap-2 px-4 py-2 border-b shrink-0"
               style="background: var(--bg-surface); border-color: var(--border)">
            <span class="text-sm font-medium truncate" style="color: var(--text-secondary)">{{ c.title }}</span>
            <div class="flex-1"></div>
            <button (click)="leftTab.set('mentor')"
                    class="px-3 py-1.5 rounded-md text-xs border transition-colors"
                    style="border-color: var(--border); color: var(--text-secondary)">
              ✦ Ask AI
            </button>
            <button (click)="submit()" [disabled]="submitting()"
                    class="px-4 py-1.5 rounded-md text-xs font-medium transition-opacity"
                    style="background: var(--accent); color: white"
                    [style.opacity]="submitting() ? '0.6' : '1'">
              {{ submitting() ? 'Running tests…' : '⚡ Submit' }}
            </button>
          </div>

          <div class="flex-1 overflow-hidden">
            <tf-monaco-editor #editor [value]="code()" language="typescript"
              (valueChange)="code.set($event)">
            </tf-monaco-editor>
          </div>

          @if (submitError()) {
            <div class="border-t px-4 py-3 text-xs shrink-0"
                 style="background: var(--bg-surface); border-color: var(--border); color: var(--danger)">
              ✖ Submission failed: {{ submitError() }}
            </div>
          }

          @if (result(); as r) {
            <div class="border-t p-4 shrink-0 max-h-56 overflow-auto"
                 style="background: var(--bg-surface); border-color: var(--border)">
              <div class="flex items-center gap-2 mb-3">
                <span class="w-2 h-2 rounded-full"
                      [style.background]="r.passed ? 'var(--success)' : 'var(--danger)'"></span>
                <span class="text-sm font-semibold"
                      [style.color]="r.passed ? 'var(--success)' : 'var(--danger)'">
                  {{ r.passed ? '✓ All tests passed!' : '✖ Tests failed' }}
                </span>
                @if (r.xpEarned > 0) {
                  <span class="text-xs px-2 py-0.5 rounded-full"
                        style="background: var(--accent); color: white">
                    +{{ r.xpEarned }} XP
                  </span>
                }
                @if (!r.passed) {
                  <button (click)="leftTab.set('mentor')" class="ml-auto text-xs px-2 py-0.5 rounded border"
                          style="border-color: var(--accent); color: var(--accent)">
                    ✦ Get help
                  </button>
                }
              </div>
              <div class="space-y-1.5">
                @for (tr of r.testResults; track $index) {
                  <div class="flex items-start gap-2 text-xs">
                    <span [style.color]="tr.passed ? 'var(--success)' : 'var(--danger)'">
                      {{ tr.passed ? '✓' : '✖' }}
                    </span>
                    <span style="color: var(--text-secondary)">{{ tr.description }}</span>
                    @if (!tr.passed) {
                      <span style="color: var(--danger)" class="ml-auto font-mono">
                        {{ tr.error ?? ('got: ' + tr.actual) }}
                      </span>
                    }
                  </div>
                }
              </div>
            </div>
          }
        </div>
      } @else if (loading()) {
        <div class="flex items-center justify-center w-full" style="color: var(--text-muted)">
          Loading challenge…
        </div>
      }
    </div>
  `,
})
export class ChallengeDetailComponent implements OnInit {
  @ViewChild('editor') editorRef!: MonacoEditorComponent;
  private svc = inject(ChallengeService);
  private route = inject(ActivatedRoute);
  private store = inject(AppStore);

  challenge = signal<Challenge | null>(null);
  loading = signal(true);
  loadError = signal<string | null>(null);
  submitting = signal(false);
  submitError = signal<string | null>(null);
  result = signal<SubmitResult | null>(null);
  code = signal('');
  leftTab = signal<'description' | 'mentor'>('description');
  submitErrors = signal<Diagnostic[]>([]);
  toastMessage = signal<string | null>(null);

  difficultyColor(d: string) { return DIFFICULTY_COLORS[d] ?? '#888'; }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.svc.getOne(id).subscribe({
      next: (c) => {
        this.challenge.set(c);
        this.code.set(c.starterCode);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        this.loadError.set(err.status === 404 ? 'Challenge not found.' : 'Could not load challenge. Please try again.');
      },
    });
  }

  submit() {
    const c = this.challenge();
    if (!c) return;
    this.submitting.set(true);
    this.submitError.set(null);
    this.svc.submit(c.id, this.code()).subscribe({
      next: (r) => {
        this.result.set(r);
        this.submitting.set(false);
        if (r.xpEarned > 0) {
          this.store.updateUser({ xp: this.store.xp() + r.xpEarned });
          this.showToast(`+${r.xpEarned} XP earned!`);
        }
      },
      error: (err: HttpErrorResponse) => {
        this.submitting.set(false);
        const msg = err.error?.message ?? 'Submission failed. Please try again.';
        this.submitError.set(msg);
      },
    });
  }

  private showToast(message: string) {
    this.toastMessage.set(message);
    setTimeout(() => this.toastMessage.set(null), 3000);
  }
}
