# ByteDance Agent

**Type**: Specialized API Integration Agent
**Purpose**: Autonomous BytePlus/ByteDance API operations for image, video, and text generation
**Model**: Claude Sonnet 4
**Status**: Active

---

## Overview

The ByteDance Agent is responsible for all BytePlus API operations including:
- Image generation (SEEDREAM4, SEEDEDIT)
- Video generation (SEEDANCE task-based API)
- Text generation and prompt optimization (DeepSeek-R1, Skylark)
- Asset management and workflow orchestration

---

## Capabilities

### 1. Image Generation (T2I)
- **Model**: `seedream-4-0-250828`
- **Features**: Text-to-Image, high quality, 2K/4K resolution
- **Use Cases**: Scene generation, character creation, background assets

### 2. Image Editing (I2I)
- **Model**: `seededit-3-0-i2i-250628`
- **Features**: Image-to-Image editing, style transfer
- **Use Cases**: Color correction, style changes, detail enhancement

### 3. Video Generation (I2V)
- **Model**: `seedance-1-0-pro-250528` (Task-based)
- **Features**: Image-to-Video, dynamic camera, 5s videos, 1080p
- **Workflow**: Async task creation → polling → result retrieval
- **Camera Controls**: Fixed/dynamic lens, cinematic movements

### 4. Prompt Optimization (T2T)
- **Models**:
  - `DeepSeek-R1-250528` (complex reasoning)
  - `Skylark-pro-250415` (fast, BytePlus-optimized)
- **Features**: Prompt enhancement, chain-of-thought optimization
- **Use Cases**: Improve prompt quality, generate variations

### 5. Sequential Generation
- **Feature**: `sequential_image_generation: auto`
- **Use Cases**: Story generation, consistent multi-scene content
- **Max Images**: 3-10 per request

---

## Agent Responsibilities

### Input Processing
1. Parse user requests for content generation
2. Determine optimal model and workflow (T2I, I2I, I2V)
3. Validate parameters and API credentials
4. Generate/optimize prompts if needed

### Generation Workflow
1. **Single Asset**: Direct API call with error handling
2. **Batch Assets**: Parallel generation with rate limiting
3. **Sequential Story**: Multi-scene generation with consistency
4. **I2V Workflow**: Image first, then video generation

### Quality Assurance
1. Validate generated assets (URLs, metadata)
2. Check quality scores (if applicable)
3. Retry on failures (max 3 attempts)
4. Log all operations for debugging

### Asset Management
1. Track generated URLs (24h expiry)
2. Save metadata (seeds, prompts, generation time)
3. Organize outputs in structured folders
4. Generate summary reports (JSON/Markdown)

---

## API Integration

### Client Libraries
```typescript
import { BytePlusAI } from './src/api/byteplus-ai.js';
import { BytePlusClient } from './src/api/byteplus-client.js';
import { PromptOptimizer } from './src/services/prompt-optimizer.js';
import { PromptChain } from './src/services/prompt-chain.js';
```

### Authentication
- **API Key**: `process.env.BYTEPLUS_API_KEY`
- **Endpoint**: `process.env.BYTEPLUS_ENDPOINT`
- **Region**: Asia Pacific (Singapore)

### Rate Limits
- **Images**: 10 requests/second
- **Videos**: Task-based, no strict limit
- **Text**: 60 requests/minute

---

## Usage Examples

### Example 1: Generate Scene Image
```typescript
const ai = new BytePlusAI({
  apiKey: process.env.BYTEPLUS_API_KEY!,
  endpoint: process.env.BYTEPLUS_ENDPOINT!
});

const image = await ai.generateImage({
  model: 'seedream-4-0-250828',
  prompt: 'A cozy Japanese living room with elderly woman knitting',
  size: '2K',
  watermark: false
});

console.log(`Image URL: ${image.data[0].url}`);
```

### Example 2: Generate Video from Image
```typescript
const video = await ai.generateVideo({
  model: 'seedance-1-0-pro-250528',
  image: 'https://example.com/scene.jpg',
  prompt: 'Slow gentle zoom in, cinematic movement',
  resolution: '1080p',
  duration: 5,
  camerafixed: false
});

console.log(`Video URL: ${video.data[0].url}`);
```

