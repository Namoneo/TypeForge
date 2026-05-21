import { ConfigService } from '@nestjs/config';

export type AiMentorProvider = 'api' | 'cli' | 'openrouter';

export function resolveAiMentorProvider(
  config: ConfigService,
): AiMentorProvider {
  const requested = config.get<string>('AI_MENTOR_PROVIDER')?.toLowerCase();

  if (requested === 'openrouter') {
    return 'openrouter';
  }

  if (requested !== 'cli') {
    return 'api';
  }

  const nodeEnv = config.get<string>('NODE_ENV') ?? 'development';
  if (nodeEnv === 'production') {
    return 'api';
  }

  return 'cli';
}
