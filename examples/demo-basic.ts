/**
 * Byteflow - Basic Usage Demo
 *
 * Demonstrates basic image, video, and text generation using BytePlus API.
 *
 * @example
 * ts-node examples/demo-basic.ts
 */

import 'dotenv/config';
import { BytePlusClient } from '../src/api/byteplus-client.js';

async function main() {
  console.log('🌸 Byteflow - Basic Usage Demo\n');

  // Initialize client
  const client = new BytePlusClient({
    apiKey: process.env.BYTEPLUS_API_KEY!,
    endpoint: process.env.BYTEPLUS_ENDPOINT!,
    debug: true,
  });

  // Example 1: Text-to-Image (t2i)
  console.log('📸 Example 1: Text-to-Image Generation\n');
  try {
    const imageResult = await client.generateImage({
      model: 'seedream-4-0-250828',
      prompt: 'A beautiful sunset over mountains, photorealistic style, golden hour lighting',
      size: '2K',
      response_format: 'url',
      watermark: true,
      seed: 42,
    });

    console.log('✅ Image generated successfully!');
    console.log(`   URL: ${imageResult.data[0]?.url}`);
    console.log(`   Seed: ${imageResult.seed}`);
    console.log();
  } catch (error) {
    console.error('❌ Image generation failed:', error);
  }

  // Example 2: Image-to-Image (i2i) - Image Editing
  console.log('🎨 Example 2: Image Editing (i2i)\n');
  try {
    const editResult = await client.generateImage({
      model: 'Bytedance-SeedEdit-3.0-i2i',
      prompt: 'Add a vibrant rainbow in the sky, enhance colors, add soft glow effect',
      image: ['https://example.com/source-image.jpg'], // Replace with actual image URL
      size: '2K',
      response_format: 'url',
    });

    console.log('✅ Image edited successfully!');
    console.log(`   URL: ${editResult.data[0]?.url}`);
    console.log();
  } catch (error) {
    console.error('❌ Image editing failed:', error);
  }

  // Example 3: Image-to-Video (i2v)
  console.log('🎬 Example 3: Video Generation (i2v)\n');
  try {
    const videoResult = await client.generateVideo({
      model: 'Bytedance-Seedance-1.0-pro',
      image: 'https://example.com/source-image.jpg', // Replace with actual image URL
      prompt: 'Dynamic camera movement, cinematic style, smooth motion',
      resolution: '1080P',
      ratio: '16:9',
      duration: 5,
      fixed_lens: false,
      watermark: true,
    });

    console.log('✅ Video generated successfully!');
    console.log(`   URL: ${videoResult.data[0]?.url}`);
    console.log(`   Thumbnail: ${videoResult.data[0]?.thumbnail_url}`);
    console.log();
  } catch (error) {
    console.error('❌ Video generation failed:', error);
  }

  // Example 4: Batch Generation
  console.log('📦 Example 4: Batch Image Generation\n');
  try {
    const batchResult = await client.batchGenerate({
      prompts: [
        'A futuristic city at night, neon lights, cyberpunk style',
        'A serene forest in autumn, golden leaves, peaceful atmosphere',
        'An underwater coral reef, colorful fish, crystal clear water',
      ],
      sharedParams: {
        model: 'seedream-4-0-250828',
        size: '2K',
        watermark: false,
      },
      maxConcurrency: 3,
    });

    console.log('✅ Batch generation complete!');
    console.log(`   Successful: ${batchResult.successful.length}`);
    console.log(`   Failed: ${batchResult.failed.length}`);
    console.log(`   Success rate: ${(batchResult.successRate * 100).toFixed(1)}%`);
    console.log(`   Total time: ${batchResult.totalTime}ms`);
    console.log();
  } catch (error) {
    console.error('❌ Batch generation failed:', error);
  }

  console.log('🎉 Demo completed!');
}

main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
