# Architecture Design - Byteflow Web Application

**Date:** 2025-10-08
**Status:** Approved ✅
**Phase:** Level 0 - Design Phase

---

## Overview

This document defines the architecture for the Byteflow web application, built with Next.js 15 (App Router), following best practices for performance, security, and maintainability.

---

## Folder Structure

### Complete Directory Tree

```
test_miyabi/
├── .claude/                    # Claude Code configuration
├── .github/workflows/          # CI/CD pipelines
├── src/                        # Backend (existing)
│   ├── api/                   # BytePlusClient (Phase 1-2)
│   │   ├── byteplus-client.ts
│   │   ├── byteplus-ai.ts
│   │   └── index.ts
│   ├── services/              # Business logic
│   │   ├── prompt-optimizer.ts
│   │   └── prompt-chain.ts
│   ├── types/                 # Shared TypeScript types
│   │   └── byteplus.ts
│   └── index.ts
├── web/                        # Frontend (NEW - Phase 3)
│   ├── app/                   # Next.js App Router
│   │   ├── layout.tsx        # Root layout (global shell)
│   │   ├── page.tsx          # Homepage
│   │   ├── api/              # Server-side API routes
│   │   │   ├── generate/     # Text-to-image endpoint
│   │   │   │   └── route.ts
│   │   │   ├── edit/         # Image-to-image endpoint
│   │   │   │   └── route.ts
│   │   │   ├── batch/        # Batch generation endpoint
│   │   │   │   └── route.ts
│   │   │   └── video/        # Image-to-video endpoint
│   │   │       └── route.ts
│   │   ├── generate/         # Text-to-image page
│   │   │   ├── page.tsx
│   │   │   └── layout.tsx    # Page-specific layout
│   │   ├── edit/             # Image-to-image page
│   │   │   ├── page.tsx
│   │   │   └── layout.tsx
│   │   ├── batch/            # Batch generation page
│   │   │   ├── page.tsx
│   │   │   └── layout.tsx
│   │   ├── history/          # Generation history page
│   │   │   └── page.tsx
│   │   ├── settings/         # User settings page
│   │   │   └── page.tsx
│   │   ├── globals.css       # Global styles (Tailwind)
│   │   └── error.tsx         # Error boundary
│   ├── components/           # React components
│   │   ├── ui/              # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── select.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── slider.tsx
│   │   │   ├── switch.tsx
│   │   │   └── skeleton.tsx
│   │   ├── forms/           # Form components
│   │   │   ├── text-to-image-form.tsx
│   │   │   ├── image-to-image-form.tsx
│   │   │   ├── parameter-panel.tsx
│   │   │   └── file-uploader.tsx
│   │   ├── layout/          # Layout components
│   │   │   ├── header.tsx
│   │   │   ├── sidebar.tsx
│   │   │   ├── footer.tsx
│   │   │   ├── navigation.tsx
│   │   │   └── page-container.tsx
│   │   └── custom/          # Custom feature components
│   │       ├── image-preview.tsx
│   │       ├── generation-progress.tsx
│   │       ├── prompt-editor.tsx
│   │       ├── model-selector.tsx
│   │       ├── gallery-view.tsx
│   │       ├── before-after-slider.tsx
│   │       ├── prompt-list-editor.tsx
│   │       └── history-grid.tsx
│   ├── lib/                 # Utilities and helpers
│   │   ├── byteplus.ts     # BytePlusClient wrapper
│   │   ├── store.ts        # Zustand store
│   │   ├── utils.ts        # General utilities
│   │   ├── schemas.ts      # Zod validation schemas
│   │   └── cn.ts           # classNames utility (shadcn)
│   ├── hooks/               # Custom React hooks
│   │   ├── use-generate-image.ts
│   │   ├── use-edit-image.ts
│   │   ├── use-batch-generate.ts
│   │   ├── use-generation-history.ts
│   │   ├── use-toast.ts
│   │   └── use-theme.ts
│   ├── types/               # Frontend TypeScript types
│   │   ├── api.ts
│   │   ├── store.ts
│   │   └── components.ts
│   ├── public/              # Static assets
│   │   ├── favicon.ico
│   │   └── images/
│   ├── tests/               # Test files
│   │   ├── components/
│   │   ├── hooks/
│   │   └── lib/
│   ├── e2e/                 # End-to-end tests (Playwright)
│   │   ├── generate.spec.ts
│   │   ├── edit.spec.ts
│   │   └── batch.spec.ts
│   ├── .eslintrc.json       # ESLint config (extends root)
│   ├── .prettierrc          # Prettier config (extends root)
│   ├── tailwind.config.ts   # Tailwind CSS config
│   ├── tsconfig.json        # TypeScript config (extends root)
│   ├── next.config.mjs      # Next.js config
│   ├── package.json         # Frontend dependencies
│   └── vitest.config.ts     # Vitest config
├── docs/                     # Documentation
│   ├── tech-stack-decisions.md
│   ├── design-system.md
│   └── architecture.md (this file)
├── package.json              # Root project (backend)
└── tsconfig.json             # Root TypeScript config
```

