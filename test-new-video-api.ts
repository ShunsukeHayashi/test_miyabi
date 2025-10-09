/**
 * Test script for new BytePlus Task-based Video Generation API
 *
 * This script tests the new seedance-1-0-pro-250528 model with:
 * - Task creation and polling
 * - Camera control (--camerafixed)
 * - Resolution options (--resolution)
 * - Duration control (--duration)
 *
 * Run: npx tsx test-new-video-api.ts
 */

import { BytePlusAI } from './src/api/byteplus-ai.js';
import { config } from 'dotenv';

config();

async function main() {
  console.log('=== BytePlus New Task-based Video API Test ===\n');

  const ai = new BytePlusAI({
    apiKey: process.env.BYTEPLUS_API_KEY!,
    endpoint: process.env.BYTEPLUS_ENDPOINT!,
    debug: true,
  });

  // Test image URL from BytePlus docs
  const testImageUrl =
    'https://ark-doc.tos-ap-southeast-1.bytepluses.com/seepro_i2v%20.png';

  console.log('📹 Test 1: Dynamic camera movement (camerafixed: false)');
  console.log('─'.repeat(60));

  try {
    const result1 = await ai.generateVideo(
      {
        model: 'seedance-1-0-pro-250528',
        image: testImageUrl,
        prompt:
          'At breakneck speed, drones thread through intricate obstacles or stunning natural wonders, delivering an immersive, heart-pounding flying experience.',
        resolution: '1080p',
        duration: 5,
        camerafixed: false,
      },
      { optimizePrompt: false } // Use original prompt from docs
    );

    console.log('\n✅ Video generated successfully!');
    console.log(`   Video URL: ${result1.data[0].url}`);
    console.log(
      `   Thumbnail: ${result1.data[0].thumbnail_url || 'N/A'}`
    );
    console.log(
      `   Generation time: ${result1.metadata?.generationTime}ms`
    );
  } catch (error) {
    console.error('\n❌ Test 1 failed:', error);
  }

  console.log('\n' + '='.repeat(60) + '\n');

  console.log('📹 Test 2: Fixed camera with AI-optimized prompt');
  console.log('─'.repeat(60));

  try {
    const result2 = await ai.generateVideo(
      {
        model: 'seedance-1-0-pro-250528',
        image: testImageUrl,
        prompt: 'Smooth professional camera movement, cinematic style',
        resolution: '1080p',
        duration: 5,
        camerafixed: true, // Fixed camera
      },
      { optimizePrompt: true } // AI-optimized prompt
    );

    console.log('\n✅ Video generated successfully!');
    console.log(`   Video URL: ${result2.data[0].url}`);
    console.log(
      `   Thumbnail: ${result2.data[0].thumbnail_url || 'N/A'}`
    );
    console.log(
      `   Generation time: ${result2.metadata?.generationTime}ms`
    );
  } catch (error) {
    console.error('\n❌ Test 2 failed:', error);
  }

  console.log('\n' + '='.repeat(60) + '\n');

  console.log('🎬 Test 3: Low-level API (Direct task creation)');
  console.log('─'.repeat(60));

  try {
    const client = ai.clients.image;

    // Create task
    const task = await client.createVideoTask({
      model: 'seedance-1-0-pro-250528',
      content: [
        {
          type: 'text',
          text: 'Test video generation --resolution 1080p --duration 5 --camerafixed false',
        },
        {
          type: 'image_url',
          image_url: { url: testImageUrl },
        },
      ],
    });

    console.log(`   Task created: ${task.id}`);
    console.log('   Polling for status...');

    // Poll for completion
    let attempts = 0;
    while (true) {
      attempts++;
      const status = await client.getTaskStatus(task.id);

      console.log(
        `   [Attempt ${attempts}] Status: ${status.status}`
      );

      if (status.status === 'succeeded') {
        console.log('\n✅ Video generated successfully!');
        console.log(`   Video URL: ${status.content!.video_url}`);
        break;
      }

      if (status.status === 'failed') {
        console.error('\n❌ Task failed:', status.error);
        break;
      }

      // Wait 1 second before next poll
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  } catch (error) {
    console.error('\n❌ Test 3 failed:', error);
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ All tests completed!');
}

main().catch(console.error);
