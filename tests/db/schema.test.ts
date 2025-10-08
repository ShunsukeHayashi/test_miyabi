/**
 * Database Schema Tests
 *
 * Unit tests for the authentication database schema.
 * Tests schema validation, type guards, and SQL query correctness.
 *
 * @module tests/db/schema.test
 */

import { describe, it, expect } from 'vitest';
import {
  User,
  Session,
  isUser,
  isSession,
  CREATE_USERS_TABLE,
  CREATE_SESSIONS_TABLE,
  INIT_QUERIES,
} from '../../src/db/schema.js';

describe('Database Schema', () => {
  describe('CREATE_USERS_TABLE', () => {
    it('should contain users table creation query', () => {
      expect(CREATE_USERS_TABLE).toContain('CREATE TABLE IF NOT EXISTS users');
    });

    it('should define id as primary key', () => {
      expect(CREATE_USERS_TABLE).toContain('id VARCHAR(36) PRIMARY KEY');
    });

    it('should define email as unique and not null', () => {
      expect(CREATE_USERS_TABLE).toContain('email VARCHAR(255) UNIQUE NOT NULL');
    });

    it('should define password_hash as not null', () => {
      expect(CREATE_USERS_TABLE).toContain('password_hash VARCHAR(255) NOT NULL');
    });

    it('should have created_at and updated_at timestamps', () => {
      expect(CREATE_USERS_TABLE).toContain('created_at TIMESTAMP');
      expect(CREATE_USERS_TABLE).toContain('updated_at TIMESTAMP');
    });

    it('should have index on email', () => {
      expect(CREATE_USERS_TABLE).toContain('INDEX idx_users_email (email)');
    });

    it('should use InnoDB engine', () => {
      expect(CREATE_USERS_TABLE).toContain('ENGINE=InnoDB');
    });

    it('should use utf8mb4 charset', () => {
      expect(CREATE_USERS_TABLE).toContain('CHARSET=utf8mb4');
    });
  });

  describe('CREATE_SESSIONS_TABLE', () => {
    it('should contain sessions table creation query', () => {
      expect(CREATE_SESSIONS_TABLE).toContain('CREATE TABLE IF NOT EXISTS sessions');
    });

    it('should define id as primary key', () => {
      expect(CREATE_SESSIONS_TABLE).toContain('id VARCHAR(36) PRIMARY KEY');
    });

    it('should define user_id as not null', () => {
      expect(CREATE_SESSIONS_TABLE).toContain('user_id VARCHAR(36) NOT NULL');
    });

    it('should define token as not null', () => {
      expect(CREATE_SESSIONS_TABLE).toContain('token VARCHAR(512) NOT NULL');
    });

    it('should have expires_at timestamp', () => {
      expect(CREATE_SESSIONS_TABLE).toContain('expires_at TIMESTAMP NOT NULL');
    });

    it('should have index on user_id', () => {
      expect(CREATE_SESSIONS_TABLE).toContain('INDEX idx_sessions_user_id (user_id)');
    });

    it('should have index on token', () => {
      expect(CREATE_SESSIONS_TABLE).toContain('INDEX idx_sessions_token (token)');
    });

    it('should have index on expires_at', () => {
      expect(CREATE_SESSIONS_TABLE).toContain('INDEX idx_sessions_expires_at (expires_at)');
    });

    it('should have foreign key constraint to users table', () => {
      expect(CREATE_SESSIONS_TABLE).toContain('FOREIGN KEY (user_id) REFERENCES users(id)');
      expect(CREATE_SESSIONS_TABLE).toContain('ON DELETE CASCADE');
    });

    it('should support ip_address field', () => {
      expect(CREATE_SESSIONS_TABLE).toContain('ip_address VARCHAR(45)');
    });

    it('should support user_agent field', () => {
      expect(CREATE_SESSIONS_TABLE).toContain('user_agent TEXT');
    });
  });

  describe('INIT_QUERIES', () => {
    it('should contain both table creation queries', () => {
      expect(INIT_QUERIES).toHaveLength(2);
      expect(INIT_QUERIES[0]).toBe(CREATE_USERS_TABLE);
      expect(INIT_QUERIES[1]).toBe(CREATE_SESSIONS_TABLE);
    });
  });

  describe('isUser type guard', () => {
    it('should return true for valid User object', () => {
      const validUser: User = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'test@example.com',
        password_hash: 'hashed_password',
        created_at: new Date(),
        updated_at: new Date(),
      };
      expect(isUser(validUser)).toBe(true);
    });

    it('should return false for object missing id', () => {
      const invalidUser = {
        email: 'test@example.com',
        password_hash: 'hashed_password',
        created_at: new Date(),
        updated_at: new Date(),
      };
      expect(isUser(invalidUser)).toBe(false);
    });

    it('should return false for object missing email', () => {
      const invalidUser = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        password_hash: 'hashed_password',
        created_at: new Date(),
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

    it('should return false for non-object types', () => {
      expect(isUser('string')).toBe(false);
      expect(isUser(123)).toBe(false);
      expect(isUser(true)).toBe(false);
    });
  });

  describe('isSession type guard', () => {
    it('should return true for valid Session object', () => {
      const validSession: Session = {
        id: '123e4567-e89b-12d3-a456-426614174001',
        user_id: '123e4567-e89b-12d3-a456-426614174000',
        token: 'jwt_token_string',
        expires_at: new Date(Date.now() + 3600000),
        created_at: new Date(),
        ip_address: '192.168.1.1',
        user_agent: 'Mozilla/5.0',
      };
      expect(isSession(validSession)).toBe(true);
    });

    it('should return true for valid Session without optional fields', () => {
      const validSession: Session = {
        id: '123e4567-e89b-12d3-a456-426614174001',
        user_id: '123e4567-e89b-12d3-a456-426614174000',
        token: 'jwt_token_string',
        expires_at: new Date(Date.now() + 3600000),
        created_at: new Date(),
      };
      expect(isSession(validSession)).toBe(true);
    });

    it('should return false for object missing user_id', () => {
      const invalidSession = {
        id: '123e4567-e89b-12d3-a456-426614174001',
        token: 'jwt_token_string',
        expires_at: new Date(Date.now() + 3600000),
        created_at: new Date(),
      };
      expect(isSession(invalidSession)).toBe(false);
    });

    it('should return false for object missing token', () => {
      const invalidSession = {
        id: '123e4567-e89b-12d3-a456-426614174001',
        user_id: '123e4567-e89b-12d3-a456-426614174000',
        expires_at: new Date(Date.now() + 3600000),
        created_at: new Date(),
      };
      expect(isSession(invalidSession)).toBe(false);
    });

    it('should return false for null', () => {
      expect(isSession(null)).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(isSession(undefined)).toBe(false);
    });
  });
});
