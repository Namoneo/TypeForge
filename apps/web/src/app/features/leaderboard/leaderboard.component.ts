import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { AppStore } from '../../core/store/app.store';

interface LeaderboardEntry {
  rank: number;
  id: string;
  username: string;
  xp: number;
  level: number;
  streak: number;
}

@Component({
  selector: 'tf-leaderboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6 max-w-2xl">
      <h1 class="text-2xl font-bold mb-6" style="color: var(--text-primary)">Leaderboard</h1>

      @if (loading()) {
        <div class="text-center py-16" style="color: var(--text-muted)">Loading…</div>
      } @else {
        <div class="rounded-xl border overflow-hidden" style="border-color: var(--border)">
          @for (entry of entries(); track entry.id; let i = $index) {
            <div class="flex items-center gap-4 px-4 py-3 border-b transition-colors"
                 [class.bg-accent-glow]="entry.id === store.user()?.id"
                 [style.borderColor]="'var(--border)'"
                 [style.background]="entry.id === store.user()?.id ? 'var(--accent)20' : (i % 2 === 0 ? 'var(--bg-surface)' : 'var(--bg-elevated)')">
              <!-- Rank -->
              <div class="w-8 text-center text-sm font-bold"
                   [style.color]="entry.rank <= 3 ? ['#f59e0b','#9ca3af','#b45309'][entry.rank-1] : 'var(--text-muted)'">
                {{ entry.rank <= 3 ? ['🥇','🥈','🥉'][entry.rank-1] : entry.rank }}
              </div>
              <!-- Avatar -->
              <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                   style="background: var(--accent); color: white">
                {{ entry.username[0].toUpperCase() }}
              </div>
              <!-- Name -->
              <div class="flex-1">
                <div class="text-sm font-medium" style="color: var(--text-primary)">
                  {{ entry.username }}
                  @if (entry.id === store.user()?.id) {
                    <span class="ml-1 text-xs" style="color: var(--accent)">(you)</span>
                  }
                </div>
                <div class="text-xs" style="color: var(--text-muted)">Level {{ entry.level }} · {{ entry.streak }}🔥</div>
              </div>
              <!-- XP -->
              <div class="text-sm font-semibold" style="color: var(--accent)">
                {{ entry.xp.toLocaleString() }} XP
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class LeaderboardComponent implements OnInit {
  private api = inject(ApiService);
  store = inject(AppStore);

  entries = signal<LeaderboardEntry[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.api.get<LeaderboardEntry[]>('/users/leaderboard').subscribe({
      next: (data) => { this.entries.set(data); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }
}
