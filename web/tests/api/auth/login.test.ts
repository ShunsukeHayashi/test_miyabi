/**
 * Unit Tests for Login API Route
 *
 * Tests user authentication, session creation, and error handling.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { POST } from '@/app/api/auth/login/route';
import { NextRequest } from 'next/server';

// Mock Prisma Client
const mockPrismaUser = {
  findUnique: vi.fn(),
};

const mockPrismaSession = {
  create: vi.fn(),
};

vi.mock('@/generated/prisma', () => ({
  PrismaClient: vi.fn(() => ({
    user: mockPrismaUser,
    session: mockPrismaSession,
    $disconnect: vi.fn(),
  })),
}));

// Mock bcryptjs
vi.mock('bcryptjs', () => ({
  compare: vi.fn((password: string, hash: string) => {
    return Promise.resolve(hash === `hashed_${password}`);
  }),
}));

// Mock JWT Service
vi.mock('@/lib/auth/jwt', () => ({
  JWTService: {
    generateTokens: vi.fn(() =>
      Promise.resolve({
        accessToken: 'mock_access_token',
        refreshToken: 'mock_refresh_token',
      })
    ),
  },
}));

describe('/api/auth/login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST', () => {
    it('should authenticate user with valid credentials', async () => {
      const mockUser = {
        id: 'user_123',
        email: 'user@example.com',
        passwordHash: 'hashed_Password123',
      };

      mockPrismaUser.findUnique.mockResolvedValue(mockUser);
      mockPrismaSession.create.mockResolvedValue({
        id: 'session_1',
        userId: 'user_123',
      });

      const request = new NextRequest('http://localhost/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: 'user@example.com',
          password: 'Password123',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('user');
      expect(data).toHaveProperty('accessToken');
      expect(data).toHaveProperty('refreshToken');
      expect(data.user.email).toBe('user@example.com');
    });

    it('should reject login with non-existent email', async () => {
      mockPrismaUser.findUnique.mockResolvedValue(null);

      const request = new NextRequest('http://localhost/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: 'nonexistent@example.com',
          password: 'Password123',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Invalid credentials');
    });

    it('should reject login with incorrect password', async () => {
      mockPrismaUser.findUnique.mockResolvedValue({
        id: 'user_1',
        email: 'user@example.com',
        passwordHash: 'hashed_CorrectPassword',
      });

      const request = new NextRequest('http://localhost/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: 'user@example.com',
          password: 'WrongPassword',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Invalid credentials');
    });

    it('should create session on successful login', async () => {
      mockPrismaUser.findUnique.mockResolvedValue({
        id: 'user_123',
        email: 'user@example.com',
        passwordHash: 'hashed_Password123',
      });
      mockPrismaSession.create.mockResolvedValue({});

      const request = new NextRequest('http://localhost/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: 'user@example.com',
          password: 'Password123',
        }),
      });

      await POST(request);

      expect(mockPrismaSession.create).toHaveBeenCalled();
      const sessionData = mockPrismaSession.create.mock.calls[0][0].data;
      expect(sessionData.userId).toBe('user_123');
      expect(sessionData).toHaveProperty('token');
      expect(sessionData).toHaveProperty('refreshToken');
      expect(sessionData).toHaveProperty('expiresAt');
    });

    it('should return both access and refresh tokens', async () => {
      mockPrismaUser.findUnique.mockResolvedValue({
        id: 'user_1',
        email: 'user@example.com',
        passwordHash: 'hashed_Password123',
      });
      mockPrismaSession.create.mockResolvedValue({});

      const request = new NextRequest('http://localhost/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: 'user@example.com',
          password: 'Password123',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(data.accessToken).toBe('mock_access_token');
      expect(data.refreshToken).toBe('mock_refresh_token');
    });

    it('should reject missing email', async () => {
      const request = new NextRequest('http://localhost/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          password: 'Password123',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('validation');
    });

    it('should reject missing password', async () => {
      const request = new NextRequest('http://localhost/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: 'user@example.com',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('validation');
    });

    it('should handle database errors gracefully', async () => {
      mockPrismaUser.findUnique.mockRejectedValue(new Error('Database error'));

      const request = new NextRequest('http://localhost/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: 'user@example.com',
          password: 'Password123',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Internal server error');
    });

    it('should set session expiration time correctly', async () => {
      mockPrismaUser.findUnique.mockResolvedValue({
        id: 'user_1',
        email: 'user@example.com',
        passwordHash: 'hashed_Password123',
      });
      mockPrismaSession.create.mockResolvedValue({});

      const beforeTime = Date.now();

      const request = new NextRequest('http://localhost/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: 'user@example.com',
          password: 'Password123',
        }),
      });

      await POST(request);

      const sessionData = mockPrismaSession.create.mock.calls[0][0].data;
      const expiresAt = new Date(sessionData.expiresAt).getTime();
      const afterTime = Date.now();

      // Should expire in 7 days
      const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
      const expectedExpiration = beforeTime + sevenDaysMs;

      expect(expiresAt).toBeGreaterThanOrEqual(expectedExpiration - 1000);
      expect(expiresAt).toBeLessThanOrEqual(afterTime + sevenDaysMs + 1000);
    });

    it('should not expose password hash in response', async () => {
      mockPrismaUser.findUnique.mockResolvedValue({
        id: 'user_1',
        email: 'user@example.com',
        passwordHash: 'hashed_Password123',
      });
      mockPrismaSession.create.mockResolvedValue({});

      const request = new NextRequest('http://localhost/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: 'user@example.com',
          password: 'Password123',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(data.user).not.toHaveProperty('passwordHash');
      expect(data.user).not.toHaveProperty('password');
    });
  });
});
