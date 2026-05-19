import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { LoggerModule } from 'nestjs-pino';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ChallengesModule } from './challenges/challenges.module';
import { CompilerModule } from './compiler/compiler.module';
import { GatewayModule } from './gateway/gateway.module';
import { AiMentorModule } from './ai-mentor/ai-mentor.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        transport: process.env.NODE_ENV !== 'production'
          ? { target: 'pino-pretty', options: { colorize: true, singleLine: true } }
          : undefined,
        redact: ['req.headers.authorization', 'req.headers.cookie'],
      },
    }),
    ThrottlerModule.forRoot([
      {
        name: 'global',
        ttl: 60000,  // 1 minute
        limit: 120,  // 120 req/min default
      },
    ]),
    PrismaModule,
    AuthModule,
    UsersModule,
    ChallengesModule,
    CompilerModule,
    GatewayModule,
    AiMentorModule,
    HealthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
