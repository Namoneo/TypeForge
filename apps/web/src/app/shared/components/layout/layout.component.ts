import { Component, inject, OnInit, signal } from '@angular/core';
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

      <!-- Mobile backdrop -->
      @if (sidebarOpen()) {
        <div class="fixed inset-0 bg-black/60 z-20 md:hidden"
             (click)="sidebarOpen.set(false)"></div>
      }

      <!-- Sidebar -->
      <nav class="flex flex-col w-56 shrink-0 border-r z-30
                  fixed inset-y-0 left-0 transition-transform duration-200
                  md:relative md:translate-x-0"
           [class."-translate-x-full"]="!sidebarOpen()"
           style="background: var(--bg-surface); border-color: var(--border)">

        <!-- Logo -->
        <div class="flex items-center gap-2 px-4 py-4 border-b" style="border-color: var(--border)">
          <span class="text-lg font-bold" style="color: var(--accent)">⚒</span>
          <span class="font-semibold tracking-tight" style="color: var(--text-primary)">TypeForge</span>
          <!-- Close button (mobile only) -->
          <button (click)="sidebarOpen.set(false)"
                  class="ml-auto md:hidden text-lg leading-none"
                  style="color: var(--text-muted)">✕</button>
        </div>

        <!-- Nav links -->
        <div class="flex flex-col gap-1 p-2 flex-1">
          @for (item of navItems; track item.path) {
            <a [routerLink]="item.path" routerLinkActive="nav-active"
               (click)="sidebarOpen.set(false)"
               class="nav-item flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors">
              <span>{{ item.icon }}</span>
              <span>{{ item.label }}</span>
            </a>
          }
          @if (store.isAdmin()) {
            <div class="mt-2 pt-2 border-t" style="border-color: var(--border)">
              <a routerLink="/admin/challenges" routerLinkActive="nav-active"
                 (click)="sidebarOpen.set(false)"
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
      <div class="flex-1 flex flex-col overflow-hidden min-w-0">
        <!-- Mobile top bar -->
        <div class="flex items-center gap-3 px-4 py-3 border-b shrink-0 md:hidden"
             style="background: var(--bg-surface); border-color: var(--border)">
          <button (click)="sidebarOpen.set(true)"
                  class="text-xl leading-none"
                  style="color: var(--text-secondary)">☰</button>
          <span class="font-semibold tracking-tight text-sm" style="color: var(--text-primary)">TypeForge</span>
        </div>

        <main class="flex-1 overflow-auto">
          <router-outlet />
        </main>
      </div>
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

  sidebarOpen = signal(false);

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
