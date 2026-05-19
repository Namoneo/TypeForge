import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ChallengeService, Challenge, CreateChallengePayload } from '../../core/services/challenge.service';

type EditorMode = 'list' | 'create' | 'edit';

const EMPTY_FORM = (): CreateChallengePayload => ({
  title: '',
  description: '',
  difficulty: 'BEGINNER',
  track: 'beginner',
  starterCode: '',
  solutionCode: '',
  testCases: [{ description: '', input: '', expected: '' }],
  xpReward: 10,
  tags: [],
  published: false,
});

@Component({
  selector: 'tf-admin-challenges',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 max-w-5xl">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold" style="color: var(--text-primary)">Challenge Editor</h1>
        @if (mode() === 'list') {
          <button (click)="startCreate()" class="px-4 py-2 rounded-lg text-sm font-medium"
                  style="background: var(--accent); color: white">
            + New Challenge
          </button>
        } @else {
          <button (click)="mode.set('list'); loadChallenges()"
                  class="px-4 py-2 rounded-lg text-sm border"
                  style="border-color: var(--border); color: var(--text-secondary)">
            ← Back to list
          </button>
        }
      </div>

      @if (error()) {
        <div class="mb-4 px-4 py-3 rounded-lg text-sm" style="background: var(--danger); color: white">
          {{ error() }}
        </div>
      }

      @if (successMsg()) {
        <div class="mb-4 px-4 py-3 rounded-lg text-sm" style="background: var(--success); color: white">
          {{ successMsg() }}
        </div>
      }

      <!-- List mode -->
      @if (mode() === 'list') {
        @if (loading()) {
          <div style="color: var(--text-muted)">Loading challenges…</div>
        } @else {
          <div class="rounded-xl border overflow-hidden" style="border-color: var(--border)">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b text-left" style="border-color: var(--border); background: var(--bg-elevated)">
                  <th class="px-4 py-3 font-medium" style="color: var(--text-muted)">Title</th>
                  <th class="px-4 py-3 font-medium" style="color: var(--text-muted)">Track</th>
                  <th class="px-4 py-3 font-medium" style="color: var(--text-muted)">Difficulty</th>
                  <th class="px-4 py-3 font-medium" style="color: var(--text-muted)">Status</th>
                  <th class="px-4 py-3 font-medium" style="color: var(--text-muted)">Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (c of challenges(); track c.id) {
                  <tr class="border-b" style="border-color: var(--border); background: var(--bg-surface)">
                    <td class="px-4 py-3" style="color: var(--text-primary)">{{ c.title }}</td>
                    <td class="px-4 py-3" style="color: var(--text-secondary)">{{ c.track }}</td>
                    <td class="px-4 py-3" style="color: var(--text-secondary)">{{ c.difficulty }}</td>
                    <td class="px-4 py-3">
                      <span class="px-2 py-0.5 rounded-full text-xs"
                            [style.background]="c.published ? 'var(--success)' : 'var(--bg-elevated)'"
                            [style.color]="c.published ? 'white' : 'var(--text-muted)'">
                        {{ c.published ? 'Published' : 'Draft' }}
                      </span>
                    </td>
                    <td class="px-4 py-3">
                      <div class="flex gap-2">
                        <button (click)="startEdit(c)"
                                class="text-xs px-2 py-1 rounded border transition-colors"
                                style="border-color: var(--border); color: var(--text-secondary)">
                          Edit
                        </button>
                        <button (click)="deleteChallenge(c.id)"
                                class="text-xs px-2 py-1 rounded border transition-colors"
                                style="border-color: var(--danger); color: var(--danger)">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      }

      <!-- Create / Edit form -->
      @if (mode() === 'create' || mode() === 'edit') {
        <form (ngSubmit)="save()" class="space-y-5">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium mb-1" style="color: var(--text-muted)">Title</label>
              <input [(ngModel)]="form.title" name="title" required
                     class="w-full px-3 py-2 rounded-lg text-sm border outline-none"
                     style="background: var(--bg-elevated); border-color: var(--border); color: var(--text-primary)">
            </div>
            <div>
              <label class="block text-xs font-medium mb-1" style="color: var(--text-muted)">Track</label>
              <select [(ngModel)]="form.track" name="track"
                      class="w-full px-3 py-2 rounded-lg text-sm border outline-none"
                      style="background: var(--bg-elevated); border-color: var(--border); color: var(--text-primary)">
                @for (t of tracks; track t) {
                  <option [value]="t">{{ t }}</option>
                }
              </select>
            </div>
            <div>
              <label class="block text-xs font-medium mb-1" style="color: var(--text-muted)">Difficulty</label>
              <select [(ngModel)]="form.difficulty" name="difficulty"
                      class="w-full px-3 py-2 rounded-lg text-sm border outline-none"
                      style="background: var(--bg-elevated); border-color: var(--border); color: var(--text-primary)">
                @for (d of difficulties; track d) {
                  <option [value]="d">{{ d }}</option>
                }
              </select>
            </div>
            <div>
              <label class="block text-xs font-medium mb-1" style="color: var(--text-muted)">XP Reward</label>
              <input type="number" [(ngModel)]="form.xpReward" name="xpReward" min="1"
                     class="w-full px-3 py-2 rounded-lg text-sm border outline-none"
                     style="background: var(--bg-elevated); border-color: var(--border); color: var(--text-primary)">
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium mb-1" style="color: var(--text-muted)">Description</label>
            <textarea [(ngModel)]="form.description" name="description" rows="4" required
                      class="w-full px-3 py-2 rounded-lg text-sm border outline-none resize-y font-mono"
                      style="background: var(--bg-elevated); border-color: var(--border); color: var(--text-primary)"></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium mb-1" style="color: var(--text-muted)">Starter Code</label>
              <textarea [(ngModel)]="form.starterCode" name="starterCode" rows="8"
                        class="w-full px-3 py-2 rounded-lg text-sm border outline-none resize-y font-mono"
                        style="background: var(--bg-elevated); border-color: var(--border); color: var(--text-primary)"></textarea>
            </div>
            <div>
              <label class="block text-xs font-medium mb-1" style="color: var(--text-muted)">Solution Code</label>
              <textarea [(ngModel)]="form.solutionCode" name="solutionCode" rows="8"
                        class="w-full px-3 py-2 rounded-lg text-sm border outline-none resize-y font-mono"
                        style="background: var(--bg-elevated); border-color: var(--border); color: var(--text-primary)"></textarea>
            </div>
          </div>

          <!-- Test cases -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="text-xs font-medium" style="color: var(--text-muted)">Test Cases</label>
              <button type="button" (click)="addTestCase()"
                      class="text-xs px-2 py-1 rounded border"
                      style="border-color: var(--border); color: var(--text-secondary)">
                + Add
              </button>
            </div>
            <div class="space-y-2">
              @for (tc of form.testCases; track $index; let i = $index) {
                <div class="grid grid-cols-3 gap-2 items-start">
                  <input [(ngModel)]="tc.description" [name]="'tc-desc-' + i" placeholder="Description"
                         class="px-2 py-1.5 rounded-lg text-xs border outline-none"
                         style="background: var(--bg-elevated); border-color: var(--border); color: var(--text-primary)">
                  <input [(ngModel)]="tc.input" [name]="'tc-input-' + i" placeholder="Input (JS expression)"
                         class="px-2 py-1.5 rounded-lg text-xs border outline-none font-mono"
                         style="background: var(--bg-elevated); border-color: var(--border); color: var(--text-primary)">
                  <div class="flex gap-1">
                    <input [(ngModel)]="tc.expected" [name]="'tc-expected-' + i" placeholder="Expected value"
                           class="flex-1 px-2 py-1.5 rounded-lg text-xs border outline-none font-mono"
                           style="background: var(--bg-elevated); border-color: var(--border); color: var(--text-primary)">
                    @if (form.testCases.length > 1) {
                      <button type="button" (click)="removeTestCase(i)"
                              class="px-2 rounded text-xs"
                              style="color: var(--danger)">✕</button>
                    }
                  </div>
                </div>
              }
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium mb-1" style="color: var(--text-muted)">Tags (comma-separated)</label>
            <input [ngModel]="form.tags.join(', ')" (ngModelChange)="form.tags = $event.split(',').map(t => t.trim()).filter(t => t !== '')"
                   name="tags"
                   class="w-full px-3 py-2 rounded-lg text-sm border outline-none"
                   style="background: var(--bg-elevated); border-color: var(--border); color: var(--text-primary)">
          </div>

          <div class="flex items-center gap-2">
            <input type="checkbox" [(ngModel)]="form.published" name="published" id="published" class="rounded">
            <label for="published" class="text-sm" style="color: var(--text-secondary)">Published (visible to users)</label>
          </div>

          <div class="flex gap-3 pt-2">
            <button type="submit" [disabled]="saving()"
                    class="px-5 py-2 rounded-lg text-sm font-medium"
                    style="background: var(--accent); color: white"
                    [style.opacity]="saving() ? '0.6' : '1'">
              {{ saving() ? 'Saving…' : (mode() === 'create' ? 'Create Challenge' : 'Save Changes') }}
            </button>
            <button type="button" (click)="mode.set('list'); loadChallenges()"
                    class="px-5 py-2 rounded-lg text-sm border"
                    style="border-color: var(--border); color: var(--text-secondary)">
              Cancel
            </button>
          </div>
        </form>
      }
    </div>
  `,
})
export class AdminChallengesComponent implements OnInit {
  private svc = inject(ChallengeService);

  mode = signal<EditorMode>('list');
  challenges = signal<Challenge[]>([]);
  loading = signal(true);
  saving = signal(false);
  error = signal<string | null>(null);
  successMsg = signal<string | null>(null);

  form: CreateChallengePayload = EMPTY_FORM();
  editingId: string | null = null;

  tracks = ['beginner', 'intermediate', 'advanced', 'expert', 'enterprise'];
  difficulties = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'];

  ngOnInit() {
    this.loadChallenges();
  }

  loadChallenges() {
    this.loading.set(true);
    this.svc.adminGetAll().subscribe({
      next: (cs) => { this.challenges.set(cs); this.loading.set(false); },
      error: () => { this.loading.set(false); this.error.set('Failed to load challenges.'); },
    });
  }

  startCreate() {
    this.form = EMPTY_FORM();
    this.editingId = null;
    this.error.set(null);
    this.mode.set('create');
  }

  startEdit(c: Challenge) {
    this.error.set(null);
    this.svc.adminGetOne(c.id).subscribe({
      next: (full) => {
        this.form = {
          title: full.title,
          description: full.description,
          difficulty: full.difficulty,
          track: full.track,
          starterCode: full.starterCode,
          solutionCode: full.solutionCode ?? '',
          testCases: (full.testCases as any[]).map(tc => ({ ...tc })),
          xpReward: full.xpReward,
          tags: [...(full.tags ?? [])],
          published: full.published ?? false,
        };
        this.editingId = full.id;
        this.mode.set('edit');
      },
      error: () => this.error.set('Failed to load challenge for editing.'),
    });
  }

  save() {
    this.saving.set(true);
    this.error.set(null);
    const obs = this.editingId
      ? this.svc.adminUpdate(this.editingId, this.form)
      : this.svc.adminCreate(this.form);

    obs.subscribe({
      next: () => {
        this.saving.set(false);
        this.showSuccess(this.editingId ? 'Challenge updated.' : 'Challenge created.');
        this.mode.set('list');
        this.loadChallenges();
      },
      error: (err: HttpErrorResponse) => {
        this.saving.set(false);
        this.error.set(err.error?.message ?? 'Failed to save challenge.');
      },
    });
  }

  deleteChallenge(id: string) {
    if (!confirm('Delete this challenge? This cannot be undone.')) return;
    this.svc.adminDelete(id).subscribe({
      next: () => { this.showSuccess('Challenge deleted.'); this.loadChallenges(); },
      error: () => this.error.set('Failed to delete challenge.'),
    });
  }

  addTestCase() {
    this.form.testCases.push({ description: '', input: '', expected: '' });
  }

  removeTestCase(i: number) {
    this.form.testCases.splice(i, 1);
  }

  private showSuccess(msg: string) {
    this.successMsg.set(msg);
    setTimeout(() => this.successMsg.set(null), 3000);
  }
}
