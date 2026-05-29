import { Injectable, inject, OnDestroy } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { AppStore } from '../store/app.store';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RealtimeService implements OnDestroy {
  private socket: Socket | null = null;
  private store = inject(AppStore);

  connect() {
    if (this.socket?.connected) return;

    const token = this.store.token();
    if (!token) return;

    const wsUrl = environment.wsBase
      ? `${environment.wsBase}/typeforge`
      : '/typeforge';
    this.socket = io(wsUrl, {
      auth: { token },
      transports: ['websocket'],
    });

    this.socket.on('xp:gained', (data: { xp: number; newTotal: number }) => {
      this.store.updateUser({ xp: data.newTotal });
    });

    this.socket.on('error', () => {
      this.disconnect();
    });
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }

  ngOnDestroy() {
    this.disconnect();
  }
}
