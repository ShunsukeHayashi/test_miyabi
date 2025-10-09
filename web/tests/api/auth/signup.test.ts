/**
 * Unit Tests for Signup API Route
 *
 * Tests user registration, validation, and error handling.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { POST } from '@/app/api/auth/signup/route';
import { NextRequest } from 'next/server';

// Hoist mock constants before vi.mock() is called
const { mockPrismaUser } = vi.hoisted(() => ({
  mockPrismaUser: {
    findUnique: vi.fn(),
    create: vi.fn(),
  },
}));

vi.mock('@/generated/prisma', () => ({
  PrismaClient: vi.fn(() => ({
    user: mockPrismaUser,
    $disconnect: vi.fn(),
  })),
}));

// Mock bcryptjs
vi.mock('bcryptjs', () => ({
  hash: vi.fn((password: string) => Promise.resolve(`hashed_${password}`)),
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

describe('/api/auth/signup', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST', () => {
    it('should create new user with valid data', async () => {
      const mockUser = {
        id: 'user_123',
        email: 'newuser@example.com',
        name: 'New User',
      };

      mockPrismaUser.findUnique.mockResolvedValue(null);
      mockPrismaUser.create.mockResolvedValue(mockUser);

      const request = new NextRequest('http://localhost/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          email: 'newuser@example.com',
          password: 'StrongPass123',
          name: 'New User',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toHaveProperty('user');
      expect(data).toHaveProperty('accessToken');
      expect(data).toHaveProperty('refreshToken');
      expect(data.user.email).toBe('newuser@example.com');
    });

    it('should reject signup with existing email', async () => {
      mockPrismaUser.findUnique.mockResolvedValue({
        id: 'existing_user',
        email: 'existing@example.com',
      });

      const request = new NextRequest('http://localhost/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          email: 'existing@example.com',
          password: 'Password123',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Email already registered');
    });

    it('should reject invalid email format', async () => {
      const request = new NextRequest('http://localhost/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          email: 'invalid-email',
          password: 'Password123',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('validation');
    });

    it('should reject weak password (too short)', async () => {
      const request = new NextRequest('http://localhost/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          email: 'user@example.com',
          password: 'Short1',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('validation');
    });

    it('should reject password without uppercase letter', async () => {
      const request = new NextRequest('http://localhost/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          email: 'user@example.com',
          password: 'lowercase123',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('validation');
    });

    it('should reject password without number', async () => {
      const request = new NextRequest('http://localhost/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          email: 'user@example.com',
          password: 'NoNumbers',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('validation');
    });

    it('should hash password before storing', async () => {
      const bcrypt = await import('bcryptjs');
      mockPrismaUser.findUnique.mockResolvedValue(null);
      mockPrismaUser.create.mockResolvedValue({
        id: 'user_1',
        email: 'test@example.com',
      });

      const request = new NextRequest('http://localhost/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'Password123',
        }),
      });

      await POST(request);

      expect(bcrypt.hash).toHaveBeenCalledWith('Password123', 10);
    });

    it('should return tokens after successful signup', async () => {
      mockPrismaUser.findUnique.mockResolvedValue(null);
      mockPrismaUser.create.mockResolvedValue({
        id: 'user_1',
        email: 'test@example.com',
      });

      const request = new NextRequest('http://localhost/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'Password123',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(data).toHaveProperty('accessToken');
      expect(data).toHaveProperty('refreshToken');
      expect(data.accessToken).toBe('mock_access_token');
      expect(data.refreshToken).toBe('mock_refresh_token');
    });

    it('should handle database errors gracefully', async () => {
      mockPrismaUser.findUnique.mockRejectedValue(new Error('Database connection failed'));

      const request = new NextRequest('http://localhost/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'Password123',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Internal server error');
    });

    it('should reject missing email', async () => {
      const request = new NextRequest('http://localhost/api/auth/signup', {
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
      const request = new NextRequest('http://localhost/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('validation');
    });

    it('should accept optional name field', async () => {
      mockPrismaUser.findUnique.mockResolvedValue(null);
      mockPrismaUser.create.mockResolvedValue({
        id: 'user_1',
        email: 'test@example.com',
        name: 'Test User',
      });

      const request = new NextRequest('http://localhost/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'Password123',
          name: 'Test User',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.user.name).toBe('Test User');
    });
  });
});
