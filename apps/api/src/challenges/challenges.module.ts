import { Module } from '@nestjs/common';
import { ChallengesController } from './challenges.controller';
import { AdminChallengesController } from './admin-challenges.controller';
import { ChallengesService } from './challenges.service';
import { CompilerModule } from '../compiler/compiler.module';

@Module({
  imports: [CompilerModule],
  controllers: [ChallengesController, AdminChallengesController],
  providers: [ChallengesService],
})
export class ChallengesModule {}