### Example 3: Batch Generation with Prompt Optimization
```typescript
const scenes = [
  { prompt: 'peaceful grandmother knitting', purpose: 'hook' },
  { prompt: 'grandmother wearing gaming headset', purpose: 'transformation' },
  { prompt: 'intense gaming expression', purpose: 'climax' }
];

for (const scene of scenes) {
  // Optimize prompt
  const optimizedPrompt = await ai.optimizer.optimizeForImage(
    scene.prompt,
    'photorealistic'
  );

  // Generate image
  const image = await ai.generateImage({
    model: 'seedream-4-0-250828',
    prompt: optimizedPrompt,
    size: '2K'
  });

  // Generate video
  const cameraPrompt = scene.purpose === 'hook'
    ? 'Slow zoom in, establishing shot'
    : scene.purpose === 'transformation'
    ? 'Dynamic zoom in to face, dramatic'
    : 'Subtle camera shake, intense close-up';

  const video = await ai.generateVideo({
    model: 'seedance-1-0-pro-250528',
    image: image.data[0].url,
    prompt: cameraPrompt,
    resolution: '1080p',
    duration: 5,
    camerafixed: false
  });

  console.log(`Scene: ${scene.purpose}`);
  console.log(`Image: ${image.data[0].url}`);
  console.log(`Video: ${video.data[0].url}`);
}
```

### Example 4: Story Generation with Sequential Images
```typescript
const story = await ai.generateStory(
  'A grandmother\'s journey: peaceful → gaming → victory → return to peace',
  4, // 4 scenes
  {
    model: 'seedream-4-0-250828',
    size: '2K',
    watermark: false
  }
);

story.forEach((scene, i) => {
  console.log(`Scene ${i + 1}: ${scene.data[0].url}`);
});
```

---

## Error Handling

### Common Errors

1. **API Key Invalid**
   - Check `BYTEPLUS_API_KEY` environment variable
   - Verify endpoint URL

2. **Rate Limit Exceeded**
   - Agent automatically retries with exponential backoff
   - Max 3 retries per request

3. **Image URL Expired**
   - BytePlus URLs valid for 24 hours
   - Download immediately after generation

4. **Video Task Timeout**
   - Default: 5 minutes
   - Can configure up to 10 minutes
   - Typical generation: 40-50 seconds

5. **T2V Not Supported**
   - Text-to-Video NOT available
   - Always use I2V workflow: generate image first, then video

### Retry Strategy
```typescript
try {
  const result = await ai.generateVideo({...});
} catch (error) {
  if (error instanceof BytePlusAPIError) {
    if (error.statusCode === 429) {
      // Rate limit - automatic retry with backoff
      await sleep(2000);
      return retry();
    } else if (error.statusCode === 500) {
      // Server error - retry once
      return retry();
    }
  }
  throw error;
}
```

---

## Best Practices

### Prompt Engineering

#### Image Prompts (T2I)
- **Good**: "A cozy Japanese living room, soft afternoon sunlight, elderly woman (70s) with gentle smile, wearing cardigan, sitting on zabuton cushion, knitting colorful scarf, photorealistic, 8K detail"
- **Bad**: "grandma knitting"

#### Video Prompts (I2V)
- **Good**: "Slow gentle zoom in, establishing shot, smooth cinematic movement, professional lighting"
- **Bad**: "move camera"

#### Camera Movement Commands
- `Slow gentle zoom in` - Opening scenes
- `Dynamic zoom in to face` - Transformation
- `Subtle camera shake` - Intense action
- `Dramatic upward movement` - Victory moments
- `Dynamic side-to-side` - Comedy scenes
- `Slow zoom out` - Resolution/ending

### Workflow Optimization

1. **Use Prompt Optimization**
   ```typescript
   await ai.generateImage({...}, { optimizePrompt: true });
   ```

2. **Batch with Rate Limiting**
   ```typescript
   const limiter = new RateLimiter(10); // 10 req/s
   await limiter.schedule(() => ai.generateImage({...}));
   ```

3. **Save Metadata**
   ```typescript
   const result = {
     imageUrl: image.data[0].url,
     seed: image.seed,
     prompt: optimizedPrompt,
     generationTime: metadata.generationTime
   };
   fs.writeFileSync('output.json', JSON.stringify(result, null, 2));
   ```

4. **I2V Workflow**
   ```typescript
   // Step 1: Generate image
   const image = await ai.generateImage({...});

   // Step 2: Generate video from image
   const video = await ai.generateVideo({
     image: image.data[0].url,
     ...
   });
   ```

---

## Output Structure

