import { Injectable, ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
    private mail: MailService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findFirst({
      where: { OR: [{ email: dto.email }, { username: dto.username }] },
    });
    if (existing) {
      throw new ConflictException(
        existing.email === dto.email ? 'Email already in use' : 'Username already taken',
      );
    }

    const password = await bcrypt.hash(dto.password, 12);
    const user = await this.prisma.user.create({
      data: { email: dto.email, username: dto.username, password },
    });

    // Start a fresh token family at version 0 (the default on creation)
    return this.generateTokens(user.id, user.email, user.username, user.refreshTokenVersion);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    // Increment version on login to start a new token family, invalidating any
    // previously issued refresh tokens from earlier sessions
    const nextVersion = user.refreshTokenVersion + 1;
    return this.generateTokens(user.id, user.email, user.username, nextVersion);
  }

  async refresh(userId: string, rawRefreshToken: string, tokenVersion: number | undefined) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user?.refreshToken) throw new UnauthorizedException();

    // Token family check: if the version embedded in the JWT doesn't match the
    // DB value the token has already been rotated, meaning a stale (possibly
    // stolen) token is being replayed.  Invalidate everything immediately.
    if (tokenVersion === undefined || tokenVersion !== user.refreshTokenVersion) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { refreshToken: null, refreshTokenVersion: 0 },
      });
      throw new UnauthorizedException('Token reuse detected');
    }

    const matches = await bcrypt.compare(rawRefreshToken, user.refreshToken);
    if (!matches) throw new UnauthorizedException();

    // Rotate: increment version so the just-used token is invalidated even if
    // the attacker somehow still has the raw token value
    const nextVersion = user.refreshTokenVersion + 1;
    return this.generateTokens(user.id, user.email, user.username, nextVersion);
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null, refreshTokenVersion: 0 },
    });
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    // Always return success to avoid leaking whether an email is registered
    if (!user) return;

    const token = randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await this.prisma.user.update({
      where: { id: user.id },
      data: { passwordResetToken: token, passwordResetExpiry: expiry },
    });

    const frontendUrl = this.config.get('FRONTEND_URL', 'http://localhost:4200');
    await this.mail.sendPasswordReset(email, token, frontendUrl);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetExpiry: { gt: new Date() },
      },
    });

    if (!user) throw new BadRequestException('Invalid or expired reset token');

    const hashed = await bcrypt.hash(newPassword, 12);
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashed,
        passwordResetToken: null,
        passwordResetExpiry: null,
        // Invalidate all sessions after password change
        refreshToken: null,
        refreshTokenVersion: 0,
      },
    });
  }

  private async generateTokens(
    userId: string,
    email: string,
    username: string,
    tokenVersion: number,
  ) {
    const accessPayload = { sub: userId, email, username };
    // Embed tokenVersion only in the refresh token so the family can be
    // verified on the next rotation without exposing it in short-lived access tokens
    const refreshPayload = { ...accessPayload, tokenVersion };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(accessPayload, {
        secret: this.config.get('JWT_SECRET', 'fallback-secret'),
        expiresIn: this.config.get('JWT_EXPIRES_IN', '15m'),
      }),
      this.jwtService.signAsync(refreshPayload, {
        secret: this.config.get('JWT_REFRESH_SECRET', 'fallback-refresh-secret'),
        expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN', '7d'),
      }),
    ]);

    // Store hashed refresh token and new version atomically
    const hashed = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashed, refreshTokenVersion: tokenVersion },
    });

    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        xp: user.xp,
        level: user.level,
        streak: user.streak,
      },
    };
  }
}
