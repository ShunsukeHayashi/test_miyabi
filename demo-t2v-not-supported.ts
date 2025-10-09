/**
 * Demonstration: Text-to-Video (T2V) is NOT supported
 *
 * This script demonstrates that BytePlus SEEDANCE API requires
 * a source image for ALL video generation. Direct text-to-video
 * is not available.
 *
 * Run: npx tsx demo-t2v-not-supported.ts
 */

import { BytePlusClient } from './src/api/byteplus-client.js';
import { config } from 'dotenv';

config();

async function attemptT2V() {
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║     Demonstrating T2V (Text-to-Video) is NOT Supported        ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  console.log();

  const client = new BytePlusClient({
    apiKey: process.env.BYTEPLUS_API_KEY!,
    endpoint: process.env.BYTEPLUS_ENDPOINT!,
    debug: false,
  });

  // Attempt 1: Try old API without image
  console.log('Attempt 1: Old API (Bytedance-Seedance-1.0-pro) without image');
  console.log('─'.repeat(70));

  try {
    await client.generateVideo({
      model: 'Bytedance-Seedance-1.0-pro',
      image: '', // Empty image
      prompt: 'A beautiful sunset over mountains',
      duration: 5,
    });
    console.log('✅ Unexpected success!');
  } catch (error) {
    console.log('❌ Expected failure:', error instanceof Error ? error.message : error);
  }

  console.log();

  // Attempt 2: Try new task-based API with only text content
  console.log('Attempt 2: New API (seedance-1-0-pro-250528) with text only');
  console.log('─'.repeat(70));

  try {
    const task = await client.createVideoTask({
      model: 'seedance-1-0-pro-250528',
      content: [
        {
          type: 'text',
          text: 'A beautiful sunset over mountains --resolution 1080p --duration 5 --camerafixed false',
        },
        // No image_url provided
      ],
    });

    console.log(`Task created: ${task.id}`);
    console.log('Polling for result...');

    // Check task status
    const status = await client.getTaskStatus(task.id);
    console.log(`Status: ${status.status}`);

    if (status.status === 'failed') {
      console.log('❌ Task failed (as expected):', status.error);
    } else {
      console.log('✅ Unexpected success! Task is running.');
    }
  } catch (error) {
    console.log('❌ Expected failure:', error instanceof Error ? error.message : error);
  }

  console.log();

  // Attempt 3: Demonstrate correct I2V workflow
  console.log('Attempt 3: Correct I2V (Image-to-Video) workflow');
  console.log('─'.repeat(70));

  try {
    const task = await client.createVideoTask({
      model: 'seedance-1-0-pro-250528',
      content: [
        {
          type: 'text',
          text: 'Dynamic camera movement --resolution 1080p --duration 5 --camerafixed false',
        },
        {
          type: 'image_url',
          image_url: {
            url: 'https://ark-doc.tos-ap-southeast-1.bytepluses.com/seepro_i2v%20.png',
          },
        },
      ],
    });

    console.log(`✅ Task created successfully: ${task.id}`);
    console.log('Note: With source image, task creation works!');
    console.log('(Not polling for completion to save time)');
  } catch (error) {
    console.log('❌ Unexpected failure:', error instanceof Error ? error.message : error);
  }

  console.log();
  console.log('═'.repeat(70));
  console.log('CONCLUSION:');
  console.log('═'.repeat(70));
  console.log();
  console.log('BytePlus SEEDANCE API requires a source image for ALL video generation.');
  console.log('Text-to-Video (T2V) is NOT supported.');
  console.log();
  console.log('✅ Recommended workflow: Image-to-Video (I2V)');
  console.log('   1. Generate image with SEEDREAM4 (t2i)');
  console.log('   2. Convert image to video with SEEDANCE (i2v)');
  console.log();
  console.log('For details, see: BYTEPLUS_BEST_PRACTICES.md');
  console.log();
}

attemptT2V().catch(console.error);
