/**
 * Promotional Video Generation
 *
 * Concept: Noir-style bar/restaurant promotion
 * Duration: 15 seconds (4 scenes)
 *
 * 0:00 - Night city with neon lights and rain (AI generated)
 * 0:05 - Woman silhouette (AI generated)
 * 0:10 - Tagline: "誰かの日常に、少しの非日常を。"
 * 0:15 - Interior atmosphere + logo + QR code
 *
 * Run: npx tsx create-promo-video.ts
 */

import { BytePlusAI } from './src/api/byteplus-ai.js';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

config();

interface Scene {
  id: number;
  name: string;
  timing: string;
  purpose: string;
  imagePrompt: string;
  cameraPrompt: string;
  overlay?: string;
}

const scenes: Scene[] = [
  {
    id: 1,
    name: 'Night City - Neon & Rain',
    timing: '0:00-0:05',
    purpose: 'Hook - atmospheric opening',
    imagePrompt: `A cinematic night cityscape in Tokyo, wet streets reflecting vibrant neon lights,
    heavy rain falling, glowing red and blue neon signs, empty street with puddles,
    atmospheric fog, moody lighting, cyberpunk aesthetic, photorealistic, 8K,
    cinematic color grading, film noir style`,
    cameraPrompt: 'Slow forward dolly movement, cinematic establishing shot, smooth glide through rain, dramatic lighting'
  },
  {
    id: 2,
    name: 'Woman Silhouette',
    timing: '0:05-0:10',
    purpose: 'Mystery - introduce human element',
    imagePrompt: `Elegant woman silhouette in noir style, standing against neon-lit rainy window,
    backlit silhouette, mysterious atmosphere, holding cocktail glass, elegant pose,
    long coat or dress, atmospheric fog, bokeh lights in background, cinematic lighting,
    film noir aesthetic, photorealistic, 8K detail`,
    cameraPrompt: 'Slow zoom in to silhouette, dramatic reveal, smooth cinematic movement, moody lighting'
  },
  {
    id: 3,
    name: 'Tagline Scene',
    timing: '0:10-0:15',
    purpose: 'Message - brand tagline',
    imagePrompt: `Elegant bar interior with soft ambient lighting, warm golden lights,
    sophisticated atmosphere, blurred bokeh in background, dark wood counter,
    crystal glassware, moody cinematic aesthetic, cozy luxury, photorealistic, 8K`,
    cameraPrompt: 'Gentle horizontal pan across bar, slow elegant movement, soft focus transitions',
    overlay: '誰かの日常に、少しの非日常を。'
  },
  {
    id: 4,
    name: 'Interior & Branding',
    timing: '0:15-0:20',
    purpose: 'Call-to-action - showcase venue',
    imagePrompt: `Upscale bar interior, warm ambient lighting, elegant seating area,
    sophisticated modern design, wooden bar counter with bottles backlit,
    cozy leather seating, atmospheric mood lighting, professional photography,
    luxury hospitality aesthetic, photorealistic, 8K detail`,
    cameraPrompt: 'Slow reveal with gentle zoom out, showcase space, elegant framing, professional presentation',
    overlay: 'Logo + QR Code'
  }
];

