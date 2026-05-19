import type { Difficulty, TrackId } from '../models/challenge.model';

export interface SubmitChallengeDto {
  challengeId: string;
  code: string;
}

export interface ChallengeResultDto {
  passed: boolean;
  score: number;
  xpEarned: number;
  errors: string[];
  testResults: TestResult[];
  feedback?: string;
}

export interface TestResult {
  description: string;
  passed: boolean;
  expected: string;
  actual?: string;
  error?: string;
}

export interface CreateChallengeDto {
  title: string;
  description: string;
  difficulty: Difficulty;
  track: TrackId;
  starterCode: string;
  solutionCode: string;
  testCases: Array<{ description: string; input?: string; expected: string }>;
  xpReward?: number;
  tags?: string[];
}
