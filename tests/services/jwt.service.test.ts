/**
 * JWT Service Tests
 *
 * Comprehensive unit tests for JWT authentication service.
 * Tests token generation, validation, refresh, and password hashing.
 *
 * @module tests/services/jwt.service.test
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { JWTService, createJWTService, type TokenPair } from '../../src/services/jwt.service.js';
import type { UserPublic } from '../../src/types/auth.js';

describe('JWTService', () => {
  const testSecret = 'test-secret-key-for-jwt-signing';
  let jwtService: JWTService;
  let testUser: UserPublic;

  beforeEach(() => {
    jwtService = new JWTService({
      secretOrPrivateKey: testSecret,
      expiresIn: '1h',
      refreshExpiresIn: '7d',
      algorithm: 'HS256',
    });

    testUser = {
      id: 'user-123',
      email: 'test@example.com',
      created_at: new Date('2024-01-01'),
      updated_at: new Date('2024-01-01'),
    };
  });

  describe('Constructor and Configuration', () => {
    it('should create JWTService with valid configuration', () => {
      expect(jwtService).toBeInstanceOf(JWTService);
    });

    it('should throw error if secret is not provided', () => {
      expect(() => {
        new JWTService({ secretOrPrivateKey: '' });
      }).toThrow('Secret or private key is required');
    });

    it('should throw error for RS256 without public key', () => {
      expect(() => {
        new JWTService({
          secretOrPrivateKey: 'private-key',
          algorithm: 'RS256',
        });
      }).toThrow('Public key is required for RS256 algorithm');
    });

    it('should accept RS256 with both private and public keys', () => {
      expect(() => {
        new JWTService({
          secretOrPrivateKey: 'private-key',
          publicKey: 'public-key',
          algorithm: 'RS256',
        });
      }).not.toThrow();
    });
  });

  describe('generateTokenPair', () => {
    it('should generate valid access and refresh tokens', () => {
      const tokenPair = jwtService.generateTokenPair(testUser);

      expect(tokenPair).toHaveProperty('accessToken');
      expect(tokenPair).toHaveProperty('refreshToken');
      expect(tokenPair).toHaveProperty('expiresIn');
      expect(typeof tokenPair.accessToken).toBe('string');
      expect(typeof tokenPair.refreshToken).toBe('string');
      expect(typeof tokenPair.expiresIn).toBe('number');
    });

    it('should generate different access and refresh tokens', () => {
      const tokenPair = jwtService.generateTokenPair(testUser);

      expect(tokenPair.accessToken).not.toBe(tokenPair.refreshToken);
    });

    it('should set correct expiration time', () => {
      const tokenPair = jwtService.generateTokenPair(testUser);

      expect(tokenPair.expiresIn).toBe(3600); // 1 hour in seconds
    });

    it('should include user information in token payload', () => {
      const tokenPair = jwtService.generateTokenPair(testUser);
      const decoded = jwtService.decodeToken(tokenPair.accessToken);

      expect(decoded).not.toBeNull();
      expect(decoded?.sub).toBe(testUser.id);
      expect(decoded?.email).toBe(testUser.email);
    });
  });

  describe('generateAccessToken', () => {
    it('should generate a single access token', () => {
      const token = jwtService.generateAccessToken(testUser);

      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });

    it('should include correct payload in access token', () => {
      const token = jwtService.generateAccessToken(testUser);
      const decoded = jwtService.decodeToken(token);

      expect(decoded?.sub).toBe(testUser.id);
      expect(decoded?.email).toBe(testUser.email);
      expect(decoded?.iat).toBeDefined();
      expect(decoded?.exp).toBeDefined();
    });
  });

  describe('verifyToken', () => {
    it('should verify valid token successfully', () => {
      const token = jwtService.generateAccessToken(testUser);
      const result = jwtService.verifyToken(token);

      expect(result.valid).toBe(true);
      expect(result.payload).toBeDefined();
      expect(result.payload?.sub).toBe(testUser.id);
      expect(result.error).toBeUndefined();
    });

    it('should reject token with invalid signature', () => {
      const token = jwtService.generateAccessToken(testUser);
      const tamperedToken = token.slice(0, -5) + 'XXXXX';

      const result = jwtService.verifyToken(tamperedToken);

      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should detect expired token', () => {
      const shortLivedService = new JWTService({
        secretOrPrivateKey: testSecret,
        expiresIn: '1s',
      });

      const token = shortLivedService.generateAccessToken(testUser);

      // Wait for token to expire
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          const result = shortLivedService.verifyToken(token);

          expect(result.valid).toBe(false);
          expect(result.expired).toBe(true);
          expect(result.error).toContain('expired');
          resolve();
        }, 1500);
      });
    });

    it('should reject malformed token', () => {
      const result = jwtService.verifyToken('not.a.valid.token');

      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should reject empty token', () => {
      const result = jwtService.verifyToken('');

      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('refreshAccessToken', () => {
    it('should refresh access token with valid refresh token', () => {
      const originalTokenPair = jwtService.generateTokenPair(testUser);

      // Wait 1 second to ensure different iat timestamp
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          const newTokenPair = jwtService.refreshAccessToken(originalTokenPair.refreshToken);

          expect(newTokenPair).not.toBeNull();
          expect(newTokenPair?.accessToken).toBeDefined();
          expect(newTokenPair?.refreshToken).toBeDefined();

          // Verify tokens are different (iat will be different after 1 second)
          const originalDecoded = jwtService.decodeToken(originalTokenPair.accessToken);
          const newDecoded = jwtService.decodeToken(newTokenPair!.accessToken);

          expect(newDecoded?.iat).toBeGreaterThan(originalDecoded!.iat);
          resolve();
        }, 1100);
      });
    });

    it('should return null for invalid refresh token', () => {
      const newTokenPair = jwtService.refreshAccessToken('invalid.refresh.token');

      expect(newTokenPair).toBeNull();
    });

    it('should return null for expired refresh token', () => {
      const shortLivedService = new JWTService({
        secretOrPrivateKey: testSecret,
        refreshExpiresIn: '1s',
      });

      const tokenPair = shortLivedService.generateTokenPair(testUser);

      return new Promise<void>((resolve) => {
        setTimeout(() => {
          const newTokenPair = shortLivedService.refreshAccessToken(tokenPair.refreshToken);
          expect(newTokenPair).toBeNull();
          resolve();
        }, 1500);
      });
    });
  });

  describe('decodeToken', () => {
    it('should decode valid token without verification', () => {
      const token = jwtService.generateAccessToken(testUser);
      const decoded = jwtService.decodeToken(token);

      expect(decoded).not.toBeNull();
      expect(decoded?.sub).toBe(testUser.id);
      expect(decoded?.email).toBe(testUser.email);
    });

    it('should return null for malformed token', () => {
      const decoded = jwtService.decodeToken('not-a-valid-token');

      expect(decoded).toBeNull();
    });

    it('should decode even tampered token (no verification)', () => {
      const token = jwtService.generateAccessToken(testUser);
      // Tamper with signature part only
      const parts = token.split('.');
      const tamperedToken = `${parts[0]}.${parts[1]}.TAMPERED`;

      const decoded = jwtService.decodeToken(tamperedToken);

      // Decoding succeeds because it doesn't verify signature
      expect(decoded).not.toBeNull();
      expect(decoded?.sub).toBe(testUser.id);
    });
  });

  describe('isTokenExpired', () => {
    it('should return false for valid non-expired token', () => {
      const token = jwtService.generateAccessToken(testUser);
      const expired = jwtService.isTokenExpired(token);

      expect(expired).toBe(false);
    });

    it('should return true for expired token', () => {
      const shortLivedService = new JWTService({
        secretOrPrivateKey: testSecret,
        expiresIn: '1s',
      });

      const token = shortLivedService.generateAccessToken(testUser);

      return new Promise<void>((resolve) => {
        setTimeout(() => {
          const expired = shortLivedService.isTokenExpired(token);
          expect(expired).toBe(true);
          resolve();
        }, 1500);
      });
    });

    it('should return true for malformed token', () => {
      const expired = jwtService.isTokenExpired('invalid.token');

      expect(expired).toBe(true);
    });
  });

  describe('Password Hashing', () => {
    const plainPassword = 'MySecurePassword123!';

    it('should hash password successfully', async () => {
      const hash = await jwtService.hashPassword(plainPassword);

      expect(hash).toBeDefined();
      expect(typeof hash).toBe('string');
      expect(hash).not.toBe(plainPassword);
      expect(hash.length).toBeGreaterThan(20);
    });

    it('should generate different hashes for same password', async () => {
      const hash1 = await jwtService.hashPassword(plainPassword);
      const hash2 = await jwtService.hashPassword(plainPassword);

      expect(hash1).not.toBe(hash2);
    });

    it('should verify correct password', async () => {
      const hash = await jwtService.hashPassword(plainPassword);
      const isValid = await jwtService.comparePassword(plainPassword, hash);

      expect(isValid).toBe(true);
    });

    it('should reject incorrect password', async () => {
      const hash = await jwtService.hashPassword(plainPassword);
      const isValid = await jwtService.comparePassword('WrongPassword', hash);

      expect(isValid).toBe(false);
    });

    it('should use custom bcrypt rounds', async () => {
      const hash = await jwtService.hashPassword(plainPassword, 12);

      expect(hash).toBeDefined();
      // Bcrypt hash starts with $2a$ or $2b$ followed by rounds
      expect(hash.startsWith('$2')).toBe(true);
    });
  });

  describe('generateUserId', () => {
    it('should generate valid UUID v4', () => {
      const userId = jwtService.generateUserId();

      expect(userId).toBeDefined();
      expect(typeof userId).toBe('string');
      expect(userId).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      );
    });

    it('should generate unique IDs', () => {
      const id1 = jwtService.generateUserId();
      const id2 = jwtService.generateUserId();

      expect(id1).not.toBe(id2);
    });

    it('should generate multiple unique IDs', () => {
      const ids = new Set<string>();
      for (let i = 0; i < 100; i++) {
        ids.add(jwtService.generateUserId());
      }

      expect(ids.size).toBe(100);
    });
  });

  describe('getTokenTTL', () => {
    it('should return correct TTL for valid token', () => {
      const token = jwtService.generateAccessToken(testUser);
      const ttl = jwtService.getTokenTTL(token);

      // TTL should be close to 1 hour (3600 seconds), allow 5 second tolerance
      expect(ttl).toBeGreaterThan(3595);
      expect(ttl).toBeLessThanOrEqual(3600);
    });

    it('should return 0 for expired token', () => {
      const shortLivedService = new JWTService({
        secretOrPrivateKey: testSecret,
        expiresIn: '1s',
      });

      const token = shortLivedService.generateAccessToken(testUser);

      return new Promise<void>((resolve) => {
        setTimeout(() => {
          const ttl = shortLivedService.getTokenTTL(token);
          expect(ttl).toBe(0);
          resolve();
        }, 1500);
      });
    });

    it('should return 0 for invalid token', () => {
      const ttl = jwtService.getTokenTTL('invalid.token');

      expect(ttl).toBe(0);
    });
  });

  describe('createJWTService factory', () => {
    it('should create service with minimal config', () => {
      const service = createJWTService(testSecret);

      expect(service).toBeInstanceOf(JWTService);
    });

    it('should create service with custom options', () => {
      const service = createJWTService(testSecret, {
        expiresIn: '2h',
        algorithm: 'HS256',
      });

      const token = service.generateAccessToken(testUser);
      const ttl = service.getTokenTTL(token);

      // TTL should be close to 2 hours (7200 seconds)
      expect(ttl).toBeGreaterThan(7195);
      expect(ttl).toBeLessThanOrEqual(7200);
    });
  });

  describe('Expiration Time Parsing', () => {
    it('should handle seconds expiration', () => {
      const service = new JWTService({
        secretOrPrivateKey: testSecret,
        expiresIn: '60s',
      });

      const tokenPair = service.generateTokenPair(testUser);
      expect(tokenPair.expiresIn).toBe(60);
    });

    it('should handle minutes expiration', () => {
      const service = new JWTService({
        secretOrPrivateKey: testSecret,
        expiresIn: '30m',
      });

      const tokenPair = service.generateTokenPair(testUser);
      expect(tokenPair.expiresIn).toBe(1800);
    });

    it('should handle hours expiration', () => {
      const service = new JWTService({
        secretOrPrivateKey: testSecret,
        expiresIn: '2h',
      });

      const tokenPair = service.generateTokenPair(testUser);
      expect(tokenPair.expiresIn).toBe(7200);
    });

    it('should handle days expiration', () => {
      const service = new JWTService({
        secretOrPrivateKey: testSecret,
        expiresIn: '1d',
      });

      const tokenPair = service.generateTokenPair(testUser);
      expect(tokenPair.expiresIn).toBe(86400);
    });
  });

  describe('Token Structure', () => {
    it('should produce JWT with three parts separated by dots', () => {
      const token = jwtService.generateAccessToken(testUser);
      const parts = token.split('.');

      expect(parts).toHaveLength(3);
    });

    it('should have Base64URL encoded header and payload', () => {
      const token = jwtService.generateAccessToken(testUser);
      const [header, payload] = token.split('.');

      // Base64URL should not contain + or /
      expect(header).not.toMatch(/[+/]/);
      expect(payload).not.toMatch(/[+/]/);
    });
  });
});
