export interface User {
  id: string;
  email: string;
  username: string;
  xp: number;
  level: number;
  streak: number;
  lastActive: string;
  createdAt: string;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
}

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  xp: number;
  level: number;
  streak: number;
}
