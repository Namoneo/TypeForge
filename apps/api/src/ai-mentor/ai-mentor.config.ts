import { ConfigService } from '@nestjs/config';

export type AiMentorProvider = 'api' | 'cli' | 'openrouter' | 'gemini';

export function resolveAiMentorProvider(
  config: ConfigService,
): AiMentorProvider {
  const requested = config.get<string>('AI_MENTOR_PROVIDER')?.toLowerCase();

  switch (requested) {
    case 'gemini':
      return 'gemini';
    case 'openrouter':
      return 'openrouter';
    case 'cli': {
      const nodeEnv = config.get<string>('NODE_ENV') ?? 'development';
      return nodeEnv === 'production' ? 'api' : 'cli';
    }
    case 'api':
    case undefined:
    case '':
      return 'api';
    default:
      return 'api';
  }
}
