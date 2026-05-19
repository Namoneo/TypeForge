import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
const XP_PER_LEVEL = 1000;

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        progress: true,
        achievements: { include: { achievement: true } },
      },
    });
    if (!user) throw new NotFoundException();
    const { password, refreshToken, ...safe } = user;
    return { ...safe, level: this.calculateLevel(safe.xp) };
  }

  async getProgress(userId: string) {
    const [user, progress, recentAttempts] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: userId } }),
      this.prisma.trackProgress.findMany({ where: { userId } }),
      this.prisma.challengeAttempt.findMany({
        where: { userId, passed: true },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: { challenge: { select: { title: true, track: true } } },
      }),
    ]);
    if (!user) throw new NotFoundException();

    return {
      userId,
      totalXp: user.xp,
      level: this.calculateLevel(user.xp),
      streak: user.streak,
      tracks: progress,
      recentActivity: recentAttempts.map((a) => ({
        type: 'challenge_completed',
        description: `Completed: ${a.challenge.title}`,
        xp: 0,
        timestamp: a.createdAt.toISOString(),
      })),
    };
  }

  async getLeaderboard(limit = 20) {
    const users = await this.prisma.user.findMany({
      orderBy: { xp: 'desc' },
      take: limit,
      select: { id: true, username: true, xp: true, level: true, streak: true },
    });
    return users.map((u, i) => ({ rank: i + 1, ...u }));
  }

  private calculateLevel(xp: number): number {
    return Math.floor(xp / XP_PER_LEVEL) + 1;
  }
}
