# BytePlus API Best Practices Guide

**Last Updated:** 2025-10-09
**Version:** 1.0
**Target:** Developers using BytePlus ModelArk for Image & Video Generation

---

## 🎯 Overview

This guide consolidates best practices for BytePlus ModelArk APIs based on:
- Official BytePlus documentation (2025)
- Analysis of 30+ video generation attempts (see `FINAL_REPORT_JA.md`)
- Production experience with SEEDREAM4, SEEDEDIT, and SEEDANCE models

---

## 📹 Video Generation (SEEDANCE 1.0)

### ✅ Recommended Approach: Image-to-Video (I2V)

**Success Rate:** 66.7%

### ❌ Text-to-Video (T2V) Not Supported

**Verification Date:** 2025-10-09
**Test Results:** 0% success rate (6/6 tests failed)
**Error:** "Source image is required for i2v generation"

**Conclusion:** BytePlus SEEDANCE API **does not support direct Text-to-Video (T2V) generation**. All video generation requires a source image (I2V workflow only).

```typescript
// GOOD: I2V workflow
const ai = new BytePlusAI({ apiKey, endpoint, debug: true });

// Step 1: Generate high-quality image
const image = await ai.generateImage({
  model: 'seedream-4-0-250828',
  prompt: 'Single elderly woman gamer, close-up portrait, photorealistic',
  size: '2K'
}, { optimizePrompt: true });

// Step 2: Convert to video
const video = await ai.generateVideo({
  model: 'Bytedance-Seedance-1.0-pro',
  image: image.data[0].url,
  prompt: 'Smooth camera movement, cinematic lighting',
  fixed_lens: false,
  duration: 5
});
```

### 🚫 Avoid These Patterns

| Pattern | Success Rate | Why It Fails |
|---------|--------------|--------------|
| **T2V (text-to-video)** | ❌ **0%** | **API does not support T2V** |
| Multiple subjects | ❌ Low | Model struggles with complex scenes |
| `fixed_lens: true` + dynamic motion | ❌ Very Low | Contradictory parameters |
| Text rendering in video | ❌ Low | Text generation not supported |

---

## 📝 Prompt Engineering

### Seedance Prompt Formula

```
[Subject] + [Movement] + [Background/Scene] + [Camera] + [Style]
```

### Examples

**✅ GOOD Prompts:**

```typescript
// Dynamic camera (fixed_lens: false)
const prompt = `
Elderly woman gamer playing video games enthusiastically,
smooth camera pan from left to right,
cozy living room with warm lighting,
cinematic style, professional cinematography
`;

// Fixed camera (fixed_lens: true)
const prompt = `
Product showcase of luxury watch,
subtle rotation on display stand,
white studio background with soft shadows,
commercial photography style
`;
```

**❌ BAD Prompts:**

```typescript
// Too vague
const badPrompt1 = "a person";

// Contradictory
const badPrompt2 = "fast action scene"; // with fixed_lens: true

// Multiple subjects (high failure rate)
const badPrompt3 = "elderly woman and young child playing together";
```

### Camera Movement Commands

Seedance supports these natural language camera movements:

- **Surround/Orbit:** `camera orbits around subject`
- **Aerial:** `drone shot from above`
- **Zoom:** `slow zoom in on subject's face`
- **Pan:** `smooth camera pan left to right`
- **Follow:** `camera follows subject walking`
- **Handheld:** `handheld camera with slight shake`
- **Push/Pull:** `camera pushes in`, `camera pulls back`
- **Rise/Descend:** `camera rises upward`, `camera descends slowly`

### Shot Sizes (Professional Terminology)

```typescript
const prompt = `
Long shot: elderly woman gamer in full living room context,
wide shot establishing scene,
medium shot focusing on upper body and gaming setup,
close shot of hands on controller,
close-up of concentrated facial expression
`;
```

### Motion Emphasis

Use degree adverbs to control intensity:

```typescript
// Low intensity
"slowly turning head"
"gently smiling"

// Medium intensity
"actively playing games"
"smoothly moving camera"

// High intensity
"rapidly pressing buttons"
"energetically reacting to game"
```

### Multi-Shot Storytelling

For sequential scenes, use explicit transitions:

```typescript
const prompt = `
Scene 1: Elderly woman sits down at gaming desk, wide shot.
Cut to: Close-up of hands picking up controller.
Camera switching to: Medium shot of woman starting to play.
Cut to: Close-up of excited facial expression.
`;
```

---

## 🖼️ Image Generation (SEEDREAM4)

### Model Selection

| Use Case | Model | Reason |
|----------|-------|--------|
| New image creation | `seedream-4-0-250828` | Highest quality T2I |
| Image editing | `Bytedance-SeedEdit-3.0-i2i` | Specialized for I2I |
| Sequential story | `sequential_image_generation: 'auto'` | Consistent style |

### Optimal Parameters

