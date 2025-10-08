/**
 * POST /api/auth/logout
 * User logout endpoint
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { JWTService } from '@/lib/auth/jwt';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // Get current user
    const currentUser = await JWTService.getCurrentUser();

    if (currentUser) {
      // Delete all sessions for this user
      await prisma.session.deleteMany({
        where: {
          userId: currentUser.userId,
        },
      });
    }

    // Clear auth cookies
    await JWTService.clearAuthCookies();

    return NextResponse.json({
      message: 'Logout successful',
    });
  } catch (error: any) {
    console.error('Logout error:', error);

    // Clear cookies even if there's an error
    await JWTService.clearAuthCookies();

    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
