/**
 * Text-to-Video (T2V) API Test Script
 *
 * Tests BytePlus API's ability to generate videos directly from text prompts.
 * Based on analysis showing I2V has 66.7% success rate vs T2V 10%.
 *
 * This script will help determine if T2V is viable for production use.
 *
 * Run: npx tsx test-t2v-api.ts
 */

import { BytePlusClient } from './src/api/byteplus-client.js';
import { config } from 'dotenv';
import * as fs from 'fs';

config();

interface T2VTestCase {
  name: string;
  prompt: string;
  duration: 5 | 10;
  resolution: '480P' | '720P' | '1080P';
  ratio: 'Auto' | '16:9' | '9:16' | '1:1';
  expectedOutcome: 'success' | 'failure' | 'unknown';
  notes?: string;
}

const testCases: T2VTestCase[] = [
  {
    name: 'Simple Subject - Single Person',
    prompt:
      'An elderly woman playing video games enthusiastically, smooth camera pan from left to right, cozy living room with warm lighting, cinematic style',
    duration: 5,
    resolution: '1080P',
    ratio: '16:9',
    expectedOutcome: 'success',
    notes: 'Single subject + dynamic camera (best practice)',
  },
  {
    name: 'Product Showcase',
    prompt:
      'A luxury watch rotating on display stand, white studio background with soft shadows, commercial photography style, professional lighting',
    duration: 5,
    resolution: '1080P',
    ratio: '1:1',
    expectedOutcome: 'success',
    notes: 'Fixed subject + simple rotation',
  },
  {
    name: 'Nature Scene - Landscape',
    prompt:
      'Scenic mountain landscape at sunset, slow zoom out revealing valley below, golden hour lighting, aerial drone shot, cinematic 4K quality',
    duration: 10,
    resolution: '1080P',
    ratio: '16:9',
    expectedOutcome: 'unknown',
    notes: 'Complex scene with camera movement',
  },
  {
    name: 'Multiple Subjects (Known Issue)',
    prompt:
      'Elderly woman and young child playing video games together, laughing and smiling, living room setting, warm lighting',
    duration: 5,
    resolution: '1080P',
    ratio: '16:9',
    expectedOutcome: 'failure',
    notes: 'Multiple subjects - 80% failure rate from analysis',
  },
  {
    name: 'Action Scene - High Motion',
    prompt:
      'Runner jogging through city park, camera follows from side, morning sunlight through trees, dynamic handheld camera movement',
    duration: 5,
    resolution: '1080P',
    ratio: '16:9',
    expectedOutcome: 'unknown',
    notes: 'High motion + follow camera',
  },
  {
    name: 'Abstract Animation',
    prompt:
      'Colorful abstract shapes morphing and flowing, smooth transitions, vibrant gradients, psychedelic style, looping animation',
    duration: 5,
    resolution: '720P',
    ratio: '1:1',
    expectedOutcome: 'unknown',
    notes: 'Abstract content - no human subjects',
  },
];

interface TestResult {
  testCase: T2VTestCase;
  success: boolean;
  videoUrl?: string;
  thumbnailUrl?: string;
  error?: string;
  generationTime?: number;
  actualDuration?: number;
}

async function runT2VTest(
  client: BytePlusClient,
  testCase: T2VTestCase
): Promise<TestResult> {
  console.log(`\n${'='.repeat(70)}`);
  console.log(`🎬 Test: ${testCase.name}`);
  console.log('─'.repeat(70));
  console.log(`Prompt: ${testCase.prompt}`);
  console.log(`Duration: ${testCase.duration}s`);
  console.log(`Resolution: ${testCase.resolution}`);
  console.log(`Ratio: ${testCase.ratio}`);
  console.log(`Expected: ${testCase.expectedOutcome.toUpperCase()}`);
  if (testCase.notes) {
    console.log(`Notes: ${testCase.notes}`);
  }
  console.log('─'.repeat(70));

  const startTime = Date.now();

  try {
    // Attempt T2V generation
    // NOTE: Most BytePlus APIs require an image for video generation (I2V)
    // This will likely fail as T2V is not directly supported
    // We're testing this to confirm the API behavior

    console.log('⏳ Generating video from text prompt...');

    // Try using generateVideo without image (T2V attempt)
    const result = await client.generateVideo({
      model: 'Bytedance-Seedance-1.0-pro',
      image: '', // Empty image - testing T2V
      prompt: testCase.prompt,
      resolution: testCase.resolution,
      ratio: testCase.ratio,
      duration: testCase.duration,
      quantity: 1,
      watermark: true,
    });

    const generationTime = Date.now() - startTime;

    console.log('\n✅ SUCCESS!');
    console.log(`   Video URL: ${result.data[0].url}`);
    console.log(`   Thumbnail: ${result.data[0].thumbnail_url || 'N/A'}`);
    console.log(`   Generation time: ${generationTime}ms (${(generationTime / 1000).toFixed(1)}s)`);

    return {
      testCase,
      success: true,
      videoUrl: result.data[0].url,
      thumbnailUrl: result.data[0].thumbnail_url,
      generationTime,
      actualDuration: result.data[0].duration,
    };
  } catch (error) {
    const generationTime = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : String(error);

    console.log('\n❌ FAILED');
    console.log(`   Error: ${errorMessage}`);
    console.log(`   Time before failure: ${generationTime}ms`);

    return {
      testCase,
      success: false,
      error: errorMessage,
      generationTime,
    };
  }
}

