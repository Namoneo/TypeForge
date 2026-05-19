import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChallengeService, Challenge } from '../../core/services/challenge.service';
import { TRACKS, DIFFICULTY_COLORS } from '@typeforge/shared/constants';

@Component({
  selector: 'tf-challenges',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="p-6 max-w-5xl">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold" style="color: var(--text-primary)">Challenges</h1>
        <div class="flex gap-2">
          <select [(ngModel)]="selectedTrack" (change)="load()"
                  class="text-sm px-3 py-1.5 rounded-md border"
                  style="background: var(--bg-surface); border-color: var(--border); color: var(--text-primary)">
            <option value="">All tracks</option>
            @for (t of tracks; track t.id) {
              <option [value]="t.id">{{ t.icon }} {{ t.name }}</option>
            }
          </select>
          <select [(ngModel)]="selectedDifficulty" (change)="load()"
                  class="text-sm px-3 py-1.5 rounded-md border"
                  style="background: var(--bg-surface); border-color: var(--border); color: var(--text-primary)">
            <option value="">All levels</option>
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
            <option value="EXPERT">Expert</option>
          </select>
        </div>
      </div>

      @if (loading()) {
        <div class="flex items-center justify-center py-16" style="color: var(--text-muted)">Loading challenges…</div>
      } @else if (challenges().length === 0) {
        <div class="text-center py-16" style="color: var(--text-muted)">No challenges found.</div>
      } @else {
        <div class="grid gap-3">
          @for (c of challenges(); track c.id) {
            <a [routerLink]="['/challenges', c.id]"
               class="flex items-start gap-4 p-4 rounded-xl border transition-colors cursor-pointer"
               style="background: var(--bg-surface); border-color: var(--border)"
               onmouseenter="this.style.borderColor='var(--accent)'" onmouseleave="this.style.borderColor='var(--border)'">
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-sm font-medium" style="color: var(--text-primary)">{{ c.title }}</span>
                  <span class="text-xs px-2 py-0.5 rounded-full font-mono"
                        [style.background]="difficultyColor(c.difficulty) + '20'"
                        [style.color]="difficultyColor(c.difficulty)">
                    {{ c.difficulty }}
                  </span>
                </div>
                <p class="text-xs line-clamp-2" style="color: var(--text-secondary)">{{ c.description }}</p>
                <div class="flex items-center gap-3 mt-2">
                  <span class="text-xs" style="color: var(--text-muted)">{{ c.track }}</span>
                  @for (tag of c.tags.slice(0, 3); track tag) {
                    <span class="text-xs px-1.5 py-0.5 rounded"
                          style="background: var(--bg-elevated); color: var(--text-muted)">{{ tag }}</span>
                  }
                </div>
              </div>
              <div class="text-right shrink-0">
                <div class="text-sm font-semibold" style="color: var(--accent)">+{{ c.xpReward }} XP</div>
              </div>
            </a>
          }
        </div>
      }
    </div>
  `,
})
export class ChallengesComponent implements OnInit {
  private svc = inject(ChallengeService);
  private route = inject(ActivatedRoute);

  tracks = TRACKS;
  challenges = signal<Challenge[]>([]);
  loading = signal(true);
  selectedTrack = '';
  selectedDifficulty = '';

  difficultyColor(d: string) { return DIFFICULTY_COLORS[d] ?? '#888'; }

  ngOnInit() {
    this.route.queryParams.subscribe((p) => {
      this.selectedTrack = p['track'] ?? '';
      this.load();
    });
  }

  load() {
    this.loading.set(true);
    this.svc.getAll(this.selectedTrack || undefined, this.selectedDifficulty || undefined).subscribe({
      next: (data) => { this.challenges.set(data); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }
}
