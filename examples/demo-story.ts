/**
 * Byteflow - Story Generation Demo
 *
 * Demonstrates sequential image generation for storytelling.
 */

import 'dotenv/config';
import { BytePlusAI } from '../src/api/byteplus-ai.js';

async function main() {
  console.log('📖 Byteflow - Story Generation Demo\n');

  const ai = new BytePlusAI({
    apiKey: process.env.BYTEPLUS_API_KEY!,
    endpoint: process.env.BYTEPLUS_ENDPOINT!,
    debug: true,
  });

  // Generate a 3-scene story
  console.log('Creating story: "A hero\\'s journey"\n');

  try {
    const story = await ai.generateStory(
      'A hero leaves their village, travels through a dark forest, and arrives at a majestic castle',
      3,
      {
        model: 'seedream-4-0-250828',
        size: '2K',
        watermark: false,
      }
    );

    console.log('✅ Story generated!');
    story.forEach((scene, i) => {
      console.log(`Scene ${i + 1}: ${scene.data[0]?.url}`);
    });
  } catch (error) {
    console.error('❌ Story generation failed:', error);
  }

  console.log('\n🎉 Demo completed!');
}

main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
