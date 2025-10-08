/**
 * JWT Authentication Service
 *
 * This service handles JWT token generation, validation, and refresh mechanisms.
 * Implements secure token signing with configurable algorithms and expiration.
 *
 * @module services/jwt.service
 */

import jwt, { SignOptions, VerifyOptions, JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import type { JWTPayload, User, UserPublic } from '../types/auth.js';

export interface JWTServiceConfig {
  /** Secret key for HS256 or private key for RS256 */
  secretOrPrivateKey: string;

  /** Public key for RS256 verification (optional, for HS256 this is ignored) */
  publicKey?: string;

  /** Token expiration time (default: 1h) */
  expiresIn?: string;

  /** Refresh token expiration time (default: 7d) */
  refreshExpiresIn?: string;

  /** Signing algorithm (default: HS256) */
  algorithm?: 'HS256' | 'RS256';

  /** Issuer name */
  issuer?: string;

  /** Audience */
  audience?: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface VerifyResult {
  valid: boolean;
  payload?: JWTPayload;
  error?: string;
  expired?: boolean;
}

/**
 * JWT Service Class
 * Handles all JWT-related operations including token generation, validation, and refresh
 */
export class JWTService {
  private config: Required<Omit<JWTServiceConfig, 'publicKey' | 'issuer' | 'audience'>> & {
    publicKey?: string;
    issuer?: string;
    audience?: string;
  };

  constructor(config: JWTServiceConfig) {
    this.config = {
      secretOrPrivateKey: config.secretOrPrivateKey,
      publicKey: config.publicKey,
      expiresIn: config.expiresIn || '1h',
      refreshExpiresIn: config.refreshExpiresIn || '7d',
      algorithm: config.algorithm || 'HS256',
      issuer: config.issuer,
      audience: config.audience,
    };

    this.validateConfig();
  }

  /**
   * Validate service configuration
   */
  private validateConfig(): void {
    if (!this.config.secretOrPrivateKey) {
      throw new Error('Secret or private key is required');
    }

    if (this.config.algorithm === 'RS256' && !this.config.publicKey) {
      throw new Error('Public key is required for RS256 algorithm');
    }
  }

  /**
   * Generate JWT access token and refresh token pair
   *
   * @param user - User object to generate tokens for
   * @returns Token pair with access and refresh tokens
   */
  generateTokenPair(user: UserPublic): TokenPair {
    const payload = {
      sub: user.id,
      email: user.email,
    };

    const signOptions: SignOptions = {
      algorithm: this.config.algorithm,
      expiresIn: this.config.expiresIn,
      ...(this.config.issuer && { issuer: this.config.issuer }),
      ...(this.config.audience && { audience: this.config.audience }),
    };

    const accessToken = jwt.sign(payload, this.config.secretOrPrivateKey, signOptions);

    const refreshToken = jwt.sign(payload, this.config.secretOrPrivateKey, {
      ...signOptions,
      expiresIn: this.config.refreshExpiresIn,
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: this.parseExpiration(this.config.expiresIn),
    };
  }

  /**
   * Generate a single access token
   *
   * @param user - User object to generate token for
   * @returns JWT access token string
   */
  generateAccessToken(user: UserPublic): string {
    const payload = {
      sub: user.id,
      email: user.email,
    };

    const signOptions: SignOptions = {
      algorithm: this.config.algorithm,
      expiresIn: this.config.expiresIn,
      ...(this.config.issuer && { issuer: this.config.issuer }),
      ...(this.config.audience && { audience: this.config.audience }),
    };

    return jwt.sign(payload, this.config.secretOrPrivateKey, signOptions);
  }

  /**
   * Verify and decode JWT token
   *
   * @param token - JWT token string to verify
   * @returns Verification result with payload or error
   */
  verifyToken(token: string): VerifyResult {
    try {
      const verifyOptions: VerifyOptions = {
        algorithms: [this.config.algorithm],
        ...(this.config.issuer && { issuer: this.config.issuer }),
        ...(this.config.audience && { audience: this.config.audience }),
      };

      const secretOrPublicKey =
        this.config.algorithm === 'RS256' && this.config.publicKey
          ? this.config.publicKey
          : this.config.secretOrPrivateKey;

      const decoded = jwt.verify(token, secretOrPublicKey, verifyOptions) as JwtPayload;

      const payload: JWTPayload = {
        sub: decoded.sub as string,
        email: decoded.email as string,
        iat: decoded.iat as number,
        exp: decoded.exp as number,
      };

      return {
        valid: true,
        payload,
      };
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return {
          valid: false,
          error: 'Token has expired',
          expired: true,
        };
      }

      if (error instanceof jwt.JsonWebTokenError) {
        return {
          valid: false,
          error: error.message,
          expired: false,
        };
      }

      return {
        valid: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        expired: false,
      };
    }
  }

  /**
   * Refresh access token using refresh token
   *
   * @param refreshToken - Valid refresh token
   * @returns New token pair if refresh token is valid
   */
  refreshAccessToken(refreshToken: string): TokenPair | null {
    const verifyResult = this.verifyToken(refreshToken);

    if (!verifyResult.valid || !verifyResult.payload) {
      return null;
    }

    const user: UserPublic = {
      id: verifyResult.payload.sub,
      email: verifyResult.payload.email,
      created_at: new Date(),
      updated_at: new Date(),
    };

    return this.generateTokenPair(user);
  }

  /**
   * Decode token without verification (unsafe, use only for debugging)
   *
   * @param token - JWT token to decode
   * @returns Decoded payload or null
   */
  decodeToken(token: string): JWTPayload | null {
    try {
      const decoded = jwt.decode(token) as JwtPayload | null;
      if (!decoded) return null;

      return {
        sub: decoded.sub as string,
        email: decoded.email as string,
        iat: decoded.iat as number,
        exp: decoded.exp as number,
      };
    } catch {
      return null;
    }
  }

  /**
   * Check if token is expired
   *
   * @param token - JWT token to check
   * @returns True if expired, false otherwise
   */
  isTokenExpired(token: string): boolean {
    const payload = this.decodeToken(token);
    if (!payload || !payload.exp) return true;

    return Math.floor(Date.now() / 1000) >= payload.exp;
  }

  /**
   * Hash password using bcrypt
   *
   * @param password - Plain text password
   * @param rounds - Bcrypt salt rounds (default: 10)
   * @returns Hashed password
   */
  async hashPassword(password: string, rounds: number = 10): Promise<string> {
    return bcrypt.hash(password, rounds);
  }

  /**
   * Compare plain text password with hashed password
   *
   * @param password - Plain text password
   * @param hash - Hashed password to compare against
   * @returns True if passwords match, false otherwise
   */
  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Generate unique user ID
   *
   * @returns UUID v4 string
   */
  generateUserId(): string {
    return uuidv4();
  }

  /**
   * Parse expiration time string to seconds
   *
   * @param expiration - Expiration string (e.g., '1h', '7d', '60s')
   * @returns Expiration time in seconds
   */
  private parseExpiration(expiration: string): number {
    const match = expiration.match(/^(\d+)([smhd])$/);
    if (!match) {
      throw new Error(`Invalid expiration format: ${expiration}`);
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
      case 's':
        return value;
      case 'm':
        return value * 60;
      case 'h':
        return value * 60 * 60;
      case 'd':
        return value * 60 * 60 * 24;
      default:
        throw new Error(`Invalid expiration unit: ${unit}`);
    }
  }

  /**
   * Get token expiration time in seconds from now
   *
   * @param token - JWT token
   * @returns Seconds until expiration, or 0 if expired/invalid
   */
  getTokenTTL(token: string): number {
    const payload = this.decodeToken(token);
    if (!payload || !payload.exp) return 0;

    const ttl = payload.exp - Math.floor(Date.now() / 1000);
    return ttl > 0 ? ttl : 0;
  }
}

/**
 * Create JWT Service instance with default configuration
 *
 * @param secret - Secret key for token signing
 * @param options - Optional configuration overrides
 * @returns JWT Service instance
 */
export function createJWTService(secret: string, options?: Partial<JWTServiceConfig>): JWTService {
  return new JWTService({
    secretOrPrivateKey: secret,
    ...options,
  });
}
