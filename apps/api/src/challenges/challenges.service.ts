import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CompilerService } from '../compiler/compiler.service';
import { Difficulty } from '@prisma/client';
import { IsString, IsEnum, IsOptional, IsInt, IsArray, Min } from 'class-validator';

export class CreateChallengeDto {
  @IsString() title: string;
  @IsString() description: string;
  @IsEnum(Difficulty) difficulty: Difficulty;
  @IsString() track: string;
  @IsString() starterCode: string;
  @IsString() solutionCode: string;
  testCases: Array<{ description: string; input?: string; expected: string }>;
  @IsOptional() @IsInt() @Min(1) xpReward?: number;
  @IsOptional() @IsArray() tags?: string[];
}

export class SubmitChallengeDto {
  @IsString() challengeId: string;
  @IsString() code: string;
}

@Injectable()
export class ChallengesService {
  constructor(
    private prisma: PrismaService,
    private compiler: CompilerService,
  ) {}

  findAll(track?: string, difficulty?: Difficulty) {
    return this.prisma.challenge.findMany({
      where: {
        published: true,
        ...(track && { track }),
        ...(difficulty && { difficulty }),
      },
      orderBy: [{ track: 'asc' }, { order: 'asc' }],
      select: {
        id: true, title: true, description: true,
        difficulty: true, track: true, xpReward: true,
        tags: true, createdAt: true,
      },
    });
  }

  async findOne(id: string) {
    const challenge = await this.prisma.challenge.findUnique({
      where: { id, published: true },
    });
    if (!challenge) throw new NotFoundException('Challenge not found');
    // Strip solution from response
    const { solutionCode: _, ...safe } = challenge;
    return safe;
  }

  create(dto: CreateChallengeDto) {
    return this.prisma.challenge.create({
      data: {
        ...dto,
        testCases: dto.testCases as any,
        tags: dto.tags ?? [],
      },
    });
  }

  async submit(userId: string, dto: SubmitChallengeDto) {
    const challenge = await this.prisma.challenge.findUnique({
      where: { id: dto.challengeId, published: true },
    });
    if (!challenge) throw new NotFoundException('Challenge not found');

    const testCases = challenge.testCases as Array<{ description: string; input?: string; expected: string }>;
    const result = await this.compiler.runChallenge(dto.code, testCases);

    const attempt = await this.prisma.challengeAttempt.create({
      data: {
        userId,
        challengeId: dto.challengeId,
        code: dto.code,
        passed: result.passed,
        score: result.score,
        errors: result.errors,
      },
    });

    let xpEarned = 0;
    if (result.passed) {
      xpEarned = challenge.xpReward;
      await this.prisma.user.update({
        where: { id: userId },
        data: { xp: { increment: xpEarned } },
      });
      await this.prisma.trackProgress.upsert({
        where: { userId_trackId: { userId, trackId: challenge.track } },
        create: { userId, trackId: challenge.track, xpEarned },
        update: { xpEarned: { increment: xpEarned } },
      });
    }

    return { ...result, xpEarned, attemptId: attempt.id };
  }

  getUserAttempts(userId: string, challengeId?: string) {
    return this.prisma.challengeAttempt.findMany({
      where: { userId, ...(challengeId && { challengeId }) },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }
}