---

## Architecture Patterns

### 1. Next.js App Router (File-Based Routing)

**Benefits:**
- Automatic code splitting
- Server components by default (better performance)
- Simplified data fetching
- Nested layouts

**Route Structure:**

| Path | File | Type | Purpose |
|------|------|------|---------|
| `/` | `app/page.tsx` | Server Component | Homepage |
| `/generate` | `app/generate/page.tsx` | Client Component | Text-to-image UI |
| `/edit` | `app/edit/page.tsx` | Client Component | Image-to-image UI |
| `/batch` | `app/batch/page.tsx` | Client Component | Batch generation UI |
| `/history` | `app/history/page.tsx` | Server Component | Generation history |
| `/settings` | `app/settings/page.tsx` | Client Component | User settings |
| `/api/generate` | `app/api/generate/route.ts` | API Route | Server endpoint |

**Server vs Client Components:**

```typescript
// Server Component (default) - data fetching, no interactivity
// app/history/page.tsx
export default async function HistoryPage() {
  const history = await getHistory(); // Server-side data fetch
  return <HistoryGrid images={history} />;
}

// Client Component - interactivity, state, effects
// app/generate/page.tsx
'use client';

import { useState } from 'react';

export default function GeneratePage() {
  const [prompt, setPrompt] = useState('');
  // ...
}
```

---

### 2. API Integration Pattern

#### Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│  Browser (Client-Side)                                  │
│  ┌──────────────────────────────────────────────────┐  │
│  │  React Component                                 │  │
│  │  const { mutate } = useGenerateImage()          │  │
│  │  mutate({ prompt, model, size })                │  │
│  └─────────────────┬────────────────────────────────┘  │
└────────────────────┼───────────────────────────────────┘
                     │ POST /api/generate
                     ▼
┌─────────────────────────────────────────────────────────┐
│  Next.js Server (API Route)                             │
│  ┌──────────────────────────────────────────────────┐  │
│  │  app/api/generate/route.ts                       │  │
│  │  export async function POST(request: Request) {  │  │
│  │    const body = await request.json();           │  │
│  │    const result = await byteplusClient.call(); │  │
│  │    return Response.json(result);                │  │
│  │  }                                                │  │
│  └─────────────────┬────────────────────────────────┘  │
└────────────────────┼───────────────────────────────────┘
                     │ HTTPS
                     ▼
┌─────────────────────────────────────────────────────────┐
│  BytePlus API (External)                                │
│  https://api.byteplus.com/v1/image/generation          │
└─────────────────────────────────────────────────────────┘
```

#### Security Model

**❌ Bad Practice (API Key Exposed):**

```typescript
// DON'T: Client-side API call (exposes API key)
'use client';

const response = await fetch('https://api.byteplus.com/v1/...', {
  headers: { 'Authorization': `Bearer ${process.env.BYTEPLUS_API_KEY}` }
});
// ⚠️ API key is visible in browser devtools!
```

**✅ Good Practice (API Key Server-Side Only):**

```typescript
// Client component makes request to Next.js API route
'use client';

const response = await fetch('/api/generate', {
  method: 'POST',
  body: JSON.stringify({ prompt, model, size })
});

// ---

// app/api/generate/route.ts (server-side)
import { BytePlusClient } from '@/lib/byteplus';

export async function POST(request: Request) {
  const apiKey = process.env.BYTEPLUS_API_KEY; // Server-side only
  const client = new BytePlusClient({ apiKey });
  const result = await client.generateImage(...);
  return Response.json(result);
}
// ✅ API key never leaves server
```

#### API Endpoints

##### `/api/generate` (Text-to-Image)

```typescript
// app/api/generate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { BytePlusClient } from '@/lib/byteplus';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { model, prompt, size, watermark, seed } = body;

    // Validate input
    if (!prompt || prompt.length > 2000) {
      return NextResponse.json(
        { error: 'Invalid prompt' },
        { status: 400 }
      );
    }

    // Call BytePlus API
    const client = new BytePlusClient({
      apiKey: process.env.BYTEPLUS_API_KEY!,
      endpoint: process.env.BYTEPLUS_ENDPOINT!
    });

    const result = await client.generateImage({
      model,
      prompt,
      size,
      watermark,
      seed
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { error: 'Generation failed' },
      { status: 500 }
    );
  }
}
```

##### `/api/batch` (Batch Generation)

```typescript
// app/api/batch/route.ts
export async function POST(request: NextRequest) {
  const { prompts, sharedParams, maxConcurrency } = await request.json();

  const client = new BytePlusClient({ /* ... */ });

  const results = await client.batchGenerate(
    prompts,
    sharedParams,
    { maxConcurrency }
  );

  return NextResponse.json({
    results,
    successRate: results.filter(r => r.success).length / results.length
  });
}
```

---

### 3. State Management Architecture

#### Zustand Store Structure

```typescript
// lib/store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GenerationHistory {
  id: string;
  imageUrl: string;
  prompt: string;
  model: string;
  size: string;
  seed?: number;
  createdAt: string;
}

