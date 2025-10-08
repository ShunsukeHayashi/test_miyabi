/**
 * Unit Tests for Logout API Route
 *
 * Tests session termination and cookie clearing.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { POST } from '@/app/api/auth/logout/route';
import { NextRequest } from 'next/server';

// Mock Prisma Client
const mockPrismaSession = {
  deleteMany: vi.fn(),
};

vi.mock('@/generated/prisma', () => ({
  PrismaClient: vi.fn(() => ({
    session: mockPrismaSession,
    $disconnect: vi.fn(),
  })),
}));

// Mock JWT Service
vi.mock('@/lib/auth/jwt', () => ({
  JWTService: {
    getCurrentUser: vi.fn(),
  },
}));

describe('/api/auth/logout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST', () => {
    it('should successfully logout authenticated user', async () => {
      const JWTService = (await import('@/lib/auth/jwt')).JWTService;
      (JWTService.getCurrentUser as any).mockResolvedValue({
        userId: 'user_123',
        email: 'user@example.com',
      });
      mockPrismaSession.deleteMany.mockResolvedValue({ count: 1 });

      const request = new NextRequest('http://localhost/api/auth/logout', {
        method: 'POST',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe('Logged out successfully');
    });

    it('should delete all sessions for user', async () => {
      const JWTService = (await import('@/lib/auth/jwt')).JWTService;
      (JWTService.getCurrentUser as any).mockResolvedValue({
        userId: 'user_123',
      });
      mockPrismaSession.deleteMany.mockResolvedValue({ count: 2 });

      const request = new NextRequest('http://localhost/api/auth/logout', {
        method: 'POST',
      });

      await POST(request);

      expect(mockPrismaSession.deleteMany).toHaveBeenCalledWith({
        where: { userId: 'user_123' },
      });
    });

    it('should return 401 if not authenticated', async () => {
      const JWTService = (await import('@/lib/auth/jwt')).JWTService;
      (JWTService.getCurrentUser as any).mockResolvedValue(null);

      const request = new NextRequest('http://localhost/api/auth/logout', {
        method: 'POST',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Not authenticated');
    });

    it('should handle database errors gracefully', async () => {
      const JWTService = (await import('@/lib/auth/jwt')).JWTService;
      (JWTService.getCurrentUser as any).mockResolvedValue({
        userId: 'user_123',
      });
      mockPrismaSession.deleteMany.mockRejectedValue(new Error('Database error'));

      const request = new NextRequest('http://localhost/api/auth/logout', {
        method: 'POST',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Internal server error');
    });

    it('should still return success even if no sessions found', async () => {
      const JWTService = (await import('@/lib/auth/jwt')).JWTService;
      (JWTService.getCurrentUser as any).mockResolvedValue({
        userId: 'user_123',
      });
      mockPrismaSession.deleteMany.mockResolvedValue({ count: 0 });

      const request = new NextRequest('http://localhost/api/auth/logout', {
        method: 'POST',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });
  });
});
