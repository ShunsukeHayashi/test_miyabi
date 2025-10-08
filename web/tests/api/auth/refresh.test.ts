/**
 * Unit Tests for Refresh Token API Route
 *
 * Tests token refresh mechanism and validation.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { POST } from '@/app/api/auth/refresh/route';
import { NextRequest } from 'next/server';

// Mock Prisma Client
const mockPrismaSession = {
  findFirst: vi.fn(),
  update: vi.fn(),
};

const mockPrismaUser = {
  findUnique: vi.fn(),
};

vi.mock('@/generated/prisma', () => ({
  PrismaClient: vi.fn(() => ({
    session: mockPrismaSession,
    user: mockPrismaUser,
    $disconnect: vi.fn(),
  })),
}));

// Mock JWT Service
vi.mock('@/lib/auth/jwt', () => ({
  JWTService: {
    verifyToken: vi.fn(),
    generateTokens: vi.fn(() =>
      Promise.resolve({
        accessToken: 'new_access_token',
        refreshToken: 'new_refresh_token',
      })
    ),
  },
}));

describe('/api/auth/refresh', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST', () => {
    it('should refresh tokens with valid refresh token', async () => {
      const JWTService = (await import('@/lib/auth/jwt')).JWTService;
      (JWTService.verifyToken as any).mockResolvedValue({
        userId: 'user_123',
        type: 'refresh',
      });

      mockPrismaSession.findFirst.mockResolvedValue({
        id: 'session_1',
        userId: 'user_123',
        refreshToken: 'old_refresh_token',
        expiresAt: new Date(Date.now() + 1000000),
      });

      mockPrismaUser.findUnique.mockResolvedValue({
        id: 'user_123',
        email: 'user@example.com',
      });

      mockPrismaSession.update.mockResolvedValue({});

      const request = new NextRequest('http://localhost/api/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({
          refreshToken: 'old_refresh_token',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('accessToken');
      expect(data).toHaveProperty('refreshToken');
      expect(data.accessToken).toBe('new_access_token');
      expect(data.refreshToken).toBe('new_refresh_token');
    });

    it('should reject missing refresh token', async () => {
      const request = new NextRequest('http://localhost/api/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({}),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Refresh token required');
    });

    it('should reject invalid refresh token', async () => {
      const JWTService = (await import('@/lib/auth/jwt')).JWTService;
      (JWTService.verifyToken as any).mockRejectedValue(new Error('Invalid token'));

      const request = new NextRequest('http://localhost/api/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({
          refreshToken: 'invalid_token',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Invalid refresh token');
    });

    it('should reject refresh token not found in database', async () => {
      const JWTService = (await import('@/lib/auth/jwt')).JWTService;
      (JWTService.verifyToken as any).mockResolvedValue({
        userId: 'user_123',
        type: 'refresh',
      });

      mockPrismaSession.findFirst.mockResolvedValue(null);

      const request = new NextRequest('http://localhost/api/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({
          refreshToken: 'token_not_in_db',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Invalid refresh token');
    });

    it('should reject expired session', async () => {
      const JWTService = (await import('@/lib/auth/jwt')).JWTService;
      (JWTService.verifyToken as any).mockResolvedValue({
        userId: 'user_123',
        type: 'refresh',
      });

      mockPrismaSession.findFirst.mockResolvedValue({
        id: 'session_1',
        userId: 'user_123',
        refreshToken: 'old_token',
        expiresAt: new Date(Date.now() - 1000), // Expired
      });

      const request = new NextRequest('http://localhost/api/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({
          refreshToken: 'old_token',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Session expired');
    });

    it('should update session with new tokens', async () => {
      const JWTService = (await import('@/lib/auth/jwt')).JWTService;
      (JWTService.verifyToken as any).mockResolvedValue({
        userId: 'user_123',
        type: 'refresh',
      });

      mockPrismaSession.findFirst.mockResolvedValue({
        id: 'session_1',
        userId: 'user_123',
        refreshToken: 'old_token',
        expiresAt: new Date(Date.now() + 1000000),
      });

      mockPrismaUser.findUnique.mockResolvedValue({
        id: 'user_123',
        email: 'user@example.com',
      });

      mockPrismaSession.update.mockResolvedValue({});

      const request = new NextRequest('http://localhost/api/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({
          refreshToken: 'old_token',
        }),
      });

      await POST(request);

      expect(mockPrismaSession.update).toHaveBeenCalled();
      const updateData = mockPrismaSession.update.mock.calls[0][0];
      expect(updateData.where.id).toBe('session_1');
      expect(updateData.data).toHaveProperty('token');
      expect(updateData.data).toHaveProperty('refreshToken');
      expect(updateData.data).toHaveProperty('expiresAt');
    });

    it('should reject access token used as refresh token', async () => {
      const JWTService = (await import('@/lib/auth/jwt')).JWTService;
      (JWTService.verifyToken as any).mockResolvedValue({
        userId: 'user_123',
        type: 'access', // Wrong type
      });

      const request = new NextRequest('http://localhost/api/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({
          refreshToken: 'access_token_used_as_refresh',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Invalid token type');
    });

    it('should handle database errors gracefully', async () => {
      const JWTService = (await import('@/lib/auth/jwt')).JWTService;
      (JWTService.verifyToken as any).mockResolvedValue({
        userId: 'user_123',
        type: 'refresh',
      });

      mockPrismaSession.findFirst.mockRejectedValue(new Error('Database error'));

      const request = new NextRequest('http://localhost/api/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({
          refreshToken: 'some_token',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Internal server error');
    });

    it('should extend session expiration on refresh', async () => {
      const JWTService = (await import('@/lib/auth/jwt')).JWTService;
      (JWTService.verifyToken as any).mockResolvedValue({
        userId: 'user_123',
        type: 'refresh',
      });

      mockPrismaSession.findFirst.mockResolvedValue({
        id: 'session_1',
        userId: 'user_123',
        refreshToken: 'old_token',
        expiresAt: new Date(Date.now() + 100000),
      });

      mockPrismaUser.findUnique.mockResolvedValue({
        id: 'user_123',
        email: 'user@example.com',
      });

      mockPrismaSession.update.mockResolvedValue({});

      const beforeTime = Date.now();

      const request = new NextRequest('http://localhost/api/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({
          refreshToken: 'old_token',
        }),
      });

      await POST(request);

      const updateData = mockPrismaSession.update.mock.calls[0][0].data;
      const newExpiresAt = new Date(updateData.expiresAt).getTime();
      const afterTime = Date.now();

      // Should extend to 7 days from now
      const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
      const expectedExpiration = beforeTime + sevenDaysMs;

      expect(newExpiresAt).toBeGreaterThanOrEqual(expectedExpiration - 1000);
      expect(newExpiresAt).toBeLessThanOrEqual(afterTime + sevenDaysMs + 1000);
    });
  });
});
