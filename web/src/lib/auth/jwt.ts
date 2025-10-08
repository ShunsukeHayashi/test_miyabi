/**
 * JWT Authentication Service
 *
 * Handles JWT token generation, validation, and refresh mechanism.
 * Uses jose library for edge runtime compatibility.
 *
 * @module lib/auth/jwt
 */

import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import { cookies } from 'next/headers';

/**
 * JWT configuration
 */
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-this-in-production'
);

const JWT_ACCESS_TOKEN_EXPIRES_IN = '15m'; // 15 minutes
const JWT_REFRESH_TOKEN_EXPIRES_IN = '7d'; // 7 days

/**
 * JWT Payload interface
 */
export interface JWTPayloadExtended extends JWTPayload {
  userId: string;
  email: string;
  type: 'access' | 'refresh';
}

/**
 * JWT Service for authentication
 */
export class JWTService {
  /**
   * Generate access token
   *
   * @param userId - User ID
   * @param email - User email
   * @returns Access token
   */
  static async generateAccessToken(
    userId: string,
    email: string
  ): Promise<string> {
    const token = await new SignJWT({
      userId,
      email,
      type: 'access',
    } as JWTPayloadExtended)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(JWT_ACCESS_TOKEN_EXPIRES_IN)
      .setIssuer('byteflow')
      .setAudience('byteflow-users')
      .sign(JWT_SECRET);

    return token;
  }

  /**
   * Generate refresh token
   *
   * @param userId - User ID
   * @param email - User email
   * @returns Refresh token
   */
  static async generateRefreshToken(
    userId: string,
    email: string
  ): Promise<string> {
    const token = await new SignJWT({
      userId,
      email,
      type: 'refresh',
    } as JWTPayloadExtended)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(JWT_REFRESH_TOKEN_EXPIRES_IN)
      .setIssuer('byteflow')
      .setAudience('byteflow-users')
      .sign(JWT_SECRET);

    return token;
  }

  /**
   * Validate JWT token
   *
   * @param token - JWT token to validate
   * @returns Decoded payload if valid
   * @throws Error if token is invalid or expired
   */
  static async verifyToken(token: string): Promise<JWTPayloadExtended> {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET, {
        issuer: 'byteflow',
        audience: 'byteflow-users',
      });

      return payload as JWTPayloadExtended;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Token validation failed: ${error.message}`);
      }
      throw new Error('Token validation failed');
    }
  }

  /**
   * Refresh access token using refresh token
   *
   * @param refreshToken - Refresh token
   * @returns New access token and refresh token
   * @throws Error if refresh token is invalid
   */
  static async refreshAccessToken(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const payload = await this.verifyToken(refreshToken);

    if (payload.type !== 'refresh') {
      throw new Error('Invalid token type. Expected refresh token.');
    }

    const newAccessToken = await this.generateAccessToken(
      payload.userId,
      payload.email
    );

    const newRefreshToken = await this.generateRefreshToken(
      payload.userId,
      payload.email
    );

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  /**
   * Get token from cookies
   *
   * @returns Access token from cookies or null
   */
  static async getTokenFromCookies(): Promise<string | null> {
    const cookieStore = await cookies();
    return cookieStore.get('access_token')?.value || null;
  }

  /**
   * Set token in cookies
   *
   * @param accessToken - Access token
   * @param refreshToken - Refresh token
   */
  static async setTokenCookies(
    accessToken: string,
    refreshToken: string
  ): Promise<void> {
    const cookieStore = await cookies();

    // Set access token (httpOnly, secure in production)
    cookieStore.set('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60, // 15 minutes
      path: '/',
    });

    // Set refresh token (httpOnly, secure in production)
    cookieStore.set('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });
  }

  /**
   * Clear auth cookies
   */
  static async clearAuthCookies(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete('access_token');
    cookieStore.delete('refresh_token');
  }

  /**
   * Get current user from token
   *
   * @returns User payload or null if not authenticated
   */
  static async getCurrentUser(): Promise<JWTPayloadExtended | null> {
    try {
      const token = await this.getTokenFromCookies();
      if (!token) return null;

      const payload = await this.verifyToken(token);
      return payload;
    } catch (error) {
      return null;
    }
  }
}

/**
 * Utility function to hash passwords
 */
export async function hashPassword(password: string): Promise<string> {
  const bcrypt = await import('bcryptjs');
  return bcrypt.hash(password, 12);
}

/**
 * Utility function to compare passwords
 */
export async function comparePasswords(
  password: string,
  hash: string
): Promise<boolean> {
  const bcrypt = await import('bcryptjs');
  return bcrypt.compare(password, hash);
}
