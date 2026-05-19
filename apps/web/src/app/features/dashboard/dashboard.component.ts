import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AppStore } from '../../core/store/app.store';
import { ApiService } from '../../core/services/api.service';
import { TRACKS, XP_PER_LEVEL } from '@typeforge/shared/constants';

@Component({
  selector: 'tf-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="p-6 max-w-5xl">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold" style="color: var(--text-primary)">
          Welcome back, {{ store.displayName() }} 👋
        </h1>
        <p class="text-sm mt-1" style="color: var(--text-secondary)">
          Keep up the momentum — you're on a {{ store.streak() }}-day streak!
        </p>
      </div>

      <!-- Stats row -->
      <div class="grid grid-cols-4 gap-4 mb-8">
        @for (stat of stats(); track stat.label) {
          <div class="rounded-xl p-4 border" style="background: var(--bg-surface); border-color: var(--border)">
            <div class="text-2xl font-bold" style="color: var(--text-primary)">{{ stat.value }}</div>
            <div class="text-xs mt-1" style="color: var(--text-secondary)">{{ stat.label }}</div>
          </div>
        }
      </div>

      <!-- Level progress -->
      <div class="rounded-xl p-5 border mb-8" style="background: var(--bg-surface); border-color: var(--border)">
        <div class="flex justify-between items-center mb-3">
          <span class="text-sm font-medium" style="color: var(--text-primary)">Level {{ store.level() }}</span>
          <span class="text-xs" style="color: var(--text-muted)">{{ store.xp() }} / {{ nextLevelXp() }} XP</span>
        </div>
        <div class="h-2 rounded-full overflow-hidden" style="background: var(--bg-elevated)">
          <div class="h-full rounded-full transition-all duration-700"
               style="background: var(--accent)"
               [style.width]="xpProgress() + '%'"></div>
        </div>
      </div>

      <!-- Tracks -->
      <h2 class="text-lg font-semibold mb-4" style="color: var(--text-primary)">Learning Tracks</h2>
      <div class="grid grid-cols-3 gap-4 mb-8">
        @for (track of tracks; track track.id) {
          <a [routerLink]="['/challenges']" [queryParams]="{ track: track.id }"
             class="rounded-xl p-4 border transition-colors cursor-pointer block"
             style="background: var(--bg-surface); border-color: var(--border)"
             onmouseenter="this.style.borderColor='var(--accent)'" onmouseleave="this.style.borderColor='var(--border)'">
            <div class="text-2xl mb-2">{{ track.icon }}</div>
            <div class="font-medium text-sm mb-1" style="color: var(--text-primary)">{{ track.name }}</div>
            <div class="text-xs" style="color: var(--text-muted)">{{ trackDescriptions[track.id] }}</div>
          </a>
        }
      </div>

      <!-- Quick actions -->
      <div class="flex gap-3">
        <a routerLink="/playground"
           class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-opacity"
           style="background: var(--accent); color: white">
          ▶ Open Playground
        </a>
        <a routerLink="/challenges"
           class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors"
           style="border-color: var(--border); color: var(--text-primary)"
           onmouseenter="this.style.borderColor='var(--accent)'" onmouseleave="this.style.borderColor='var(--border)'">
          ⚡ Today's Challenge
        </a>
      </div>
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  store = inject(AppStore);
  private api = inject(ApiService);

  tracks = TRACKS;
  progress = signal<any>(null);

  trackDescriptions: Record<string, string> = {
    beginner: 'Variables, functions, interfaces',
    intermediate: 'Generics, mapped types, utility types',
    advanced: 'Conditional types, template literals',
    expert: 'Type-level programming, compiler internals',
    enterprise: 'Angular, NestJS, Prisma, Zod',
  };

  stats = signal([
    { label: 'Total XP', value: '0' },
    { label: 'Level', value: '1' },
    { label: 'Streak', value: '0 days' },
    { label: 'Challenges', value: '0' },
  ]);

  xpProgress = () => {
    const xp = this.store.xp();
    return Math.min(((xp % XP_PER_LEVEL) / XP_PER_LEVEL) * 100, 100);
  };

  nextLevelXp = () => this.store.level() * XP_PER_LEVEL;

  ngOnInit() {
    this.stats.set([
      { label: 'Total XP', value: this.store.xp().toLocaleString() },
      { label: 'Level', value: String(this.store.level()) },
      { label: 'Streak', value: `${this.store.streak()} days` },
      { label: 'Challenges', value: '—' },
    ]);
  }
}
