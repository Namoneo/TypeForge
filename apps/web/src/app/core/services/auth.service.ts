import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { AppStore } from '../store/app.store';

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: { id: string; email: string; username: string; role: string; xp: number; level: number; streak: number };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private store = inject(AppStore);
  private router = inject(Router);

  register(email: string, username: string, password: string) {
    return this.http.post<AuthResponse>('/api/auth/register', { email, username, password }).pipe(
      tap((res) => this.handleAuth(res)),
    );
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponse>('/api/auth/login', { email, password }).pipe(
      tap((res) => this.handleAuth(res)),
    );
  }

  logout() {
    const token = this.store.token();
    if (token) {
      this.http.post('/api/auth/logout', {}, {
        headers: { Authorization: `Bearer ${token}` },
      }).subscribe();
    }
    this.store.clearAuth();
    this.router.navigate(['/auth/login']);
  }

  clearSession() {
    this.store.clearAuth();
    localStorage.removeItem('tf_refresh');
  }

  private handleAuth(res: AuthResponse) {
    localStorage.setItem('tf_refresh', res.refreshToken);
    this.store.setAuth(res.user, res.accessToken);
  }
}
