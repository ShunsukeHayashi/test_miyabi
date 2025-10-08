import { NextRequest, NextResponse } from 'next/server';
import { BytePlusClient } from '@/lib/api/byteplus-client';
import type {
  VideoGenerationRequest,
  VideoGenerationResponse
} from '@/lib/types/byteplus';

export async function POST(request: NextRequest) {
  try {
    // Initialize client at runtime
    const client = new BytePlusClient({
      apiKey: process.env.BYTEPLUS_API_KEY!,
      endpoint: process.env.BYTEPLUS_ENDPOINT!,
    });

    const body = await request.json() as VideoGenerationRequest;

    if (!body.model || !body.image) {
      return NextResponse.json(
        { error: 'Missing required fields: model and image' },
        { status: 400 }
      );
    }

    const result: VideoGenerationResponse = await client.generateVideo(body);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Video generation error:', error);

    return NextResponse.json(
      {
        error: error.message || 'Failed to generate video',
        details: error.response?.data || error.toString()
      },
      { status: error.statusCode || 500 }
    );
  }
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