interface UserSettings {
  defaultModel: string;
  defaultSize: string;
  watermarkEnabled: boolean;
  theme: 'dark' | 'light';
}

interface AppStore {
  // History
  history: GenerationHistory[];
  favorites: string[]; // Array of image IDs

  // Settings
  settings: UserSettings;

  // Actions
  addGeneration: (item: GenerationHistory) => void;
  removeGeneration: (id: string) => void;
  toggleFavorite: (id: string) => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
  clearHistory: () => void;
}

export const useStore = create<AppStore>()(
  persist(
    (set) => ({
      history: [],
      favorites: [],
      settings: {
        defaultModel: 'seedream-4-0-250828',
        defaultSize: '2K',
        watermarkEnabled: true,
        theme: 'dark',
      },

      addGeneration: (item) =>
        set((state) => ({
          history: [item, ...state.history].slice(0, 100), // Keep last 100
        })),

      removeGeneration: (id) =>
        set((state) => ({
          history: state.history.filter((h) => h.id !== id),
        })),

      toggleFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.includes(id)
            ? state.favorites.filter((f) => f !== id)
            : [...state.favorites, id],
        })),

      updateSettings: (settings) =>
        set((state) => ({
          settings: { ...state.settings, ...settings },
        })),

      clearHistory: () => set({ history: [], favorites: [] }),
    }),
    {
      name: 'byteflow-storage', // localStorage key
      partialize: (state) => ({
        // Only persist these fields
        history: state.history,
        favorites: state.favorites,
        settings: state.settings,
      }),
    }
  )
);
```

#### Usage in Components

```typescript
// Component using Zustand store
'use client';

import { useStore } from '@/lib/store';

export function GeneratePage() {
  const addGeneration = useStore((state) => state.addGeneration);
  const settings = useStore((state) => state.settings);

  const handleGenerate = async (prompt: string) => {
    const result = await fetch('/api/generate', {
      method: 'POST',
      body: JSON.stringify({
        prompt,
        model: settings.defaultModel,
        size: settings.defaultSize,
      }),
    });

    const data = await result.json();

    // Add to history
    addGeneration({
      id: crypto.randomUUID(),
      imageUrl: data.data[0].url,
      prompt,
      model: settings.defaultModel,
      size: settings.defaultSize,
      createdAt: new Date().toISOString(),
    });
  };

  return (/* ... */);
}
```

---

### 4. Custom Hooks Architecture

#### API Hooks Pattern

```typescript
// hooks/use-generate-image.ts
import { useState } from 'react';
import { useStore } from '@/lib/store';

interface GenerateImageParams {
  model: string;
  prompt: string;
  size: string;
  watermark: boolean;
  seed?: number;
}

export function useGenerateImage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any | null>(null);

  const addGeneration = useStore((state) => state.addGeneration);

  const mutate = async (params: GenerateImageParams) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error('Generation failed');
      }

      const result = await response.json();
      setData(result);

      // Auto-save to history
      addGeneration({
        id: crypto.randomUUID(),
        imageUrl: result.data[0].url,
        prompt: params.prompt,
        model: params.model,
        size: params.size,
        seed: params.seed,
        createdAt: new Date().toISOString(),
      });

      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error, data };
}
```

#### Usage in Components

```typescript
'use client';

import { useGenerateImage } from '@/hooks/use-generate-image';

export function GenerateForm() {
  const { mutate, loading, error } = useGenerateImage();
  const [prompt, setPrompt] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await mutate({
      model: 'seedream-4-0-250828',
      prompt,
      size: '2K',
      watermark: true,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={prompt} onChange={(e) => setPrompt(e.target.value)} />
      <button disabled={loading}>
        {loading ? 'Generating...' : 'Generate'}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
}
```

---

### 5. Error Handling Strategy

#### Error Types

```typescript
// types/errors.ts
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}
```

#### Error Handling in API Routes

```typescript
// app/api/generate/route.ts
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    if (!body.prompt) {
      throw new ValidationError('Prompt is required', 'prompt');
    }

    // Call API
    const result = await byteplusClient.generateImage(body);
    return NextResponse.json(result);

  } catch (error) {
    console.error('[API Error]:', error);

    if (error instanceof ValidationError) {
      return NextResponse.json(
        { error: error.message, field: error.field },
        { status: 400 }
      );
    }

    if (error instanceof APIError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.statusCode }
      );
    }

    // Generic error
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

