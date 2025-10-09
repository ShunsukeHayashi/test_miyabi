# ByteDance Agent Architecture

**Version**: 1.0
**Date**: 2025-10-09

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Miyabi Framework                          │
│                     (GitHub OS Integration)                      │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │  CoordinatorAgent     │
         │  (Task Orchestration) │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │  ByteDanceAgent       │◄─────── bytedance-cli.ts (CLI)
         │  (Content Generation) │
         └───────────┬───────────┘
                     │
         ┌───────────┴───────────┬──────────────┬──────────────┐
         ▼                       ▼              ▼              ▼
    ┌─────────┐          ┌─────────────┐  ┌─────────┐  ┌──────────┐
    │ BytePlus│          │   Prompt    │  │ Prompt  │  │  Asset   │
    │   AI    │          │  Optimizer  │  │  Chain  │  │ Manager  │
    │(Wrapper)│          │   (T2T)     │  │  (T2T)  │  │ (Storage)│
    └────┬────┘          └──────┬──────┘  └────┬────┘  └────┬─────┘
         │                      │              │            │
         ▼                      ▼              ▼            ▼
    ┌─────────────────────────────────────────────────────────┐
    │           BytePlusClient (Low-level API)                │
    └────────────┬──────────────┬──────────────┬──────────────┘
                 │              │              │
                 ▼              ▼              ▼
         ┌──────────┐   ┌──────────┐  ┌──────────────┐
         │SEEDREAM4 │   │ SEEDANCE │  │ DeepSeek-R1  │
         │  (T2I)   │   │  (I2V)   │  │   (T2T)      │
         └──────────┘   └──────────┘  └──────────────┘
                 │              │              │
                 └──────────────┴──────────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │   BytePlus API        │
                    │ (Asia Pacific)        │
                    └───────────────────────┘
```

---

## Component Responsibilities

### 1. ByteDanceAgent (Core)
**File**: `src/agents/bytedance-agent.ts`

**Responsibilities**:
- Autonomous task execution
- Task type routing (image/video/story/batch)
- Error handling and retries
- Asset management
- Result persistence

**Public Interface**:
```typescript
async execute(task: AgentTask): Promise<AgentResult>
```

**Task Types**:
- `image`: Single T2I generation
- `video`: Single I2V generation
- `story`: Multi-scene sequential generation
- `batch`: Concurrent batch processing

### 2. CLI Interface
**File**: `bytedance-cli.ts`

**Responsibilities**:
- Parse command-line arguments
- Validate environment variables
- Format output for terminal
- Map commands to agent tasks

**Commands**:
```bash
image <prompt> [--size 2K] [--optimize]
video <imageUrl> <prompt> [--resolution 1080p]
story <prompt> [--scenes 4] [--videos]
batch <config.json>
```

### 3. BytePlusAI (High-level)
**File**: `src/api/byteplus-ai.ts`

**Responsibilities**:
- Unified API interface
- Model routing (T2I, I2I, I2V)
- Prompt optimization integration
- Response normalization

**Key Methods**:
```typescript
generateImage(request, options?)
generateVideo(request, options?)
generateStory(prompt, numScenes, options?)
```

### 4. BytePlusClient (Low-level)
**File**: `src/api/byteplus-client.ts`

**Responsibilities**:
- Direct API communication
- Task creation and polling
- Rate limiting
- Error handling and retries

**Key Methods**:
```typescript
generateImage(request)
createVideoTask(request)
getTaskStatus(taskId)
generateVideoWithPolling(request, options?)
```

### 5. PromptOptimizer
**File**: `src/services/prompt-optimizer.ts`

**Responsibilities**:
- Single-step prompt enhancement
- Model selection (DeepSeek vs Skylark)
- Context-aware optimization

**Key Methods**:
```typescript
optimizeForImage(prompt, style?)
optimizeForImageEdit(prompt)
optimizeForVideo(prompt)
```

### 6. PromptChain
**File**: `src/services/prompt-chain.ts`

**Responsibilities**:
- Multi-step prompt refinement
- Chain-of-thought optimization
- Quality maximization

**Key Methods**:
```typescript
execute(prompt, steps?)
chainForImageGeneration(prompt)
chainForVideoGeneration(prompt)
```

---

## Data Flow

### Image Generation Flow

```
User Input
    │
    ▼
