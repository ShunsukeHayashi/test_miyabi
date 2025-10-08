/**
 * Authentication Types Tests
 *
 * Unit tests for authentication type definitions and type guards.
 *
 * @module tests/types/auth.test
 */

import { describe, it, expect } from 'vitest';
import {
  User,
  Session,
  JWTPayload,
  isUser,
  isSession,
  isJWTPayload,
} from '../../src/types/auth.js';

describe('Authentication Types', () => {
  describe('isUser type guard', () => {
    it('should return true for valid User object', () => {
      const validUser: User = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'user@example.com',
        password_hash: '$2b$10$abcdefghijklmnopqrstuvwxyz',
        created_at: new Date('2024-01-01T00:00:00Z'),
        updated_at: new Date('2024-01-01T00:00:00Z'),
      };
      expect(isUser(validUser)).toBe(true);
    });

    it('should return false for object with wrong id type', () => {
      const invalidUser = {
        id: 123,
        email: 'user@example.com',
        password_hash: 'hashed',
        created_at: new Date(),
        updated_at: new Date(),
      };
      expect(isUser(invalidUser)).toBe(false);
    });

    it('should return false for object with wrong email type', () => {
      const invalidUser = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 123,
        password_hash: 'hashed',
        created_at: new Date(),
        updated_at: new Date(),
      };
      expect(isUser(invalidUser)).toBe(false);
    });

    it('should return false for object with non-Date created_at', () => {
      const invalidUser = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'user@example.com',
        password_hash: 'hashed',
        created_at: '2024-01-01',
        updated_at: new Date(),
      };
      expect(isUser(invalidUser)).toBe(false);
    });

    it('should return false for null', () => {
      expect(isUser(null)).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(isUser(undefined)).toBe(false);
    });

    it('should return false for array', () => {
      expect(isUser([])).toBe(false);
    });
  });

  describe('isSession type guard', () => {
    it('should return true for valid Session object with all fields', () => {
      const validSession: Session = {
        id: 'session-uuid',
        user_id: 'user-uuid',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        expires_at: new Date(Date.now() + 3600000),
        created_at: new Date(),
        ip_address: '203.0.113.42',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      };
      expect(isSession(validSession)).toBe(true);
    });

    it('should return true for valid Session without optional fields', () => {
      const validSession: Session = {
        id: 'session-uuid',
        user_id: 'user-uuid',
        token: 'jwt-token',
        expires_at: new Date(Date.now() + 3600000),
        created_at: new Date(),
      };
      expect(isSession(validSession)).toBe(true);
    });

    it('should return false for object with wrong id type', () => {
      const invalidSession = {
        id: 12345,
        user_id: 'user-uuid',
        token: 'jwt-token',
        expires_at: new Date(),
        created_at: new Date(),
      };
      expect(isSession(invalidSession)).toBe(false);
    });

    it('should return false for object with wrong expires_at type', () => {
      const invalidSession = {
        id: 'session-uuid',
        user_id: 'user-uuid',
        token: 'jwt-token',
        expires_at: 'not-a-date',
        created_at: new Date(),
      };
      expect(isSession(invalidSession)).toBe(false);
    });

    it('should return false for missing required fields', () => {
      const invalidSession = {
        id: 'session-uuid',
        token: 'jwt-token',
        expires_at: new Date(),
        created_at: new Date(),
      };
      expect(isSession(invalidSession)).toBe(false);
    });

    it('should return false for null', () => {
      expect(isSession(null)).toBe(false);
    });
  });

  describe('isJWTPayload type guard', () => {
    it('should return true for valid JWTPayload object', () => {
      const validPayload: JWTPayload = {
        sub: 'user-uuid',
        email: 'user@example.com',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
      };
      expect(isJWTPayload(validPayload)).toBe(true);
    });

    it('should return false for object with wrong sub type', () => {
      const invalidPayload = {
        sub: 12345,
        email: 'user@example.com',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
      };
      expect(isJWTPayload(invalidPayload)).toBe(false);
    });

    it('should return false for object with wrong iat type', () => {
      const invalidPayload = {
        sub: 'user-uuid',
        email: 'user@example.com',
        iat: '1234567890',
        exp: Math.floor(Date.now() / 1000) + 3600,
      };
      expect(isJWTPayload(invalidPayload)).toBe(false);
    });

    it('should return false for object with wrong exp type', () => {
      const invalidPayload = {
        sub: 'user-uuid',
        email: 'user@example.com',
        iat: Math.floor(Date.now() / 1000),
        exp: new Date(),
      };
      expect(isJWTPayload(invalidPayload)).toBe(false);
    });

    it('should return false for missing required fields', () => {
      const invalidPayload = {
        sub: 'user-uuid',
        email: 'user@example.com',
        iat: Math.floor(Date.now() / 1000),
      };
      expect(isJWTPayload(invalidPayload)).toBe(false);
    });

    it('should return false for null', () => {
      expect(isJWTPayload(null)).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(isJWTPayload(undefined)).toBe(false);
    });

    it('should return false for primitive types', () => {
      expect(isJWTPayload('string')).toBe(false);
      expect(isJWTPayload(123)).toBe(false);
      expect(isJWTPayload(true)).toBe(false);
    });
  });

  describe('Type interfaces', () => {
    it('should allow creating User objects with correct structure', () => {
      const user: User = {
        id: 'uuid',
        email: 'test@example.com',
        password_hash: 'hash',
        created_at: new Date(),
        updated_at: new Date(),
      };
      expect(user.email).toBe('test@example.com');
    });

    it('should allow creating Session objects with correct structure', () => {
      const session: Session = {
        id: 'session-id',
        user_id: 'user-id',
        token: 'token',
        expires_at: new Date(),
        created_at: new Date(),
      };
      expect(session.user_id).toBe('user-id');
    });

    it('should allow creating JWTPayload objects with correct structure', () => {
      const payload: JWTPayload = {
        sub: 'user-id',
        email: 'user@example.com',
        iat: 1234567890,
        exp: 1234567890 + 3600,
      };
      expect(payload.sub).toBe('user-id');
    });
  });
});
