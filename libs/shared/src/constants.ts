export const TRACKS = [
  { id: 'beginner', name: 'Beginner', order: 1, color: '#22c55e', icon: '🌱' },
  { id: 'intermediate', name: 'Intermediate', order: 2, color: '#3b82f6', icon: '⚡' },
  { id: 'advanced', name: 'Advanced', order: 3, color: '#8b5cf6', icon: '🔥' },
  { id: 'expert', name: 'Expert', order: 4, color: '#f59e0b', icon: '💎' },
  { id: 'enterprise', name: 'Enterprise', order: 5, color: '#ef4444', icon: '🏢' },
] as const;

export const XP_PER_LEVEL = 1000;
export const STREAK_BONUS_MULTIPLIER = 1.1;

export const DIFFICULTY_COLORS: Record<string, string> = {
  BEGINNER: '#22c55e',
  INTERMEDIATE: '#3b82f6',
  ADVANCED: '#8b5cf6',
  EXPERT: '#f59e0b',
};

export const API_BASE = '/api';
export const WS_NAMESPACE = '/typeforge';