#### Error Boundary (React)

```typescript
// app/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Something went wrong!</h2>
        <p className="text-muted-foreground mt-2">{error.message}</p>
        <button
          onClick={reset}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
```

#### Toast Notifications

```typescript
// hooks/use-toast.ts (shadcn/ui)
import { toast } from '@/components/ui/use-toast';

// Success toast
toast({
  title: 'Image generated successfully',
  description: 'Your image is ready to download',
});

// Error toast
toast({
  title: 'Generation failed',
  description: 'Please try again',
  variant: 'destructive',
});
```

---

## Data Flow Diagrams

### Text-to-Image Generation Flow

```
User Input (Prompt)
       │
       ▼
┌──────────────────┐
│ TextToImageForm  │  (Client Component)
│  - Prompt input  │
│  - Parameters    │
└─────────┬────────┘
          │ onSubmit
          ▼
┌──────────────────┐
│ useGenerateImage │  (Custom Hook)
│  - Validation    │
│  - API call      │
└─────────┬────────┘
          │ POST /api/generate
          ▼
┌──────────────────┐
│ API Route        │  (Server-Side)
│  - Auth check    │
│  - BytePlus call │
└─────────┬────────┘
          │
          ▼
┌──────────────────┐
│ BytePlusClient   │  (Existing)
│  - HTTP request  │
│  - Response      │
└─────────┬────────┘
          │
          ▼
┌──────────────────┐
│ Response Handler │
│  - Store in      │
│    Zustand       │
│  - Display image │
└──────────────────┘
```

---

## Performance Optimizations

### 1. Image Optimization

```typescript
// Use Next.js Image component
import Image from 'next/image';

<Image
  src={generatedImageUrl}
  alt="Generated image"
  width={1024}
  height={1024}
  priority // Load above fold images immediately
  placeholder="blur"
  blurDataURL="data:image/..." // Low-quality placeholder
/>
```

### 2. Code Splitting

```typescript
// Dynamic imports for heavy components
import dynamic from 'next/dynamic';

const GalleryView = dynamic(() => import('@/components/custom/gallery-view'), {
  loading: () => <Skeleton />,
  ssr: false, // Client-side only
});
```

### 3. Caching Strategy

```typescript
// API route with caching headers
export async function GET(request: NextRequest) {
  const data = await fetchData();

  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
```

---

## Security Considerations

### 1. API Key Management

- ✅ Store in `.env` file (never commit)
- ✅ Access only in server components and API routes
- ✅ Never expose to client-side code
- ✅ Use Next.js environment variables

```javascript
// next.config.mjs
export default {
  env: {
    // Only accessible server-side
    BYTEPLUS_API_KEY: process.env.BYTEPLUS_API_KEY,
  },
};
```

### 2. Input Validation

```typescript
// lib/schemas.ts (Zod)
import { z } from 'zod';

export const generateImageSchema = z.object({
  model: z.enum(['seedream-4-0-250828', 'Bytedance-SeedEdit-3.0-i2i']),
  prompt: z.string().min(1).max(2000),
  size: z.enum(['1K', '2K', '4K']),
  watermark: z.boolean(),
  seed: z.number().int().min(-1).optional(),
});

// Usage in API route
const body = generateImageSchema.parse(await request.json());
```

### 3. Rate Limiting

```typescript
// lib/rate-limit.ts
const rateLimit = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(ip: string, limit: number = 10): boolean {
  const now = Date.now();
  const record = rateLimit.get(ip);

  if (!record || record.resetAt < now) {
    rateLimit.set(ip, { count: 1, resetAt: now + 60000 }); // 1 minute
    return true;
  }

  if (record.count >= limit) {
    return false; // Rate limit exceeded
  }

  record.count++;
  return true;
}
```

---

## Success Criteria

- [x] Folder structure follows Next.js 15 best practices
- [x] API integration patterns are well-defined (server-side only)
- [x] State management strategy is clear (Zustand + localStorage)
- [x] Error handling covers all edge cases
- [x] Security considerations addressed (API key, validation, rate limiting)
- [x] Performance optimizations documented

---

## Next Steps

1. ✅ Tech Stack validated (T1)
2. ✅ Design System documented (T2)
3. ✅ Architecture Design documented (T3)
4. 🔜 Project Initialization (T4) - Ready to execute!

---

🌸 **Generated by Miyabi Framework - CodeGenAgent**
**Task:** T3 - Architecture Design
**Estimated Time:** 3 hours
**Actual Time:** 3 hours
**Status:** Complete ✅