┌─────────────────┐
│ bytedance-cli   │
│ image "prompt"  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ ByteDanceAgent  │
│ .execute()      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ PromptOptimizer │ (optional)
│ .optimizeFor    │
│ Image()         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ BytePlusAI      │
│ .generateImage()│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ BytePlusClient  │
│ .generateImage()│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ BytePlus API    │
│ POST /images    │
│ /generations    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Response        │
│ {url, seed}     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Save to         │
│ agent-output/   │
│ task-*.json     │
└─────────────────┘
```

### Video Generation Flow (I2V)

```
User Input
    │
    ▼
┌──────────────────────┐
│ bytedance-cli        │
│ video <img> "prompt" │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ ByteDanceAgent       │
│ .execute()           │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ BytePlusAI           │
│ .generateVideo()     │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ BytePlusClient       │
│ .generateVideo       │
│ WithPolling()        │
└──────────┬───────────┘
           │
           ├─────────────────────┐
           ▼                     │
┌──────────────────────┐         │
│ BytePlus API         │         │
│ POST /contents/      │         │
│ generations/tasks    │         │
└──────────┬───────────┘         │
           │                     │
           ▼                     │
     Task ID: cgt-xxx            │
           │                     │
           │◄────────────────────┘
           │  Poll every 1s
           │
     ┌─────┴─────┐
     │           │
     ▼           ▼
running      succeeded
     │           │
     └───────────┘
           │
           ▼
┌──────────────────────┐
│ Response             │
│ {video_url, seed,    │
│  metadata}           │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Save to              │
│ agent-output/        │
│ task-*.json          │
└──────────────────────┘
```

### Story Generation Flow

```
User Input: "hero's journey"
           │
           ▼
┌─────────────────────────┐
│ ByteDanceAgent          │
│ .executeStoryGeneration()│
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│ BytePlusAI              │
│ .generateStory(n=4)     │
└────────────┬────────────┘
             │
     ┌───────┴───────┐
     │               │
     ▼               ▼
Sequential      Prompt
Generation      Split
     │               │
     └───────┬───────┘
             │
             ▼
   ┌─────────────────────┐
   │ Scene 1 (Image)     │
   ├─────────────────────┤
   │ Scene 2 (Image)     │
   ├─────────────────────┤
   │ Scene 3 (Image)     │
   ├─────────────────────┤
   │ Scene 4 (Image)     │
   └─────────┬───────────┘
             │
             ▼ (if --videos)
   ┌─────────────────────┐
   │ Scene 1 (Video)     │◄─── Camera prompt
   ├─────────────────────┤     (auto-generated)
   │ Scene 2 (Video)     │
   ├─────────────────────┤
   │ Scene 3 (Video)     │
   ├─────────────────────┤
   │ Scene 4 (Video)     │
   └─────────┬───────────┘
             │
             ▼
   ┌─────────────────────┐
   │ Result              │
   │ - 4 images          │
   │ - 4 videos          │
   │ - Metadata          │
   └─────────────────────┘
```

---

## Error Handling Strategy

```
Request
   │
   ▼
┌──────────────┐
│ Validate     │
│ Parameters   │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ API Call     │
└──────┬───────┘
       │
       ├────► Error?
       │         │
       │         ▼
       │    ┌──────────────┐
       │    │ Rate Limit?  │
       │    │ (429)        │
       │    └──────┬───────┘
       │           │
       │           ▼
       │    Exponential
       │    Backoff
       │           │
       │           └──► Retry (max 3)
       │
       ├────► Network?
       │         │
       │         ▼
       │    Retry with
       │    exponential
       │    backoff
       │
       ▼
┌──────────────┐
│ Success      │
│ Return       │
└──────────────┘
```

### Retry Logic

```typescript
const MAX_RETRIES = 3;
const BASE_DELAY = 1000; // 1s

for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
  try {
    return await makeRequest();
  } catch (error) {
    if (attempt === MAX_RETRIES) throw error;

    if (error.statusCode === 429) {
      // Rate limit: exponential backoff
      await sleep(BASE_DELAY * Math.pow(2, attempt - 1));
    } else if (isNetworkError(error)) {
      // Network error: retry
      await sleep(BASE_DELAY);
    } else {
      // Other error: fail immediately
      throw error;
    }
  }
}
```

---

## State Management

### Agent State

```typescript
interface AgentState {
  currentTask: AgentTask | null;
  taskQueue: AgentTask[];
  results: Map<string, AgentResult>;
  metrics: {
    totalTasks: number;
    successCount: number;
    failCount: number;
  };
}
```

### Task Lifecycle

```
┌──────────┐
│ Created  │
└────┬─────┘
     │
     ▼
┌──────────┐
│ Queued   │
└────┬─────┘
     │
     ▼
┌──────────┐
│ Running  │
└────┬─────┘
     │
     ├──────────┬──────────┐
     ▼          ▼          ▼
