#!/usr/bin/env tsx

/**
 * Generate Gamer Grandma video using SeedEdit 3.0 (I2I) correctly
 * Based on official BytePlus SeedEdit 3.0 API documentation
 */

import { BytePlusClient } from './src/api/byteplus-client.js';
import fs from 'fs/promises';
import path from 'path';

const OUTPUT_DIR = './gamer-grandma-seededit';
const SCENES_DIR = path.join(OUTPUT_DIR, 'scenes');
const LOG_FILE = './gamer-grandma-seededit.log';

// Initialize client
const client = new BytePlusClient({
  apiKey: process.env.BYTEPLUS_API_KEY!,
  endpoint: process.env.BYTEPLUS_ENDPOINT!,
  debug: true,
});

// Base character URL (from previous generation)
// Replace with your actual base character image URL
const BASE_CHARACTER_URL = process.env.BASE_CHARACTER_URL || 'https://example.com/your-character.jpg';

// Scene edit prompts (I2I transformations)
const SCENE_EDITS = [
  {
    id: 1,
    name: 'Peaceful Knitting',
    prompt: 'Add knitting needles in hands with colorful yarn. Add zabuton cushion beneath. Add low table with teacup and traditional sweets. Add shoji screen background with afternoon sunlight. Keep face identical.',
  },
  {
    id: 2,
    name: 'Gaming Transformation',
    prompt: 'Add RGB gaming headset with glowing blue and purple lights on head. Change expression to sharp and focused. Add gaming monitor glow on face. Add LED strip lights in background. Keep face structure identical.',
  },
  {
    id: 3,
    name: 'Intense Gaming',
    prompt: 'Zoom closer to face. Make expression fierce and concentrated. Add intense gaming monitor reflection in glasses. Add slight sweat on forehead. Add RGB headset lights pulsing. Keep facial features identical.',
  },
  {
    id: 4,
    name: 'Victory Celebration',
    prompt: 'Show her standing up from chair in triumph pose. Add controller in hands. Make headset slightly askew. Show mouth open in victorious shout. Add gaming monitor with victory screen in background. Keep face identical.',
  },
  {
    id: 5,
    name: 'Trash Talking',
    prompt: 'Show her leaning into boom microphone. Add one hand gesturing aggressively. Add gaming headset on head. Make cardigan slightly disheveled. Add reading glasses pushed up on head. Keep face identical.',
  },
  {
    id: 6,
    name: 'Calming Down',
    prompt: 'Show her removing gaming headset. Change expression from intense to calm. Show deep breath with shoulders relaxing. Add gaming monitor with game ending screen in background. Keep face identical.',
  },
  {
    id: 7,
    name: 'Return to Peace',
    prompt: 'Return to original peaceful setting. Show her picking up knitting needles. Restore gentle smile. Add afternoon light through shoji screen. Make cardigan neat again. Add reading glasses back in place. Keep face completely identical to Scene 1.',
  },
];

async function setupDirectories() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  await fs.mkdir(SCENES_DIR, { recursive: true });
  console.log('✅ Directories created\n');
}

async function generateSceneWithSeedEdit(
  baseImageUrl: string,
  scene: typeof SCENE_EDITS[0]
): Promise<string> {
  console.log(`\n✨ Scene ${scene.id}: ${scene.name}`);
  console.log(`   Prompt: ${scene.prompt.slice(0, 80)}...`);

  try {
    // Use correct SeedEdit 3.0 API format (from documentation)
    const result = await client.generateImage({
      model: 'seededit-3-0-i2i-250628',
      prompt: scene.prompt,
      image: baseImageUrl, // Single string, not array!
      response_format: 'url',
      size: 'adaptive', // Use adaptive size
      guidance_scale: 5.5, // Recommended value from docs
      watermark: false,
      seed: scene.id * 100,
    });

    if (!result.data || result.data.length === 0) {
      throw new Error('No image generated');
    }

    const imageUrl = result.data[0]!.url;
    console.log(`✅ Scene ${scene.id} generated: ${imageUrl}`);

    return imageUrl;
  } catch (error: any) {
    console.error(`❌ Failed Scene ${scene.id}:`, error.message);
    throw error;
  }
}

async function main() {
  console.log('🎮 Gamer Grandma - SeedEdit 3.0 Workflow\n');
  console.log('Using correct SeedEdit 3.0 I2I API\n');

  if (!process.env.BYTEPLUS_API_KEY || !process.env.BYTEPLUS_ENDPOINT) {
    console.error('❌ Missing BYTEPLUS_API_KEY or BYTEPLUS_ENDPOINT');
    process.exit(1);
  }

  await setupDirectories();

  const results: any[] = [];
  const startTime = Date.now();

  console.log('📸 Base Character URL:');
  console.log(`   ${BASE_CHARACTER_URL}\n`);

  // Generate all scenes using SeedEdit 3.0
  for (const scene of SCENE_EDITS) {
    try {
      const imageUrl = await generateSceneWithSeedEdit(BASE_CHARACTER_URL, scene);

      results.push({
        sceneId: scene.id,
        name: scene.name,
        imageUrl,
        success: true,
      });

      // Wait between requests
      if (scene.id < SCENE_EDITS.length) {
        console.log('   ⏳ Waiting 3 seconds...');
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    } catch (error: any) {
      results.push({
        sceneId: scene.id,
        name: scene.name,
        error: error.message,
        success: false,
      });
    }
  }

  // Save results
  const metadata = {
    title: 'Gamer Grandma - SeedEdit 3.0 I2I',
    generatedAt: new Date().toISOString(),
    baseCharacter: BASE_CHARACTER_URL,
    model: 'seededit-3-0-i2i-250628',
    totalScenes: SCENE_EDITS.length,
    successCount: results.filter(r => r.success).length,
    failedCount: results.filter(r => !r.success).length,
    results,
  };

  await fs.writeFile(
    path.join(OUTPUT_DIR, 'metadata.json'),
    JSON.stringify(metadata, null, 2)
  );

  const totalTime = ((Date.now() - startTime) / 1000 / 60).toFixed(2);

  console.log('\n' + '='.repeat(60));
  console.log('📊 GENERATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total scenes: ${SCENE_EDITS.length}`);
  console.log(`✅ Successful: ${metadata.successCount}`);
  console.log(`❌ Failed: ${metadata.failedCount}`);
  console.log(`⏱️  Total time: ${totalTime} minutes`);
  console.log(`📁 Output: ${OUTPUT_DIR}`);
  console.log('');
}

main().catch(console.error);