### Standard Output Format
```json
{
  "title": "Project Name",
  "generatedAt": "2025-10-09T15:00:00+09:00",
  "workflow": "T2I + I2V",
  "assets": [
    {
      "sceneId": 1,
      "name": "Scene Name",
      "imageUrl": "https://...",
      "videoUrl": "https://...",
      "prompt": "Full prompt used",
      "seed": 12345,
      "generationTime": "48.5s",
      "metadata": {
        "resolution": "1080p",
        "duration": 5,
        "fps": 24
      }
    }
  ],
  "apiStatus": {
    "t2i": {
      "model": "seedream-4-0-250828",
      "status": "✅ Working",
      "imagesGenerated": 7,
      "successRate": "100%"
    },
    "i2v": {
      "model": "seedance-1-0-pro-250528",
      "status": "✅ Working",
      "videosGenerated": 7,
      "successRate": "100%"
    }
  }
}
```

---

## Integration with Other Agents

### CoordinatorAgent
- **Task Breakdown**: CoordinatorAgent creates DAG of generation tasks
- **Parallel Execution**: ByteDance Agent executes multiple generations concurrently
- **Progress Tracking**: Reports completion status back to Coordinator

### ReviewAgent
- **Quality Check**: ReviewAgent validates generated assets
- **Retry Logic**: Low-quality assets trigger regeneration
- **Metadata Validation**: Ensures all required fields present

### DeploymentAgent
- **Asset Upload**: After generation, DeploymentAgent uploads to CDN
- **URL Management**: Converts 24h URLs to permanent storage
- **Webhook Integration**: Notifies downstream systems

---

## Testing

### Unit Tests
```bash
npm test src/api/byteplus-client.test.ts
npm test src/api/byteplus-ai.test.ts
```

### Integration Tests
```bash
npx tsx test-new-video-api.ts
npx tsx demo-t2v-not-supported.ts
npx tsx retry-gamer-grandma-videos.ts
```

### Validation Scripts
```bash
./test-task-creation-curl.sh  # Direct API test
```

---

## Monitoring & Metrics

### Key Metrics
- **Generation Time**: Average 40-50s for I2V
- **Success Rate**: Target 95%+
- **API Latency**: <100ms for task creation
- **Cost per Asset**: Track token usage

### Logging
```typescript
console.log('[ByteDanceAgent] Task created:', taskId);
console.log('[ByteDanceAgent] Polling status:', status);
console.log('[ByteDanceAgent] Generation complete:', videoUrl);
```

---

## Troubleshooting

### Issue: "No video URL in succeeded response"
**Cause**: Response parsing error
**Fix**: Use `status.content.video_url` not `status.data[0].url`

### Issue: "Task timeout after 300000ms"
**Cause**: Video generation taking too long
**Fix**: Increase `maxPollingTime` to 600000ms (10 min)

### Issue: "T2V not working"
**Cause**: Text-to-Video NOT supported
**Fix**: Use I2V workflow (generate image first)

### Issue: "Rate limit exceeded"
**Cause**: Too many requests
**Fix**: Implement rate limiting with `RateLimiter`

---

## Dependencies

```json
{
  "dependencies": {
    "dotenv": "^16.0.0",
    "node-fetch": "^3.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "tsx": "^4.0.0",
    "typescript": "^5.0.0"
  }
}
```

---

## Environment Variables

```bash
# Required
BYTEPLUS_API_KEY=bp_xxxxx
BYTEPLUS_ENDPOINT=https://ark.ap-southeast.bytepluses.com/api/v3

# Optional
DEBUG=true
MAX_CONCURRENT_REQUESTS=10
POLLING_INTERVAL=1000
MAX_POLLING_TIME=300000
```

---

## Documentation References

- **Implementation Guide**: `NEW_VIDEO_API_IMPLEMENTATION.md`
- **Best Practices**: `BYTEPLUS_BEST_PRACTICES.md`
- **Test Results**: `TEST_RESULTS_SUMMARY.md`
- **API Types**: `src/types/byteplus.ts`

---

## Future Enhancements

1. **Audio Generation**: Integrate TTS API (OpenAI/ElevenLabs)
2. **Webhook Support**: Real-time notifications for task completion
3. **CDN Integration**: Auto-upload to permanent storage
4. **Cost Optimization**: Batch requests, cache results
5. **Quality Scoring**: ML-based asset quality evaluation

---

**Last Updated**: 2025-10-09
**Version**: 1.0
**Maintained By**: Miyabi Framework Team
