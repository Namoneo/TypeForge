import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'tf-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center p-4" style="background: var(--bg-base)">
      <div class="w-full max-w-sm">
        <!-- Logo -->
        <div class="text-center mb-8">
          <span class="text-3xl">⚒</span>
          <h1 class="mt-2 text-xl font-bold" style="color: var(--text-primary)">TypeForge</h1>
          <p class="text-sm mt-1" style="color: var(--text-secondary)">
            {{ isLogin() ? 'Sign in to continue mastering TypeScript' : 'Start your TypeScript journey' }}
          </p>
        </div>

        <!-- Card -->
        <div class="rounded-xl p-6 border" style="background: var(--bg-surface); border-color: var(--border)">
          <!-- Tabs -->
          <div class="flex rounded-lg p-1 mb-6" style="background: var(--bg-elevated)">
            <button (click)="setMode(true)" class="flex-1 py-1.5 text-sm rounded-md font-medium transition-colors"
                    [style.background]="isLogin() ? 'var(--bg-surface)' : 'transparent'"
                    [style.color]="isLogin() ? 'var(--text-primary)' : 'var(--text-muted)'">
              Sign in
            </button>
            <button (click)="setMode(false)" class="flex-1 py-1.5 text-sm rounded-md font-medium transition-colors"
                    [style.background]="!isLogin() ? 'var(--bg-surface)' : 'transparent'"
                    [style.color]="!isLogin() ? 'var(--text-primary)' : 'var(--text-muted)'">
              Create account
            </button>
          </div>

          <!-- Form -->
          <form (ngSubmit)="submit()" #f="ngForm" class="flex flex-col gap-3">
            @if (!isLogin()) {
              <input name="username" [(ngModel)]="username" placeholder="Username" required
                     class="input" />
            }
            <input name="email" [(ngModel)]="email" type="email" placeholder="Email" required class="input" />
            <input name="password" [(ngModel)]="password" type="password" placeholder="Password" required minlength="8" class="input" />

            @if (error()) {
              <p class="text-xs rounded-md px-3 py-2" style="background: #ef444420; color: var(--danger)">{{ error() }}</p>
            }

            <button type="submit" [disabled]="loading()"
                    class="mt-1 py-2 rounded-md text-sm font-medium transition-opacity"
                    style="background: var(--accent); color: white"
                    [style.opacity]="loading() ? '0.6' : '1'">
              {{ loading() ? 'Please wait…' : (isLogin() ? 'Sign in' : 'Create account') }}
            </button>

            @if (isLogin()) {
              <a routerLink="/auth/reset-password" class="text-xs text-center"
                 style="color: var(--text-muted)">Forgot password?</a>
            }
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .input {
      background: var(--bg-elevated);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 8px 12px;
      font-size: 14px;
      color: var(--text-primary);
      outline: none;
      transition: border-color 0.15s;
      width: 100%;
    }
    .input:focus { border-color: var(--accent); }
    .input::placeholder { color: var(--text-muted); }
  `],
})
export class AuthComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  isLogin = signal(true);
  loading = signal(false);
  error = signal('');

  email = '';
  password = '';
  username = '';

  setMode(login: boolean) {
    this.isLogin.set(login);
    this.error.set('');
  }

  submit() {
    this.error.set('');
    this.loading.set(true);
    const obs = this.isLogin()
      ? this.authService.login(this.email, this.password)
      : this.authService.register(this.email, this.username, this.password);

    obs.subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => {
        this.error.set(err?.error?.message ?? 'Something went wrong');
        this.loading.set(false);
      },
    });
  }
}
