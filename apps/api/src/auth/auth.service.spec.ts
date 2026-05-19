import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';

const mockUser = {
  id: 'user-1',
  email: 'alice@example.com',
  username: 'alice',
  password: '$2b$12$hashedpassword',
  role: 'USER',
  xp: 0,
  level: 1,
  streak: 0,
  refreshToken: null,
  lastActive: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockPrisma = {
  user: {
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    findUniqueOrThrow: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
};

const mockJwt = {
  signAsync: jest.fn().mockResolvedValue('mock-token'),
};

const mockConfig = {
  get: jest.fn((key: string, fallback?: string) => fallback ?? 'test-value'),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwt },
        { provide: ConfigService, useValue: mockConfig },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('register()', () => {
    it('creates a new user and returns tokens', async () => {
      mockPrisma.user.findFirst.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue({ ...mockUser });
      mockPrisma.user.update.mockResolvedValue(mockUser);
      mockPrisma.user.findUniqueOrThrow.mockResolvedValue(mockUser);

      const result = await service.register({
        email: 'alice@example.com',
        username: 'alice',
        password: 'Password1!',
      });

      expect(result.accessToken).toBeDefined();
      expect(result.user.email).toBe('alice@example.com');
      expect(result.user).not.toHaveProperty('password');
    });

    it('throws ConflictException when email is taken', async () => {
      mockPrisma.user.findFirst.mockResolvedValue({ ...mockUser });

      await expect(
        service.register({ email: 'alice@example.com', username: 'new', password: 'Password1!' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login()', () => {
    it('returns tokens for valid credentials', async () => {
      const bcrypt = await import('bcrypt');
      const hashed = await bcrypt.hash('Password1!', 10);
      mockPrisma.user.findUnique.mockResolvedValue({ ...mockUser, password: hashed });
      mockPrisma.user.update.mockResolvedValue(mockUser);
      mockPrisma.user.findUniqueOrThrow.mockResolvedValue(mockUser);

      const result = await service.login({ email: 'alice@example.com', password: 'Password1!' });
      expect(result.accessToken).toBeDefined();
    });

    it('throws UnauthorizedException for unknown email', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.login({ email: 'nobody@example.com', password: 'Password1!' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException for wrong password', async () => {
      const bcrypt = await import('bcrypt');
      const hashed = await bcrypt.hash('CorrectPassword1!', 10);
      mockPrisma.user.findUnique.mockResolvedValue({ ...mockUser, password: hashed });

      await expect(
        service.login({ email: 'alice@example.com', password: 'WrongPassword!' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('refresh()', () => {
    it('issues new tokens when refresh token matches', async () => {
      const bcrypt = await import('bcrypt');
      const raw = 'raw-refresh-token';
      const hashed = await bcrypt.hash(raw, 10);
      mockPrisma.user.findUnique.mockResolvedValue({ ...mockUser, refreshToken: hashed });
      mockPrisma.user.update.mockResolvedValue(mockUser);
      mockPrisma.user.findUniqueOrThrow.mockResolvedValue(mockUser);

      const result = await service.refresh('user-1', raw);
      expect(result.accessToken).toBeDefined();
    });

    it('throws UnauthorizedException when refresh token is null', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ ...mockUser, refreshToken: null });

      await expect(service.refresh('user-1', 'any-token')).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException when refresh token does not match', async () => {
      const bcrypt = await import('bcrypt');
      const hashed = await bcrypt.hash('correct-token', 10);
      mockPrisma.user.findUnique.mockResolvedValue({ ...mockUser, refreshToken: hashed });

      await expect(service.refresh('user-1', 'wrong-token')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('logout()', () => {
    it('clears the refresh token', async () => {
      mockPrisma.user.update.mockResolvedValue(mockUser);

      await service.logout('user-1');

      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: { refreshToken: null },
      });
    });
  });
});
