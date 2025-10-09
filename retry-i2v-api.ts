#!/usr/bin/env tsx

/**
 * Retry BytePlus I2V API with different parameter combinations
 * Test if API has recovered from JSON parse errors
 */

import { BytePlusClient } from './src/api/byteplus-client.js';
import fs from 'fs/promises';

const client = new BytePlusClient({
  apiKey: process.env.BYTEPLUS_API_KEY!,
  endpoint: process.env.BYTEPLUS_ENDPOINT!,
  debug: true,
});

// Use Scene 1 image (already generated)
// Replace with your actual image URL from BytePlus API
const TEST_IMAGE_URL = process.env.TEST_IMAGE_URL || 'https://example.com/your-image.jpg';

// Test configurations (from simplest to most complex)
const TEST_CONFIGS = [
  {
    name: 'Test 1: Minimal (10s, 720P, 16:9)',
    params: {
      model: 'Bytedance-Seedance-1.0-pro' as const,
      image: TEST_IMAGE_URL,
      resolution: '720P' as const,
      ratio: '16:9' as const,
      duration: 10 as 5 | 10,
      watermark: true,
    },
  },
  {
    name: 'Test 2: With prompt (10s, 720P, 16:9)',
    params: {
      model: 'Bytedance-Seedance-1.0-pro' as const,
      image: TEST_IMAGE_URL,
      prompt: 'Slow zoom in, gentle movement',
      resolution: '720P' as const,
      ratio: '16:9' as const,
      duration: 10 as 5 | 10,
      watermark: true,
    },
  },
  {
    name: 'Test 3: 1080P quality (10s, 16:9)',
    params: {
      model: 'Bytedance-Seedance-1.0-pro' as const,
      image: TEST_IMAGE_URL,
      prompt: 'Slow zoom in, gentle movement',
      resolution: '1080P' as const,
      ratio: '16:9' as const,
      duration: 10 as 5 | 10,
      watermark: true,
    },
  },
  {
    name: 'Test 4: TikTok format (5s, 1080P, 9:16)',
    params: {
      model: 'Bytedance-Seedance-1.0-pro' as const,
      image: TEST_IMAGE_URL,
      prompt: 'Slow zoom in, gentle movement',
      resolution: '1080P' as const,
      ratio: '9:16' as const,
      duration: 5 as 5 | 10,
      watermark: false,
    },
  },
  {
    name: 'Test 5: Full production (5s, 1080P, 9:16, fixed_lens)',
    params: {
      model: 'Bytedance-Seedance-1.0-pro' as const,
      image: TEST_IMAGE_URL,
      prompt: 'Slow gentle camera zoom in on peaceful face. Natural breathing. Calm atmosphere.',
      resolution: '1080P' as const,
      ratio: '9:16' as const,
      duration: 5 as 5 | 10,
      fixed_lens: true,
      watermark: false,
      seed: 100,
    },
  },
];

async function testI2V(config: typeof TEST_CONFIGS[0]): Promise<boolean> {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🧪 ${config.name}`);
  console.log('='.repeat(60));
  console.log('Parameters:', JSON.stringify(config.params, null, 2));

  try {
    const result = await client.generateVideo(config.params);

    if (result.data && result.data.length > 0) {
      const video = result.data[0];
      console.log('\n✅ SUCCESS!');
      console.log(`   Video URL: ${video.url}`);
      if (video.thumbnail_url) {
        console.log(`   Thumbnail: ${video.thumbnail_url}`);
      }
      return true;
    } else {
      console.log('\n❌ FAILED: No video data returned');
      return false;
    }
  } catch (error: any) {
    console.error('\n❌ FAILED');
    console.error(`   Error: ${error.message}`);
    if (error.message.includes('JSON')) {
      console.error('   Type: JSON parse error (API issue)');
    } else if (error.message.includes('400')) {
      console.error('   Type: Bad Request (parameter issue)');
    } else if (error.message.includes('429')) {
      console.error('   Type: Rate limit exceeded');
    } else if (error.message.includes('500')) {
      console.error('   Type: Server error (API outage)');
    }
    return false;
  }
}

async function main() {
  console.log('🔄 BytePlus I2V API Retry Test');
  console.log('Testing if API has recovered from JSON parse errors\n');

  if (!process.env.BYTEPLUS_API_KEY || !process.env.BYTEPLUS_ENDPOINT) {
    console.error('❌ Missing BYTEPLUS_API_KEY or BYTEPLUS_ENDPOINT');
    process.exit(1);
  }

  const results: Array<{ name: string; success: boolean }> = [];

  for (const config of TEST_CONFIGS) {
    const success = await testI2V(config);
    results.push({ name: config.name, success });

    if (success) {
      console.log('\n🎉 SUCCESS! I2V API is working!');
      console.log(`Working configuration: ${config.name}`);
      console.log('\nCan now proceed with full video generation.');
      break; // Stop on first success
    }

    // Wait between tests
    console.log('\n⏳ Waiting 5 seconds before next test...');
    await new Promise(resolve => setTimeout(resolve, 5000));
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(60));

  const successCount = results.filter(r => r.success).length;
  const totalTests = results.length;

  results.forEach(r => {
    console.log(`${r.success ? '✅' : '❌'} ${r.name}`);
  });

  console.log(`\nSuccess Rate: ${successCount}/${totalTests}`);

  if (successCount > 0) {
    console.log('\n✅ I2V API IS WORKING!');
    console.log('Recommendation: Proceed with full video generation using working configuration.');
  } else {
    console.log('\n❌ I2V API STILL NOT WORKING');
    console.log('Recommendations:');
    console.log('1. API is experiencing outage - wait for recovery');
    console.log('2. Proceed with manual video editing workflow');
    console.log('3. Contact BytePlus support for API status');
  }

  // Save results
  await fs.writeFile(
    './i2v-retry-test-results.json',
    JSON.stringify({
      timestamp: new Date().toISOString(),
      results,
      successCount,
      totalTests,
      apiWorking: successCount > 0,
    }, null, 2)
  );

  console.log('\n📁 Results saved to: i2v-retry-test-results.json\n');
}

main().catch(console.error);
