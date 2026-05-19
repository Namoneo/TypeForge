import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  track: string;
  starterCode: string;
  solutionCode?: string;
  testCases: Array<{ description: string; input?: string; expected: string }>;
  xpReward: number;
  tags: string[];
  order?: number;
  published?: boolean;
}

export interface SubmitResult {
  passed: boolean;
  score: number;
  xpEarned: number;
  errors: string[];
  testResults: Array<{ description: string; passed: boolean; expected: string; actual?: string; error?: string }>;
}

export interface CreateChallengePayload {
  title: string;
  description: string;
  difficulty: string;
  track: string;
  starterCode: string;
  solutionCode: string;
  testCases: Array<{ description: string; input?: string; expected: string }>;
  xpReward: number;
  tags: string[];
  published: boolean;
}

@Injectable({ providedIn: 'root' })
export class ChallengeService {
  private api = inject(ApiService);

  getAll(track?: string, difficulty?: string) {
    const params = new URLSearchParams();
    if (track) params.set('track', track);
    if (difficulty) params.set('difficulty', difficulty);
    const qs = params.toString();
    return this.api.get<Challenge[]>(`/challenges${qs ? '?' + qs : ''}`);
  }

  getOne(id: string) {
    return this.api.get<Challenge>(`/challenges/${id}`);
  }

  submit(challengeId: string, code: string) {
    return this.api.post<SubmitResult>('/challenges/submit', { challengeId, code });
  }

  // Admin methods
  adminGetAll() {
    return this.api.get<Challenge[]>('/admin/challenges');
  }

  adminGetOne(id: string) {
    return this.api.get<Challenge>(`/admin/challenges/${id}`);
  }

  adminCreate(payload: CreateChallengePayload) {
    return this.api.post<Challenge>('/challenges', payload);
  }

  adminUpdate(id: string, payload: Partial<CreateChallengePayload>) {
    return this.api.patch<Challenge>(`/challenges/${id}`, payload);
  }

  adminDelete(id: string) {
    return this.api.delete<void>(`/challenges/${id}`);
  }
}
