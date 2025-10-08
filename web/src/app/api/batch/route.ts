import { NextRequest, NextResponse } from 'next/server';
import { BytePlusClient } from '@/lib/api/byteplus-client';
import type {
  BatchGenerationRequest,
  BatchGenerationResult,
} from '@/lib/types/byteplus';

/**
 * POST /api/batch - Batch Image Generation
 *
 * Generate multiple images in parallel with shared parameters.
 *
 * Request body:
 * {
 *   prompts: string[],
 *   sharedParams: {
 *     model: string,
 *     size?: '1K' | '2K' | '4K',
 *     watermark?: boolean,
 *     seed?: number
 *   },
 *   maxConcurrency?: number (default: 10)
 * }
 *
 * Response:
 * {
 *   successful: ImageGenerationResponse[],
 *   failed: { prompt: string, error: string }[],
 *   totalTime: number,
 *   successRate: number
 * }
 *
 * @example
 * ```typescript
 * const response = await fetch('/api/batch', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({
 *     prompts: [
 *       'A sunset over mountains',
 *       'A city at night',
 *       'A forest in autumn'
 *     ],
 *     sharedParams: {
 *       model: 'seedream-4-0-250828',
 *       size: '2K',
 *       watermark: true
 *     },
 *     maxConcurrency: 3
 *   })
 * });
 * ```
 */
export async function POST(request: NextRequest) {
  try {
    // Initialize client at runtime
    const client = new BytePlusClient({
      apiKey: process.env.BYTEPLUS_API_KEY!,
      endpoint: process.env.BYTEPLUS_ENDPOINT!,
      debug: process.env.NODE_ENV === 'development',
    });

    const body = (await request.json()) as BatchGenerationRequest;

    // Validate required fields
    if (!body.prompts || !Array.isArray(body.prompts) || body.prompts.length === 0) {
      return NextResponse.json(
        { error: 'Missing required field: prompts (must be a non-empty array)' },
        { status: 400 }
      );
    }

    if (!body.sharedParams?.model) {
      return NextResponse.json(
        { error: 'Missing required field: sharedParams.model' },
        { status: 400 }
      );
    }

    // Validate prompt count
    if (body.prompts.length > 100) {
      return NextResponse.json(
        { error: 'Too many prompts (max: 100)' },
        { status: 400 }
      );
    }

    // Validate maxConcurrency
    if (body.maxConcurrency && (body.maxConcurrency < 1 || body.maxConcurrency > 20)) {
      return NextResponse.json(
        { error: 'maxConcurrency must be between 1 and 20' },
        { status: 400 }
      );
    }

    // Execute batch generation
    const result: BatchGenerationResult = await client.batchGenerate(body);

    return NextResponse.json({
      successful: result.successful,
      failed: result.failed,
      totalTime: result.totalTime,
      successRate: result.successRate,
      summary: {
        total: body.prompts.length,
        succeeded: result.successful.length,
        failed: result.failed.length,
        averageTimePerImage:
          result.successful.length > 0
            ? Math.round(result.totalTime / result.successful.length)
            : 0,
      },
    });
  } catch (error: any) {
    console.error('Batch generation error:', error);

    return NextResponse.json(
      {
        error: error.message || 'Failed to generate images in batch',
        details: error.response?.data || error.toString(),
      },
      { status: error.statusCode || 500 }
    );
  }
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes for batch operations
