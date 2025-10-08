import { NextRequest, NextResponse } from 'next/server';
import { BytePlusClient } from '@/lib/api/byteplus-client';
import type {
  ImageGenerationRequest,
  ImageGenerationResponse,
} from '@/lib/types/byteplus';

/**
 * POST /api/edit - Image-to-Image Editing
 *
 * Edit existing images using BytePlus SeedEdit i2i model.
 * This is a convenience endpoint that wraps /api/generate with i2i-specific defaults.
 *
 * Request body:
 * {
 *   image: string | string[],     // URL(s) to source image(s)
 *   prompt: string,                // Edit instructions
 *   size?: '1K' | '2K' | '4K',
 *   watermark?: boolean,
 *   seed?: number
 * }
 *
 * Response: ImageGenerationResponse
 *
 * @example
 * ```typescript
 * const response = await fetch('/api/edit', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({
 *     image: 'https://example.com/original.jpg',
 *     prompt: 'Add a rainbow in the sky, enhance colors',
 *     size: '2K',
 *     watermark: false
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

    const body = await request.json();

    // Validate required fields
    if (!body.image) {
      return NextResponse.json(
        { error: 'Missing required field: image (URL or array of URLs)' },
        { status: 400 }
      );
    }

    if (!body.prompt) {
      return NextResponse.json(
        { error: 'Missing required field: prompt (edit instructions)' },
        { status: 400 }
      );
    }

    // Normalize image input to array
    const imageArray = Array.isArray(body.image) ? body.image : [body.image];

    // Validate image URLs
    for (const img of imageArray) {
      if (typeof img !== 'string' || !img.trim()) {
        return NextResponse.json(
          { error: 'Invalid image URL format' },
          { status: 400 }
        );
      }
    }

    // Build image-to-image request
    const editRequest: ImageGenerationRequest = {
      model: 'Bytedance-SeedEdit-3.0-i2i',
      prompt: body.prompt,
      image: imageArray,
      size: body.size ?? '2K',
      response_format: body.response_format ?? 'url',
      watermark: body.watermark ?? true,
      seed: body.seed,
    };

    // Generate edited image
    const result: ImageGenerationResponse = await client.generateImage(editRequest);

    return NextResponse.json({
      ...result,
      metadata: {
        ...result.metadata,
        editType: 'i2i',
        originalImage: imageArray[0],
        model: 'Bytedance-SeedEdit-3.0-i2i',
      },
    });
  } catch (error: any) {
    console.error('Image edit error:', error);

    return NextResponse.json(
      {
        error: error.message || 'Failed to edit image',
        details: error.response?.data || error.toString(),
      },
      { status: error.statusCode || 500 }
    );
  }
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