async function generatePromoVideo() {
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║     Promotional Video Generation - Noir Bar Concept      ║');
  console.log('╚═══════════════════════════════════════════════════════════╝');
  console.log();

  const outputDir = './promo-video-output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  const ai = new BytePlusAI({
    apiKey: process.env.BYTEPLUS_API_KEY!,
    endpoint: process.env.BYTEPLUS_ENDPOINT!,
    debug: false
  });

  const results = [];

  for (const scene of scenes) {
    console.log('═'.repeat(70));
    console.log(`🎬 Scene ${scene.id}: ${scene.name}`);
    console.log(`   Timing: ${scene.timing}`);
    console.log(`   Purpose: ${scene.purpose}`);
    console.log();

    try {
      // Step 1: Generate image
      console.log('   📸 Generating image...');
      const imageStartTime = Date.now();

      const image = await ai.generateImage({
        model: 'seedream-4-0-250828',
        prompt: scene.imagePrompt,
        size: '2K',
        watermark: false
      });

      const imageTime = ((Date.now() - imageStartTime) / 1000).toFixed(1);
      console.log(`   ✅ Image generated in ${imageTime}s`);
      console.log(`   📷 ${image.data[0].url}`);
      console.log();

      // Step 2: Generate video from image
      console.log('   🎥 Generating video (40-50s)...');
      const videoStartTime = Date.now();

      const video = await ai.generateVideo({
        model: 'seedance-1-0-pro-250528',
        image: image.data[0].url,
        prompt: scene.cameraPrompt,
        resolution: '1080p',
        duration: 5,
        camerafixed: false
      });

      const videoTime = ((Date.now() - videoStartTime) / 1000).toFixed(1);
      console.log(`   ✅ Video generated in ${videoTime}s`);
      console.log(`   🎞️  ${video.data[0].url}`);
      console.log();

      results.push({
        sceneId: scene.id,
        name: scene.name,
        timing: scene.timing,
        purpose: scene.purpose,
        overlay: scene.overlay,
        imageUrl: image.data[0].url,
        videoUrl: video.data[0].url,
        imageSeed: image.seed,
        videoSeed: video.seed,
        imageTime,
        videoTime
      });

    } catch (error) {
      console.error(`   ❌ Failed: ${error instanceof Error ? error.message : error}`);
      console.log();

      results.push({
        sceneId: scene.id,
        name: scene.name,
        timing: scene.timing,
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  // Save results
  const output = {
    title: 'Noir Bar Promotional Video',
    concept: '夜の街×ネオン×雨 - 非日常を届けるバー',
    generatedAt: new Date().toISOString(),
    totalDuration: '20 seconds',
    format: '9:16 vertical (TikTok/Instagram Reels)',
    scenes: results,
    postProduction: {
      editing: [
        'Trim each video to exact timing (5s each)',
        'Add text overlays for Scene 3 (tagline)',
        'Add logo + QR code overlay for Scene 4',
        'Apply color grading (cinematic noir style)',
        'Add ambient music (noir jazz or electronic)',
        'Export as 1080x1920, 30fps, MP4'
      ],
      textOverlays: [
        {
          scene: 3,
          text: '誰かの日常に、少しの非日常を。',
          font: 'Elegant serif or modern sans-serif',
          position: 'Center',
          animation: 'Fade in + fade out'
        },
        {
          scene: 4,
          elements: ['Logo (top or center)', 'QR code (bottom right)', 'Social media handles'],
          style: 'Minimal, elegant'
        }
      ],
      music: 'Atmospheric noir jazz or downtempo electronic (20s loop)'
    }
  };

  const outputPath = `${outputDir}/promo-video-assets.json`;
  writeFileSync(outputPath, JSON.stringify(output, null, 2));

  console.log('═'.repeat(70));
  console.log('📊 GENERATION SUMMARY');
  console.log('═'.repeat(70));
  console.log();

  const successful = results.filter(r => r.videoUrl);
  const failed = results.filter(r => r.error);

  console.log(`   Total scenes: ${scenes.length}`);
  console.log(`   ✅ Success: ${successful.length}`);
  console.log(`   ❌ Failed: ${failed.length}`);
  console.log(`   Success rate: ${((successful.length / scenes.length) * 100).toFixed(1)}%`);
  console.log();
  console.log(`   📝 Assets saved: ${outputPath}`);
  console.log();

  if (successful.length > 0) {
    console.log('📹 VIDEO URLS (valid for 24 hours):');
    console.log();
    successful.forEach(scene => {
      console.log(`Scene ${scene.sceneId}: ${scene.name} (${scene.timing})`);
      console.log(`   ${scene.videoUrl}`);
      console.log();
    });
  }

  console.log('═'.repeat(70));
  console.log('🎬 POST-PRODUCTION CHECKLIST');
  console.log('═'.repeat(70));
  console.log();
  console.log('1. Download all video clips (URLs expire in 24h)');
  console.log('2. Import into video editor (Adobe Premiere, Final Cut, DaVinci)');
  console.log('3. Trim clips to exact timing:');
  console.log('   - Scene 1: 0:00-0:05 (5s)');
  console.log('   - Scene 2: 0:05-0:10 (5s)');
  console.log('   - Scene 3: 0:10-0:15 (5s)');
  console.log('   - Scene 4: 0:15-0:20 (5s)');
  console.log('4. Add text overlay on Scene 3:');
  console.log('   "誰かの日常に、少しの非日常を。"');
  console.log('5. Add logo + QR code on Scene 4');
  console.log('6. Apply cinematic color grading (film noir LUT)');
  console.log('7. Add background music (noir jazz or downtempo)');
  console.log('8. Export: 1080x1920 (9:16), 30fps, H.264, MP4');
  console.log('9. Upload to TikTok/Instagram Reels');
  console.log();
  console.log('💡 Music recommendations:');
  console.log('   - Epidemic Sound: "Noir Jazz" category');
  console.log('   - Artlist: "Cinematic Ambient" category');
  console.log('   - Free: YouTube Audio Library (Jazz/Ambient)');
  console.log();
}

generatePromoVideo().catch(console.error);
