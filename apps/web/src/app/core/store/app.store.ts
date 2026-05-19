import { Injectable, signal, computed } from '@angular/core';

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  role: string;
  xp: number;
  level: number;
  streak: number;
}

export interface AppState {
  user: AuthUser | null;
  accessToken: string | null;
}

@Injectable({ providedIn: 'root' })
export class AppStore {
  private readonly _user = signal<AuthUser | null>(null);
  private readonly _token = signal<string | null>(null);

  readonly user = this._user.asReadonly();
  readonly token = this._token.asReadonly();
  readonly isLoggedIn = computed(() => this._user() !== null && this._token() !== null);
  readonly isAdmin = computed(() => this._user()?.role === 'ADMIN');
  readonly displayName = computed(() => this._user()?.username ?? 'Guest');
  readonly xp = computed(() => this._user()?.xp ?? 0);
  readonly level = computed(() => this._user()?.level ?? 1);
  readonly streak = computed(() => this._user()?.streak ?? 0);

  setAuth(user: AuthUser, accessToken: string) {
    this._user.set(user);
    this._token.set(accessToken);
    localStorage.setItem('tf_token', accessToken);
    localStorage.setItem('tf_user', JSON.stringify(user));
  }

  updateUser(partial: Partial<AuthUser>) {
    const current = this._user();
    if (current) {
      const updated = { ...current, ...partial };
      this._user.set(updated);
      localStorage.setItem('tf_user', JSON.stringify(updated));
    }
  }

  clearAuth() {
    this._user.set(null);
    this._token.set(null);
    localStorage.removeItem('tf_token');
    localStorage.removeItem('tf_user');
    localStorage.removeItem('tf_refresh');
  }

  hydrateFromStorage() {
    const token = localStorage.getItem('tf_token');
    const userJson = localStorage.getItem('tf_user');
    if (token && userJson) {
      try {
        this._token.set(token);
        this._user.set(JSON.parse(userJson));
      } catch {
        this.clearAuth();
      }
    }
  }
}