```typescript
const bestPracticeImage = {
  model: 'seedream-4-0-250828',
  prompt: 'detailed, specific prompt here',
  size: '2K',              // Best quality/speed balance
  response_format: 'url',  // Faster than base64
  watermark: false,        // For production use
  seed: 42                 // For reproducibility
};
```

### Prompt Optimization

**Always use AI-powered prompt optimization for best results:**

```typescript
// Automatic optimization (recommended)
const result = await ai.generateImage(
  {
    model: 'seedream-4-0-250828',
    prompt: 'a cat on windowsill', // Simple input
    size: '2K'
  },
  { optimizePrompt: true } // AI expands to detailed prompt
);

// Multi-step optimization (highest quality)
const result = await ai.generateImage(
  { /* ... */ },
  { useChain: true } // 3-step prompt refinement
);
```

---

## 🔄 API Usage Patterns

### Rate Limiting

**Current Implementation:**

```typescript
// Built-in rate limiter: 10 requests/second
class RateLimiter {
  maxRequests: 10,
  windowMs: 1000
}
```

**Best Practice:**

```typescript
// For batch operations, respect concurrency limits
const batchResult = await client.batchGenerate({
  prompts: [...],
  sharedParams: { model: 'seedream-4-0-250828', size: '2K' },
  maxConcurrency: 3 // Conservative: 3 concurrent requests
});
```

### Error Handling

```typescript
import { BytePlusAPIError } from './api/byteplus-client.js';

try {
  const result = await client.generateImage({ /* ... */ });
} catch (error) {
  if (error instanceof BytePlusAPIError) {
    switch (error.statusCode) {
      case 429:
        // Rate limit: Automatic retry with exponential backoff
        // (already handled by BytePlusClient)
        console.error('Rate limit exceeded, retrying...');
        break;

      case 400:
        // Invalid parameters: Fix and retry
        console.error('Invalid request:', error.message);
        break;

      case 401:
        // Authentication error: Check API key
        console.error('Invalid API key or endpoint');
        break;

      case 500:
        // Server error: Retry after delay
        console.error('Server error:', error.message);
        break;
    }
  }
  throw error;
}
```

### Timeout Configuration

```typescript
const client = new BytePlusClient({
  apiKey: process.env.BYTEPLUS_API_KEY!,
  endpoint: process.env.BYTEPLUS_ENDPOINT!,
  timeout: 60000,      // 60s for image generation
  retryAttempts: 3,    // Retry up to 3 times
  debug: true          // Enable logging
});

// For video generation (longer timeout)
const videoClient = new BytePlusClient({
  apiKey: process.env.BYTEPLUS_API_KEY!,
  endpoint: process.env.BYTEPLUS_ENDPOINT!,
  timeout: 300000,     // 5 minutes for video
  retryAttempts: 3
});
```

---

## 🎨 Workflow Recommendations

### Production Video Generation Pipeline

```typescript
async function generateProductionVideo(concept: string) {
  const ai = new BytePlusAI({ apiKey, endpoint, debug: true });

  // Step 1: Generate concept image with AI-optimized prompt
  console.log('Step 1: Generating concept image...');
  const image = await ai.generateImage(
    {
      model: 'seedream-4-0-250828',
      prompt: concept,
      size: '2K',
      watermark: false
    },
    { optimizePrompt: true }
  );

  // Step 2: Generate video with optimized motion prompt
  console.log('Step 2: Converting to video...');
  const video = await ai.generateVideo(
    {
      model: 'Bytedance-Seedance-1.0-pro',
      image: image.data[0].url,
      prompt: 'Smooth camera movement, cinematic style',
      resolution: '1080P',
      duration: 5,
      fixed_lens: false
    },
    { optimizePrompt: true }
  );

  return {
    imageUrl: image.data[0].url,
    videoUrl: video.data[0].url,
    thumbnailUrl: video.data[0].thumbnail_url
  };
}

// Usage
const result = await generateProductionVideo(
  'Elderly woman gamer, photorealistic portrait'
);
```

### Story Generation (Sequential Images)

```typescript
async function generateStorySequence(storyline: string, scenes: number) {
  const ai = new BytePlusAI({ apiKey, endpoint, debug: true });

  // Automatic scene breakdown and prompt optimization
  const images = await ai.generateStory(
    storyline,
    scenes,
    {
      model: 'seedream-4-0-250828',
      size: '2K',
      watermark: false
    }
  );

  // Convert each image to video
  const videos = await Promise.all(
    images.map(async (img, i) => {
      const video = await ai.generateVideo({
        model: 'Bytedance-Seedance-1.0-pro',
        image: img.data[0].url,
        prompt: `Scene ${i + 1}: smooth cinematic movement`,
        duration: 5,
        fixed_lens: false
      });
      return video;
    })
  );

  return { images, videos };
}

// Usage
const story = await generateStorySequence(
  "A hero's journey from village to castle",
  3
);
```

---

## 🔐 Security Best Practices

### Environment Variables

