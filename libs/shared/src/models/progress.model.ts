import type { TrackId } from './challenge.model';

export interface UserProgress {
  userId: string;
  totalXp: number;
  level: number;
  streak: number;
  tracks: TrackProgress[];
  recentActivity: Activity[];
}

export interface TrackProgress {
  trackId: TrackId;
  completedChallenges: number;
  totalChallenges: number;
  percentage: number;
  xpEarned: number;
}

export interface Activity {
  type: 'challenge_completed' | 'achievement_earned' | 'level_up' | 'streak';
  description: string;
  xp: number;
  timestamp: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  xp: number;
  level: number;
  streak: number;
}