async function main() {
  console.log('╔════════════════════════════════════════════════════════════════════╗');
  console.log('║          BytePlus Text-to-Video (T2V) API Test Suite              ║');
  console.log('╚════════════════════════════════════════════════════════════════════╝');
  console.log();
  console.log('⚠️  WARNING: Based on analysis, T2V has only 10% success rate');
  console.log('   I2V (Image-to-Video) is recommended with 66.7% success rate');
  console.log();

  const client = new BytePlusClient({
    apiKey: process.env.BYTEPLUS_API_KEY!,
    endpoint: process.env.BYTEPLUS_ENDPOINT!,
    timeout: 120000, // 2 minutes timeout
    retryAttempts: 2,
    debug: true,
  });

  const results: TestResult[] = [];

  // Run all test cases
  for (const testCase of testCases) {
    const result = await runT2VTest(client, testCase);
    results.push(result);

    // Wait between tests to respect rate limits
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  // Generate summary report
  console.log('\n\n');
  console.log('╔════════════════════════════════════════════════════════════════════╗');
  console.log('║                         TEST SUMMARY                               ║');
  console.log('╚════════════════════════════════════════════════════════════════════╝');
  console.log();

  const successCount = results.filter((r) => r.success).length;
  const failureCount = results.filter((r) => !r.success).length;
  const successRate = ((successCount / results.length) * 100).toFixed(1);

  console.log(`Total tests: ${results.length}`);
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${failureCount}`);
  console.log(`📊 Success rate: ${successRate}%`);
  console.log();

  // Detailed results table
  console.log('Detailed Results:');
  console.log('─'.repeat(70));
  results.forEach((result, index) => {
    const status = result.success ? '✅' : '❌';
    const time = result.generationTime
      ? `${(result.generationTime / 1000).toFixed(1)}s`
      : 'N/A';

    console.log(`${index + 1}. ${status} ${result.testCase.name}`);
    console.log(`   Expected: ${result.testCase.expectedOutcome.toUpperCase()}`);
    console.log(`   Actual: ${result.success ? 'SUCCESS' : 'FAILURE'}`);
    console.log(`   Time: ${time}`);

    if (result.success && result.videoUrl) {
      console.log(`   Video: ${result.videoUrl}`);
    }

    if (!result.success && result.error) {
      console.log(`   Error: ${result.error}`);
    }

    console.log();
  });

  // Save results to JSON
  const reportPath = './t2v-test-results.json';
  fs.writeFileSync(
    reportPath,
    JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        summary: {
          totalTests: results.length,
          successful: successCount,
          failed: failureCount,
          successRate: parseFloat(successRate),
        },
        results: results.map((r) => ({
          testName: r.testCase.name,
          prompt: r.testCase.prompt,
          expectedOutcome: r.testCase.expectedOutcome,
          actualOutcome: r.success ? 'success' : 'failure',
          success: r.success,
          generationTime: r.generationTime,
          videoUrl: r.videoUrl,
          thumbnailUrl: r.thumbnailUrl,
          error: r.error,
          notes: r.testCase.notes,
        })),
      },
      null,
      2
    )
  );

  console.log(`📄 Full report saved to: ${reportPath}`);
  console.log();

  // Recommendations
  console.log('╔════════════════════════════════════════════════════════════════════╗');
  console.log('║                      RECOMMENDATIONS                               ║');
  console.log('╚════════════════════════════════════════════════════════════════════╝');
  console.log();

  if (successRate === '0.0') {
    console.log('❌ T2V API appears to be unsupported or unavailable');
    console.log('   Recommendation: Use I2V workflow instead');
    console.log();
    console.log('   I2V Workflow:');
    console.log('   1. Generate image with SEEDREAM4 (t2i)');
    console.log('   2. Convert image to video with SEEDANCE (i2v)');
    console.log('   Success rate: 66.7%');
  } else if (parseFloat(successRate) < 50) {
    console.log(`⚠️  Low success rate (${successRate}%)`);
    console.log('   Recommendation: Use I2V workflow for production');
    console.log('   T2V may be suitable for specific use cases only');
  } else {
    console.log(`✅ Acceptable success rate (${successRate}%)`);
    console.log('   T2V may be viable for production use');
    console.log('   Review individual test results for patterns');
  }

  console.log();
  console.log('For best practices, see: BYTEPLUS_BEST_PRACTICES.md');
  console.log();
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
