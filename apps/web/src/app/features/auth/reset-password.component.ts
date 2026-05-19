import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'tf-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center p-4" style="background: var(--bg-base)">
      <div class="w-full max-w-sm">
        <div class="text-center mb-8">
          <span class="text-3xl">⚒</span>
          <h1 class="mt-2 text-xl font-bold" style="color: var(--text-primary)">TypeForge</h1>
        </div>

        <div class="rounded-xl p-6 border" style="background: var(--bg-surface); border-color: var(--border)">
          @if (mode() === 'forgot') {
            <h2 class="text-base font-semibold mb-4" style="color: var(--text-primary)">Reset password</h2>
            <p class="text-sm mb-4" style="color: var(--text-secondary)">
              Enter your email and we'll send you a link to reset your password.
            </p>

            @if (sent()) {
              <div class="rounded-md px-3 py-3 text-sm" style="background: #22c55e20; color: #22c55e">
                Check your email for a reset link. It expires in 1 hour.
              </div>
            } @else {
              <form (ngSubmit)="sendReset()" class="flex flex-col gap-3">
                <input name="email" [(ngModel)]="email" type="email" placeholder="Email" required class="input" />

                @if (error()) {
                  <p class="text-xs rounded-md px-3 py-2" style="background: #ef444420; color: var(--danger)">{{ error() }}</p>
                }

                <button type="submit" [disabled]="loading()"
                        class="py-2 rounded-md text-sm font-medium"
                        style="background: var(--accent); color: white"
                        [style.opacity]="loading() ? '0.6' : '1'">
                  {{ loading() ? 'Sending…' : 'Send reset link' }}
                </button>
              </form>
            }
          }

          @if (mode() === 'reset') {
            <h2 class="text-base font-semibold mb-4" style="color: var(--text-primary)">Set new password</h2>

            @if (done()) {
              <div class="rounded-md px-3 py-3 text-sm mb-3" style="background: #22c55e20; color: #22c55e">
                Password updated! You can now sign in.
              </div>
              <a routerLink="/auth" class="block text-center text-sm" style="color: var(--accent)">Go to sign in</a>
            } @else {
              <form (ngSubmit)="doReset()" class="flex flex-col gap-3">
                <input name="password" [(ngModel)]="newPassword" type="password"
                       placeholder="New password (min 8 chars)" required minlength="8" class="input" />

                @if (error()) {
                  <p class="text-xs rounded-md px-3 py-2" style="background: #ef444420; color: var(--danger)">{{ error() }}</p>
                }

                <button type="submit" [disabled]="loading()"
                        class="py-2 rounded-md text-sm font-medium"
                        style="background: var(--accent); color: white"
                        [style.opacity]="loading() ? '0.6' : '1'">
                  {{ loading() ? 'Saving…' : 'Set new password' }}
                </button>
              </form>
            }
          }

          @if (mode() === 'invalid') {
            <p class="text-sm" style="color: var(--danger)">
              This reset link is invalid or has expired. <a routerLink="/auth/reset-password" style="color: var(--accent)">Request a new one.</a>
            </p>
          }

          <p class="text-xs text-center mt-4" style="color: var(--text-muted)">
            <a routerLink="/auth" style="color: var(--accent)">Back to sign in</a>
          </p>
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
      width: 100%;
    }
    .input:focus { border-color: var(--accent); }
    .input::placeholder { color: var(--text-muted); }
  `],
})
export class ResetPasswordComponent implements OnInit {
  private auth = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  mode = signal<'forgot' | 'reset' | 'invalid'>('forgot');
  loading = signal(false);
  error = signal('');
  sent = signal(false);
  done = signal(false);

  email = '';
  newPassword = '';
  private token = '';

  ngOnInit() {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (token) {
      this.token = token;
      this.mode.set('reset');
    }
  }

  sendReset() {
    this.error.set('');
    this.loading.set(true);
    this.auth.forgotPassword(this.email).subscribe({
      next: () => { this.sent.set(true); this.loading.set(false); },
      error: () => { this.error.set('Something went wrong. Please try again.'); this.loading.set(false); },
    });
  }

  doReset() {
    this.error.set('');
    this.loading.set(true);
    this.auth.resetPassword(this.token, this.newPassword).subscribe({
      next: () => { this.done.set(true); this.loading.set(false); },
      error: (err) => {
        const msg = err?.error?.message ?? 'Invalid or expired link';
        if (msg.includes('Invalid or expired')) this.mode.set('invalid');
        else this.error.set(msg);
        this.loading.set(false);
      },
    });
  }
}
