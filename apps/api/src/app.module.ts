import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ChallengesModule } from './challenges/challenges.module';
import { CompilerModule } from './compiler/compiler.module';
import { GatewayModule } from './gateway/gateway.module';
import { AiMentorModule } from './ai-mentor/ai-mentor.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ChallengesModule,
    CompilerModule,
    GatewayModule,
    AiMentorModule,
  ],
})
export class AppModule {}
