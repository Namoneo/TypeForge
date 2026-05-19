export type Difficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
export type TrackId = 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'enterprise';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  track: TrackId;
  starterCode: string;
  testCases: TestCase[];
  xpReward: number;
  tags: string[];
  createdAt: string;
}

export interface TestCase {
  description: string;
  input?: string;
  expected: string;
}

export interface ChallengeAttempt {
  id: string;
  challengeId: string;
  userId: string;
  code: string;
  passed: boolean;
  score: number;
  errors: string[];
  createdAt: string;
}

export interface LearningTrack {
  id: TrackId;
  name: string;
  description: string;
  order: number;
  challenges: Challenge[];
  prerequisites: TrackId[];
}
