import { NextRequest, NextResponse } from 'next/server';
import { BytePlusClient } from '@/lib/api/byteplus-client';
import type {
  ImageGenerationRequest,
  ImageGenerationResponse
} from '@/lib/types/byteplus';

export async function POST(request: NextRequest) {
  try {
    // Initialize client at runtime
    const client = new BytePlusClient({
      apiKey: process.env.BYTEPLUS_API_KEY!,
      endpoint: process.env.BYTEPLUS_ENDPOINT!,
    });

    const body = await request.json() as ImageGenerationRequest;

    // Validate required fields
    if (!body.model || !body.prompt) {
      return NextResponse.json(
        { error: 'Missing required fields: model and prompt' },
        { status: 400 }
      );
    }

    // Generate image using BytePlusClient
    const result: ImageGenerationResponse = await client.generateImage(body);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Image generation error:', error);

    return NextResponse.json(
      {
        error: error.message || 'Failed to generate image',
        details: error.response?.data || error.toString()
      },
      { status: error.statusCode || 500 }
    );
  }
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
