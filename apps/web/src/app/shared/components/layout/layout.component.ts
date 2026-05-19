import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppStore } from '../../../core/store/app.store';
import { AuthService } from '../../../core/services/auth.service';
import { RealtimeService } from '../../../core/services/realtime.service';

@Component({
  selector: 'tf-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="flex h-screen overflow-hidden" style="background: var(--bg-base)">
      <!-- Sidebar -->
      <nav class="flex flex-col w-56 shrink-0 border-r" style="background: var(--bg-surface); border-color: var(--border)">
        <!-- Logo -->
        <div class="flex items-center gap-2 px-4 py-4 border-b" style="border-color: var(--border)">
          <span class="text-lg font-bold" style="color: var(--accent)">⚒</span>
          <span class="font-semibold tracking-tight" style="color: var(--text-primary)">TypeForge</span>
        </div>

        <!-- Nav links -->
        <div class="flex flex-col gap-1 p-2 flex-1">
          @for (item of navItems; track item.path) {
            <a [routerLink]="item.path" routerLinkActive="nav-active"
               class="nav-item flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors">
              <span>{{ item.icon }}</span>
              <span>{{ item.label }}</span>
            </a>
          }
          @if (store.isAdmin()) {
            <div class="mt-2 pt-2 border-t" style="border-color: var(--border)">
              <a routerLink="/admin/challenges" routerLinkActive="nav-active"
                 class="nav-item flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors">
                <span>⚙</span>
                <span>Admin</span>
              </a>
            </div>
          }
        </div>

        <!-- User info -->
        @if (store.isLoggedIn()) {
          <div class="p-3 border-t" style="border-color: var(--border)">
            <div class="flex items-center gap-2 px-2 py-1">
              <div class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                   style="background: var(--accent); color: white">
                {{ store.displayName()[0].toUpperCase() }}
              </div>
              <div class="flex-1 min-w-0">
                <div class="text-xs font-medium truncate" style="color: var(--text-primary)">{{ store.displayName() }}</div>
                <div class="text-xs" style="color: var(--text-muted)">Lvl {{ store.level() }} · {{ store.xp() }} XP</div>
              </div>
            </div>
            <button (click)="auth.logout()" class="mt-2 w-full text-xs px-3 py-1.5 rounded-md text-left transition-colors"
                    style="color: var(--text-secondary)" onmouseenter="this.style.color='var(--text-primary)'" onmouseleave="this.style.color='var(--text-secondary)'">
              Sign out
            </button>
          </div>
        }
      </nav>

      <!-- Main content -->
      <main class="flex-1 overflow-auto">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [`
    .nav-item { color: var(--text-secondary); }
    .nav-item:hover { background: var(--bg-hover); color: var(--text-primary); }
    .nav-active { background: var(--bg-hover) !important; color: var(--text-primary) !important; }
  `],
})
export class LayoutComponent implements OnInit {
  store = inject(AppStore);
  auth = inject(AuthService);
  private realtime = inject(RealtimeService);

  navItems = [
    { path: '/dashboard', icon: '⊞', label: 'Dashboard' },
    { path: '/playground', icon: '▶', label: 'Playground' },
    { path: '/challenges', icon: '⚡', label: 'Challenges' },
    { path: '/learn', icon: '📚', label: 'Learning Tracks' },
    { path: '/leaderboard', icon: '🏆', label: 'Leaderboard' },
  ];

  ngOnInit() {
    this.realtime.connect();
  }
}