```bash
# .env file (NEVER commit to git)
BYTEPLUS_API_KEY=your_api_key_here
BYTEPLUS_ENDPOINT=https://ark.ap-southeast.bytepluses.com/api/v3
ANTHROPIC_API_KEY=your_claude_key_here  # For prompt optimization
```

### .gitignore

```gitignore
# BytePlus credentials
.env
.env.local
.env.*.local

# Generated content
gamer-grandma-output/
*.mp4
*.png
*.jpg
```

### API Key Validation

```typescript
import { config } from 'dotenv';

config();

function validateConfig() {
  if (!process.env.BYTEPLUS_API_KEY) {
    throw new Error('BYTEPLUS_API_KEY is required');
  }

  if (!process.env.BYTEPLUS_ENDPOINT) {
    throw new Error('BYTEPLUS_ENDPOINT is required');
  }

  console.log('✅ Configuration validated');
}

validateConfig();
```

---

## 📊 Performance Optimization

### Batch Operations

```typescript
// GOOD: Batch generation with controlled concurrency
const prompts = [
  'Scene 1: Elderly woman enters room',
  'Scene 2: Woman sits at gaming desk',
  'Scene 3: Woman starts playing game'
];

const results = await client.batchGenerate({
  prompts,
  sharedParams: {
    model: 'seedream-4-0-250828',
    size: '2K',
    watermark: false
  },
  maxConcurrency: 3  // Don't overwhelm API
});

console.log(`Success rate: ${results.successRate * 100}%`);
console.log(`Total time: ${results.totalTime}ms`);
```

### Caching Strategies

```typescript
// Cache generated images for video conversion
const imageCache = new Map<string, string>();

async function generateOrCache(prompt: string) {
  if (imageCache.has(prompt)) {
    console.log('Using cached image');
    return imageCache.get(prompt)!;
  }

  const result = await ai.generateImage({
    model: 'seedream-4-0-250828',
    prompt,
    size: '2K'
  });

  const url = result.data[0].url;
  imageCache.set(prompt, url);
  return url;
}
```

---

## 🧪 Testing & Validation

### Health Checks

```typescript
async function checkAPIHealth() {
  const ai = new BytePlusAI({ apiKey, endpoint });

  const health = await ai.checkHealth();

  console.log('Image API:', health.image ? '✅' : '❌');
  console.log('Text API:', health.text ? '✅' : '❌');
  console.log('Overall:', health.overall ? '✅' : '❌');

  return health.overall;
}

// Run before production deployment
await checkAPIHealth();
```

### Quality Validation

```typescript
// Validate generated content meets quality standards
async function validateVideoQuality(videoUrl: string): Promise<boolean> {
  // Add custom quality checks:
  // - Duration matches request
  // - Resolution is correct
  // - File is accessible
  // - Thumbnail exists

  return true; // Implement your validation logic
}
```

---

## 📚 Reference Data

### Tested Model Performance

| Model | Success Rate | Avg. Time | Best Use Case |
|-------|--------------|-----------|---------------|
| SEEDREAM4 (t2i) | 95% | 8s | New image creation |
| SEEDEDIT (i2i) | 90% | 10s | Image editing |
| SEEDANCE I2V | 66.7% | 45s | Video from image |
| SEEDANCE T2V | **0% (NOT SUPPORTED)** | N/A | **Use I2V instead** |

**T2V Verification (2025-10-09):**
- 6 test cases across different scenarios
- 0/6 successful (100% failure rate)
- All tests failed with: "Source image is required for i2v generation"
- **Conclusion:** BytePlus SEEDANCE requires source image for ALL video generation

### Common Failure Scenarios

1. **Text-to-Video (T2V) attempts:** 100% failure rate (API limitation)
2. **Multiple subjects in video:** 80% failure rate
3. **fixed_lens + dynamic motion:** 90% failure rate
4. **Complex text rendering:** 100% failure rate
5. **Inconsistent camera commands:** 70% failure rate

### Successful Prompt Patterns

```typescript
const successfulPrompts = [
  // Single subject + dynamic camera
  "Elderly woman gamer playing enthusiastically, smooth camera pan left to right, cinematic style",

  // Product showcase + fixed camera
  "Luxury watch rotating on stand, white background, commercial photography",

  // Action + follow camera
  "Runner jogging through park, camera follows from side, morning sunlight"
];
```

---

## 🔗 Additional Resources

- **BytePlus ModelArk Documentation:** https://docs.byteplus.com/en/docs/ModelArk
- **Seedance Prompt Guide:** https://docs.byteplus.com/en/docs/ModelArk/1631633
- **Project Analysis Report:** `FINAL_REPORT_JA.md`
- **Example Implementation:** `generate-gamer-grandma-auto.ts`

---

## 📝 Changelog

### Version 1.0 (2025-10-09)
- Initial release
- Based on 30+ production tests
- Includes I2V vs T2V analysis
- Camera control best practices
- Prompt engineering guidelines

---

**Questions or Issues?**
Refer to `CLAUDE.md` for project context and development guidelines.
