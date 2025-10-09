/**
 * Unit Tests for Get Current User API Route
 *
 * Tests authenticated user retrieval.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GET } from '@/app/api/auth/me/route';
import { NextRequest } from 'next/server';

// Hoist mock constants before vi.mock() is called
const { mockPrismaUser } = vi.hoisted(() => ({
  mockPrismaUser: {
    findUnique: vi.fn(),
  },
}));

vi.mock('@/generated/prisma', () => ({
  PrismaClient: vi.fn(() => ({
    user: mockPrismaUser,
    $disconnect: vi.fn(),
  })),
}));

// Mock JWT Service
vi.mock('@/lib/auth/jwt', () => ({
  JWTService: {
    getCurrentUser: vi.fn(),
  },
}));

describe('/api/auth/me', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET', () => {
    it('should return current user for authenticated request', async () => {
      const JWTService = (await import('@/lib/auth/jwt')).JWTService;
      (JWTService.getCurrentUser as any).mockResolvedValue({
        userId: 'user_123',
        email: 'user@example.com',
      });

      const mockUser = {
        id: 'user_123',
        email: 'user@example.com',
        name: 'Test User',
        emailVerified: null,
        image: null,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      mockPrismaUser.findUnique.mockResolvedValue(mockUser);

      const request = new NextRequest('http://localhost/api/auth/me', {
        method: 'GET',
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('user');
      expect(data.user.id).toBe('user_123');
      expect(data.user.email).toBe('user@example.com');
      expect(data.user.name).toBe('Test User');
    });

    it('should return 401 for unauthenticated request', async () => {
      const JWTService = (await import('@/lib/auth/jwt')).JWTService;
      (JWTService.getCurrentUser as any).mockResolvedValue(null);

      const request = new NextRequest('http://localhost/api/auth/me', {
        method: 'GET',
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Not authenticated');
    });

    it('should return 404 if user not found', async () => {
      const JWTService = (await import('@/lib/auth/jwt')).JWTService;
      (JWTService.getCurrentUser as any).mockResolvedValue({
        userId: 'non_existent_user',
        email: 'user@example.com',
      });

      mockPrismaUser.findUnique.mockResolvedValue(null);

      const request = new NextRequest('http://localhost/api/auth/me', {
        method: 'GET',
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('User not found');
    });

    it('should not expose sensitive user data', async () => {
      const JWTService = (await import('@/lib/auth/jwt')).JWTService;
      (JWTService.getCurrentUser as any).mockResolvedValue({
        userId: 'user_123',
        email: 'user@example.com',
      });

      mockPrismaUser.findUnique.mockResolvedValue({
        id: 'user_123',
        email: 'user@example.com',
        name: 'Test User',
        passwordHash: 'should_not_be_exposed',
        emailVerified: null,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const request = new NextRequest('http://localhost/api/auth/me', {
        method: 'GET',
      });

      const response = await GET(request);
      const data = await response.json();

      expect(data.user).not.toHaveProperty('passwordHash');
      expect(data.user).not.toHaveProperty('password');
    });

    it('should handle database errors gracefully', async () => {
      const JWTService = (await import('@/lib/auth/jwt')).JWTService;
      (JWTService.getCurrentUser as any).mockResolvedValue({
        userId: 'user_123',
        email: 'user@example.com',
      });

      mockPrismaUser.findUnique.mockRejectedValue(new Error('Database error'));

      const request = new NextRequest('http://localhost/api/auth/me', {
        method: 'GET',
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Internal server error');
    });

    it('should return all allowed user fields', async () => {
      const JWTService = (await import('@/lib/auth/jwt')).JWTService;
      (JWTService.getCurrentUser as any).mockResolvedValue({
        userId: 'user_123',
        email: 'user@example.com',
      });

      const mockUser = {
        id: 'user_123',
        email: 'user@example.com',
        name: 'Test User',
        emailVerified: new Date('2024-01-15'),
        image: 'https://example.com/avatar.jpg',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-20'),
      };

      mockPrismaUser.findUnique.mockResolvedValue(mockUser);

      const request = new NextRequest('http://localhost/api/auth/me', {
        method: 'GET',
      });

      const response = await GET(request);
      const data = await response.json();

      expect(data.user).toHaveProperty('id');
      expect(data.user).toHaveProperty('email');
      expect(data.user).toHaveProperty('name');
      expect(data.user).toHaveProperty('emailVerified');
      expect(data.user).toHaveProperty('image');
      expect(data.user).toHaveProperty('createdAt');
      expect(data.user).toHaveProperty('updatedAt');
    });

    it('should use correct Prisma query', async () => {
      const JWTService = (await import('@/lib/auth/jwt')).JWTService;
      (JWTService.getCurrentUser as any).mockResolvedValue({
        userId: 'user_123',
        email: 'user@example.com',
      });

      mockPrismaUser.findUnique.mockResolvedValue({
        id: 'user_123',
        email: 'user@example.com',
      });

      const request = new NextRequest('http://localhost/api/auth/me', {
        method: 'GET',
      });

      await GET(request);

      expect(mockPrismaUser.findUnique).toHaveBeenCalledWith({
        where: { id: 'user_123' },
        select: {
          id: true,
          email: true,
          name: true,
          emailVerified: true,
          image: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    });
  });
});
