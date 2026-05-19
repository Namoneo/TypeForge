import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppStore } from '../store/app.store';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private store = inject(AppStore);
  private readonly base = '/api';

  private headers(): HttpHeaders {
    const token = this.store.token();
    return token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : new HttpHeaders();
  }

  get<T>(path: string) {
    return this.http.get<T>(`${this.base}${path}`, { headers: this.headers() });
  }

  post<T>(path: string, body: unknown) {
    return this.http.post<T>(`${this.base}${path}`, body, { headers: this.headers() });
  }

  patch<T>(path: string, body: unknown) {
    return this.http.patch<T>(`${this.base}${path}`, body, { headers: this.headers() });
  }
}