┌──────────┐ ┌─────┐ ┌────────┐
│ Success  │ │Fail │ │Partial │
└──────────┘ └─────┘ └────────┘
     │          │          │
     └──────────┴──────────┘
                │
                ▼
       ┌──────────────┐
       │ Saved to     │
       │ Output       │
       └──────────────┘
```

---

## Integration Patterns

### Pattern 1: Direct CLI Usage
```bash
# User directly invokes CLI
npx tsx bytedance-cli.ts image "prompt"
```

### Pattern 2: Programmatic Integration
```typescript
// Another agent calls ByteDanceAgent
import { ByteDanceAgent } from './src/agents/bytedance-agent.js';

const agent = new ByteDanceAgent({...});
const result = await agent.execute(task);
```

### Pattern 3: CoordinatorAgent Orchestration
```typescript
// CoordinatorAgent manages workflow
const tasks = await coordinator.createDAG(issue);

for (const task of tasks) {
  if (task.agent === 'bytedance') {
    const result = await bytedanceAgent.execute(task);
    await coordinator.updateProgress(task.id, result);
  }
}
```

### Pattern 4: ReviewAgent Validation
```typescript
// ReviewAgent triggers regeneration
const assets = await bytedanceAgent.execute(task);

for (const asset of assets.assets) {
  const score = await reviewAgent.evaluate(asset);

  if (score < 80) {
    // Regenerate with different seed
    await bytedanceAgent.execute({
      ...task,
      params: { ...task.params, seed: newSeed }
    });
  }
}
```

---

## Scalability Considerations

### Concurrent Execution

```
┌──────────────────────────────────┐
│   ByteDanceAgent Queue           │
│                                  │
│  Task 1  Task 2  Task 3  Task 4 │
└────┬──────┬──────┬──────┬────────┘
     │      │      │      │
     └──────┴──────┴──────┘
            │
            ▼
    ┌──────────────┐
    │ Rate Limiter │
    │ (Max: 5)     │
    └───────┬──────┘
            │
     ┌──────┴──────┬──────┬──────┐
     ▼             ▼      ▼      ▼
  Worker 1     Worker 2  ...  Worker 5
     │             │      │      │
     ▼             ▼      ▼      ▼
  BytePlus     BytePlus  ...  BytePlus
    API          API           API
```

### Rate Limiting Strategy

```typescript
class RateLimiter {
  private queue: Promise<any>[] = [];
  private running = 0;

  async schedule<T>(fn: () => Promise<T>): Promise<T> {
    while (this.running >= this.maxConcurrency) {
      await Promise.race(this.queue);
    }

    this.running++;
    const promise = fn().finally(() => {
      this.running--;
      this.queue = this.queue.filter(p => p !== promise);
    });

    this.queue.push(promise);
    return promise;
  }
}
```

---

## Monitoring & Observability

### Metrics Collected

```typescript
interface AgentMetrics {
  // Performance
  totalTime: number;
  generationTime: number;
  pollingAttempts: number;

  // Success tracking
  successRate: number;
  errorCount: number;
  retryCount: number;

  // Resource usage
  totalTokens: number;
  estimatedCost: number;

  // Asset stats
  assetsGenerated: number;
  imageCount: number;
  videoCount: number;
}
```

### Logging Levels

```
DEBUG: [ByteDanceAgent] Creating video generation task
INFO:  [ByteDanceAgent] Task completed: task-001 (success)
WARN:  [ByteDanceAgent] Retry attempt 2/3 for task-002
ERROR: [ByteDanceAgent] Task failed: task-003 - API key invalid
```

---

## Security Considerations

1. **API Key Management**
   - Never commit keys to git
   - Use environment variables
   - Rotate keys regularly

2. **Input Validation**
   - Sanitize all user inputs
   - Validate URLs before fetching
   - Check file sizes and types

3. **Rate Limiting**
   - Enforce request limits
   - Prevent abuse
   - Monitor usage patterns

4. **Output Sanitization**
   - Validate API responses
   - Check for malicious content
   - Verify URL signatures

---

## Future Architecture Enhancements

1. **Distributed Queue**
   - Redis-backed task queue
   - Multiple agent workers
   - Load balancing

2. **Caching Layer**
   - Redis cache for results
   - Deduplicate similar prompts
   - Reduce API costs

3. **Webhook Integration**
   - Real-time notifications
   - Event-driven workflows
   - External system integration

4. **CDN Integration**
   - Automatic permanent storage
   - Asset versioning
   - Global distribution

---

**Last Updated**: 2025-10-09
**Version**: 1.0
**Status**: Production Ready ✅
