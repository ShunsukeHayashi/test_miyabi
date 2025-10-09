# BytePlus API Specification

**Version:** v3
**Last Updated:** 2025-10-09
**Project:** test_miyabi (Byteflow)

---

## 目次

1. [概要](#概要)
2. [認証とエンドポイント](#認証とエンドポイント)
3. [API一覧](#api一覧)
   - [T2I (Text-to-Image)](#t2i-text-to-image)
   - [I2I (Image-to-Image)](#i2i-image-to-image)
   - [I2V (Image-to-Video)](#i2v-image-to-video)
   - [T2V (Text-to-Video)](#t2v-text-to-video)
   - [Vision API (マルチモーダル)](#vision-api-マルチモーダル)
4. [プロンプト最適化 (T2T)](#プロンプト最適化-t2t)
5. [バッチ生成](#バッチ生成)
6. [エラーハンドリング](#エラーハンドリング)
7. [レート制限とリトライ](#レート制限とリトライ)
8. [ベストプラクティス](#ベストプラクティス)
9. [コード例](#コード例)
10. [Python SDK](#python-sdk)

---

## 概要

BytePlus APIは、ByteDanceが提供する次世代AI画像・動画生成プラットフォームです。以下の主要モデルをサポートしています：

### 対応モデル

| カテゴリ | モデル | 機能 |
|---------|--------|------|
| **画像生成** | seedream-4-0-250828 | T2I: 最高品質の画像生成 |
| | seedream-3-5 | T2I: 汎用画像生成 |
| | seedream-3-0 | T2I: 標準品質 |
| | Bytedance-SeedEdit-3.0-i2i | I2I: 画像編集 |
| **動画生成** | Bytedance-Seedance-1.0-pro | I2V: 画像から動画生成 |
| **テキスト生成** | DeepSeek-R1-250528 | T2T: 高度な推論、プロンプト最適化 |
| | Skylark-pro-250415 | T2T: 高速プロンプト最適化 |
| **マルチモーダル** | seed-1-6-250915 | Vision: 画像理解・質問応答 |

---

## 認証とエンドポイント

### 環境変数

```bash
# BytePlus API認証情報
BYTEPLUS_API_KEY=bp_xxxxxxxxxxxxx
BYTEPLUS_ENDPOINT=https://ark.ap-southeast.bytepluses.com/api/v3
```

### エンドポイント構成

| API | HTTP Method | Path |
|-----|-------------|------|
| 画像生成 (T2I/I2I) | POST | `/images/generations` |
| 動画生成 (I2V) | POST | `/videos/generations` |
| テキスト生成 (T2T) | POST | `/chat/completions` |

### 認証ヘッダー

```http
Authorization: Bearer ${BYTEPLUS_API_KEY}
Content-Type: application/json
User-Agent: Byteflow/1.0
x-is-encrypted: true
```

---

## API一覧

### T2I (Text-to-Image)

テキストプロンプトから画像を生成します。

#### リクエスト

**Endpoint:** `POST /images/generations`

**Parameters:**

```typescript
interface ImageGenerationRequest {
  model: 'seedream-4-0-250828' | 'seedream-3-5' | 'seedream-3-0';
  prompt: string;                      // 必須、1-2000文字
  size?: '1K' | '2K' | '4K';          // デフォルト: '1K'
  response_format?: 'url' | 'base64'; // デフォルト: 'url'
  stream?: boolean;                    // デフォルト: false
  watermark?: boolean;                 // デフォルト: true
  seed?: number;                       // オプション、再現性確保
}
```

**サイズマッピング:**
- `1K`: 1024×1024px
- `2K`: 2048×2048px
- `4K`: 4096×4096px

#### レスポンス

```typescript
interface ImageGenerationResponse {
  data: Array<{
    url: string;                       // 生成画像URL
    b64_json?: string;                 // Base64エンコード画像
    revised_prompt?: string;           // AI改善プロンプト
  }>;
  seed?: number;                       // 使用されたシード値
  id?: string;                         // リクエストID
  created?: number;                    // タイムスタンプ
  metadata?: {
    model: string;
    prompt: string;
    generationTime: number;
    dimensions: { width: number; height: number };
    seed?: number;
  };
}
```

#### 例

```typescript
const result = await client.generateImage({
  model: 'seedream-4-0-250828',
  prompt: 'A beautiful sunset over mountains, photorealistic style, high detail',
  size: '2K',
  watermark: false,
  seed: 42
});

console.log(`生成画像: ${result.data[0].url}`);
console.log(`シード値: ${result.seed}`);
```

#### 制約

| 項目 | 制限 |
|------|------|
| プロンプト長 | 1-2000文字 |
| 画像サイズ | 64-4096px |
| レート制限 | 10リクエスト/秒 |
| タイムアウト | 30秒 |

---

### I2I (Image-to-Image)

既存の画像を編集・加工します。

#### リクエスト

**Endpoint:** `POST /images/generations`

**Parameters:**

```typescript
interface ImageEditRequest {
  model: 'Bytedance-SeedEdit-3.0-i2i';
  prompt: string;                      // 編集指示
  image: string[];                     // 必須: ソース画像URL配列
  size?: '1K' | '2K' | '4K';
  response_format?: 'url' | 'base64';
  watermark?: boolean;
  seed?: number;
}
```

**重要:** `image`パラメータは**配列形式**で必須です。

#### レスポンス

T2Iと同じ `ImageGenerationResponse` 形式。

#### 例

```typescript
// 基本的な画像編集
const result = await client.generateImage({
  model: 'Bytedance-SeedEdit-3.0-i2i',
  prompt: 'Add a rainbow in the sky, enhance colors, increase saturation',
  image: ['https://example.com/original-landscape.jpg'],
  size: '2K'
});

// 複数参照画像を使用
const result = await client.generateImage({
  model: 'Bytedance-SeedEdit-3.0-i2i',
  prompt: 'Combine styles from both reference images',
  image: [
    'https://example.com/style-ref-1.jpg',
    'https://example.com/style-ref-2.jpg'
  ],
  size: '2K'
});
```

#### Sequential Image Generation（連続画像生成）

ストーリー性のある複数画像を一貫性を保って生成します。

```typescript
interface SequentialGenerationRequest {
  model: 'seedream-4-0-250828';
  prompt: string;
  image?: string[];                    // 参照画像
  sequential_image_generation: 'auto' | 'manual';
  sequential_image_generation_options: {
    max_images: number;                // 1-10枚
  };
  size?: '1K' | '2K' | '4K';
  stream?: boolean;
  watermark?: boolean;
}
```

**例:**

```typescript
const result = await client.generateImage({
  model: 'seedream-4-0-250828',
  prompt: 'Generate 3 images of a girl and a cow plushie happily riding a roller coaster',
  image: [
    'https://example.com/girl-reference.png',
    'https://example.com/plushie-reference.png'
  ],
  sequential_image_generation: 'auto',
  sequential_image_generation_options: {
    max_images: 3
  },
  size: '2K',
  stream: true,
  watermark: true
});

// result.data には3枚の連続画像が含まれる
result.data.forEach((img, i) => {
  console.log(`シーン ${i + 1}: ${img.url}`);
});
```

#### 制約

| 項目 | 制限 |
|------|------|
| `image` | 必須、URL配列 |
| `max_images` | 1-10枚 |
| その他 | T2Iと同じ |

---

### I2V (Image-to-Video)

静止画像から動画を生成します。

#### リクエスト

**Endpoint:** `POST /videos/generations`

**Parameters:**

```typescript
interface VideoGenerationRequest {
  model: 'Bytedance-Seedance-1.0-pro';
  image: string;                       // 必須: ソース画像URL
  prompt?: string;                     // 動きの説明（オプション）
  resolution?: '480P' | '720P' | '1080P'; // デフォルト: '1080P'
  ratio?: 'Auto' | '21:9' | '16:9' | '4:3' | '1:1' | '3:4' | '9:16';
  duration?: 5 | 10;                   // 5秒 or 10秒、デフォルト: 5
  quantity?: 1 | 2 | 3 | 4;           // 生成数、デフォルト: 1
  fixed_lens?: boolean;                // カメラ固定モード
  watermark?: boolean;                 // デフォルト: true
  seed?: number;
}
```

#### レスポンス

```typescript
interface VideoGenerationResponse {
  data: Array<{
    url: string;                       // 動画URL
    thumbnail_url?: string;            // サムネイルURL
    duration?: number;                 // 動画長（秒）
  }>;
  seed?: number;
  id?: string;
  created?: number;
  metadata?: {
    model: string;
    danceStyle: string;
    generationTime: number;
    duration: number;
    dimensions: { width: number; height: number };
    fps: number;
    seed: number;
  };
}
```

#### カメラモード

| モード | `fixed_lens` | 用途 | 特徴 |
|--------|--------------|------|------|
| **動的カメラ** | `false` | シネマティック映像、ダイナミックなシーン | カメラパン、ズーム、移動 |
| **固定カメラ** | `true` | 商品紹介、プレゼンテーション | フレーミング固定、安定した映像 |

#### 例

**動的カメラ（シネマティック）:**

```typescript
const video = await client.generateVideo({
  model: 'Bytedance-Seedance-1.0-pro',
  image: 'https://example.com/epic-landscape.jpg',
  prompt: 'Slow camera pan from left to right, cinematic style, smooth motion',
  resolution: '1080P',
  ratio: '16:9',
  duration: 10,
  quantity: 1,
  fixed_lens: false,
  watermark: true
});

console.log(`動画URL: ${video.data[0].url}`);
console.log(`サムネイル: ${video.data[0].thumbnail_url}`);
```

**固定カメラ（商品紹介）:**

```typescript
const productVideo = await client.generateVideo({
  model: 'Bytedance-Seedance-1.0-pro',
  image: 'https://example.com/product-shot.jpg',
  prompt: 'Product showcase, professional lighting, static camera',
  resolution: '1080P',
  ratio: '1:1',        // Instagram用正方形
  duration: 5,
  fixed_lens: true,    // カメラ固定
  watermark: false
});
```

**複数バリエーション生成:**

```typescript
const videos = await client.generateVideo({
  model: 'Bytedance-Seedance-1.0-pro',
  image: 'https://example.com/scene.jpg',
  prompt: 'Dynamic movements',
  resolution: '720P',
  ratio: '16:9',
  duration: 5,
  quantity: 4,         // 4パターン生成
  seed: 42
});

videos.data.forEach((video, i) => {
  console.log(`バリエーション ${i + 1}: ${video.url}`);
});
```

#### 制約

| 項目 | 制限 |
|------|------|
| `image` | 必須、単一URL |
| `duration` | 5秒 or 10秒のみ |
| `quantity` | 1-4 |
| タイムアウト | 30秒 |

---

### T2V (Text-to-Video)

**現状:** BytePlus APIは**T2V（テキストから直接動画生成）を直接サポートしていません**。

#### 代替ワークフロー: T2I → I2V

テキストから動画を生成するには、2ステップの処理が必要です。

```typescript
/**
 * T2V ワークフロー
 * Step 1: テキストから画像生成 (T2I)
 * Step 2: 画像から動画生成 (I2V)
 */

// Step 1: T2I - テキストから静止画を生成
const imageResult = await client.generateImage({
  model: 'seedream-4-0-250828',
  prompt: 'A brave hero standing on a cliff at sunset, epic fantasy style, detailed',
  size: '2K',
  watermark: false
});

const generatedImageUrl = imageResult.data[0].url;
console.log(`中間画像生成完了: ${generatedImageUrl}`);

// Step 2: I2V - 生成した画像から動画を作成
const videoResult = await client.generateVideo({
  model: 'Bytedance-Seedance-1.0-pro',
  image: generatedImageUrl,
  prompt: 'Epic camera pan, dramatic lighting, hero pose',
  resolution: '1080P',
  ratio: '16:9',
  duration: 5,
  fixed_lens: false
});

console.log(`最終動画: ${videoResult.data[0].url}`);
```

#### 統合クライアント（推奨）

`BytePlusAI` クラスを使用すると、ワークフローを簡略化できます：

```typescript
import { BytePlusAI } from './api/byteplus-ai.js';

const ai = new BytePlusAI({
  apiKey: process.env.BYTEPLUS_API_KEY!,
  endpoint: process.env.BYTEPLUS_ENDPOINT!
});

// 将来的な実装候補（現在は手動でT2I→I2Vを実行）
// const video = await ai.generateVideoFromText(
//   'A hero on a cliff',
//   'Epic camera movement'
// );
```

---

### Vision API (マルチモーダル)

画像を理解し、画像に関する質問に回答します。

#### リクエスト

**Endpoint:** `POST /chat/completions`

**Parameters:**

```typescript
interface VisionRequest {
  model: 'seed-1-6-250915';
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: Array<{
      type: 'image_url' | 'text';
      image_url?: {
        url: string;               // 画像URL
      };
      text?: string;               // テキスト質問
    }>;
  }>;
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
}
```

#### レスポンス

```typescript
interface VisionResponse {
  choices: Array<{
    message: {
      role: string;
      content: string;             // 画像に関する回答
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  id?: string;
  model: string;
  created?: number;
}
```

#### 例

**TypeScript:**

```typescript
import { TextGenerationClient } from './api/text-generation-client.js';

const client = new TextGenerationClient({
  apiKey: process.env.BYTEPLUS_API_KEY!,
  endpoint: process.env.BYTEPLUS_ENDPOINT!
});

const response = await client.generate({
  model: 'seed-1-6-250915',
  messages: [
    {
      role: 'user',
      content: [
        {
          type: 'image_url',
          image_url: {
            url: 'https://example.com/image.jpg'
          }
        },
        {
          type: 'text',
          text: 'この画像には何が写っていますか？'
        }
      ]
    }
  ]
});

console.log('AI回答:', response.choices[0].message.content);
```

**Python (公式SDK):**

```python
import os
from byteplussdkarkruntime import Ark

# APIキーを環境変数から読み込み
client = Ark(
    base_url="https://ark.cn-beijing.volces.com/api/v3",
    api_key=os.environ.get("ARK_API_KEY")
)

response = client.chat.completions.create(
    model="seed-1-6-250915",
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "image_url",
                    "image_url": {
                        "url": "https://ark-doc.tos-ap-southeast-1.bytepluses.com/see_i2v.jpeg"
                    }
                },
                {
                    "type": "text",
                    "text": "Where is this？"
                }
            ]
        }
    ]
)

print(response.choices[0])
```

#### 使用例

**画像キャプション生成:**

```typescript
const caption = await client.generate({
  model: 'seed-1-6-250915',
  messages: [{
    role: 'user',
    content: [
      { type: 'image_url', image_url: { url: imageUrl } },
      { type: 'text', text: 'この画像の詳細な説明を生成してください' }
    ]
  }]
});
```

**画像分類:**

```typescript
const classification = await client.generate({
  model: 'seed-1-6-250915',
  messages: [{
    role: 'user',
    content: [
      { type: 'image_url', image_url: { url: productImageUrl } },
      { type: 'text', text: 'この商品のカテゴリは何ですか？' }
    ]
  }]
});
```

**OCR（文字認識）:**

```typescript
const ocrResult = await client.generate({
  model: 'seed-1-6-250915',
  messages: [{
    role: 'user',
    content: [
      { type: 'image_url', image_url: { url: documentUrl } },
      { type: 'text', text: '画像内のテキストを抽出してください' }
    ]
  }]
});
```

**ビジュアル質問応答 (VQA):**

```typescript
const vqaResult = await client.generate({
  model: 'seed-1-6-250915',
  messages: [{
    role: 'user',
    content: [
      { type: 'image_url', image_url: { url: sceneUrl } },
      { type: 'text', text: '写真に何人の人がいますか？何をしていますか？' }
    ]
  }]
});
```

#### 制約

| 項目 | 制限 |
|------|------|
| 対応画像形式 | JPEG, PNG, WebP |
| 最大画像サイズ | 10MB |
| 画像URL | HTTPSプロトコル必須 |
| レート制限 | 10リクエスト/秒 |

---

## プロンプト最適化 (T2T)

BytePlusのテキスト生成AIを使用して、画像・動画生成用の高品質プロンプトを自動生成します。

### 対応モデル

| モデル | 特徴 | 用途 |
|--------|------|------|
| **DeepSeek-R1-250528** | 高度な推論能力、詳細分析 | 複雑なコンセプト展開、詳細プロンプト |
| **Skylark-pro-250415** | BytePlus最適化、低レイテンシ | シンプルな最適化、高速処理 |

### リクエスト

**Endpoint:** `POST /chat/completions`

```typescript
interface TextGenerationRequest {
  model: 'DeepSeek-R1-250528' | 'Skylark-pro-250415';
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  max_tokens?: number;                 // デフォルト: 2048
  temperature?: number;                // 0.0-2.0、デフォルト: 0.7
  top_p?: number;                      // 0.0-1.0、デフォルト: 1.0
  stream?: boolean;                    // デフォルト: false
}
```

### レスポンス

```typescript
interface TextGenerationResponse {
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  id?: string;
  model: string;
  created?: number;
}
```

### 使用例

#### 基本的なプロンプト最適化

```typescript
import { PromptOptimizer } from './services/prompt-optimizer.js';

const optimizer = new PromptOptimizer({
  apiKey: process.env.BYTEPLUS_API_KEY!,
  endpoint: process.env.BYTEPLUS_ENDPOINT!
});

// T2I用プロンプト最適化
const t2iPrompt = await optimizer.optimizeForImage(
  'a cat on a windowsill',
  'photorealistic'
);

console.log('最適化プロンプト:', t2iPrompt);
// 出力例: "A photorealistic image of an orange tabby cat sitting gracefully
// on a wooden windowsill, natural lighting from the window, soft shadows,
// detailed fur texture, 4K quality, professional photography"

// I2I用プロンプト最適化
const i2iPrompt = await optimizer.optimizeForImageEdit(
  'add rainbow in sky'
);

// I2V用プロンプト最適化
const i2vPrompt = await optimizer.optimizeForVideo(
  'smooth camera pan left'
);
```

#### プロンプトチェーン（最高品質）

複数ステップで段階的にプロンプトを改善します。

```typescript
import { PromptChain } from './services/prompt-chain.js';

const chain = new PromptChain({
  apiKey: process.env.BYTEPLUS_API_KEY!,
  endpoint: process.env.BYTEPLUS_ENDPOINT!
});

const result = await chain.execute(
  'cyberpunk city at night',
  [
    {
      name: 'Concept Expansion',
      systemPrompt: 'Analyze the cyberpunk aesthetic and expand the concept with rich details',
      temperature: 0.8
    },
    {
      name: 'Technical Enhancement',
      systemPrompt: 'Add technical details: lighting, composition, camera settings',
      temperature: 0.6
    },
    {
      name: 'Final Polish',
      systemPrompt: 'Refine for maximum image quality and clarity',
      temperature: 0.5
    }
  ]
);

console.log('最終プロンプト:', result.finalPrompt);
console.log('トークン使用量:', result.totalTokens);
console.log('処理ステップ:', result.steps.map(s => s.name));

// 最適化されたプロンプトで画像生成
const image = await client.generateImage({
  model: 'seedream-4-0-250828',
  prompt: result.finalPrompt,
  size: '2K'
});
```

#### 統合クライアントでの自動最適化

```typescript
import { BytePlusAI } from './api/byteplus-ai.js';

const ai = new BytePlusAI({
  apiKey: process.env.BYTEPLUS_API_KEY!,
  endpoint: process.env.BYTEPLUS_ENDPOINT!,
  debug: true
});

// 自動プロンプト最適化付き画像生成
const result = await ai.generateImage(
  {
    model: 'seedream-4-0-250828',
    prompt: 'a beautiful sunset',  // シンプルな入力
    size: '2K'
  },
  {
    optimizePrompt: true,          // 自動最適化ON
    optimizerModel: 'DeepSeek-R1-250528'
  }
);

// AIが自動的に詳細プロンプトに変換して画像生成
```

#### ストーリー生成（連続画像）

一貫性のある複数画像を自動生成します。

```typescript
const images = await ai.generateStory(
  'A hero\'s journey: peaceful village → dark forest → dragon castle',
  3,  // 3枚の画像
  {
    model: 'seedream-4-0-250828',
    size: '2K',
    watermark: false
  }
);

images.forEach((img, i) => {
  console.log(`シーン ${i + 1}: ${img.data[0].url}`);
});
```

---

## バッチ生成

複数の画像を並列生成します。

### リクエスト

```typescript
interface BatchGenerationRequest {
  prompts: string[];                   // プロンプト配列
  sharedParams?: Partial<ImageGenerationRequest>;
  maxConcurrency?: number;             // デフォルト: 10
}
```

### レスポンス

```typescript
interface BatchGenerationResult {
  successful: ImageGenerationResponse[];
  failed: Array<{
    prompt: string;
    error: string;
  }>;
  totalTime: number;                   // ミリ秒
  successRate: number;                 // 0.0-1.0
}
```

### 例

```typescript
const result = await client.batchGenerate({
  prompts: [
    'A sunset over mountains',
    'A city skyline at night',
    'A peaceful forest in autumn',
    'An ocean wave crashing',
    'A starry night sky'
  ],
  sharedParams: {
    model: 'seedream-4-0-250828',
    size: '2K',
    watermark: false
  },
  maxConcurrency: 3  // 最大3つ同時実行
});

console.log(`成功: ${result.successful.length}/${result.prompts.length}`);
console.log(`成功率: ${(result.successRate * 100).toFixed(1)}%`);
console.log(`総処理時間: ${result.totalTime}ms`);

// 失敗した生成を確認
result.failed.forEach(failure => {
  console.error(`失敗: "${failure.prompt}" - ${failure.error}`);
});

// 成功した画像を処理
result.successful.forEach((response, i) => {
  console.log(`画像 ${i + 1}: ${response.data[0].url}`);
});
```

---

## エラーハンドリング

### エラー型定義

```typescript
class BytePlusAPIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code?: string,
    public requestId?: string
  ) {
    super(message);
    this.name = 'BytePlusAPIError';
  }
}
```

### HTTPステータスコード

| コード | 意味 | 自動リトライ | 対処方法 |
|--------|------|--------------|----------|
| **400** | Bad Request（不正なパラメータ） | ❌ | リクエストパラメータを確認 |
| **401** | Unauthorized（認証エラー） | ❌ | APIキーを確認 |
| **403** | Forbidden（アクセス拒否） | ❌ | API権限を確認 |
| **404** | Not Found（エンドポイント不明） | ❌ | URLを確認 |
| **429** | Rate Limit Exceeded | ✅ | 自動リトライ（Exponential Backoff） |
| **500** | Internal Server Error | ✅ | 自動リトライ |
| **502** | Bad Gateway | ✅ | 自動リトライ |
| **503** | Service Unavailable | ✅ | 自動リトライ |

### エラーハンドリング例

```typescript
import { BytePlusAPIError } from './api/byteplus-client.js';

try {
  const result = await client.generateImage({
    model: 'seedream-4-0-250828',
    prompt: 'test image',
    size: '2K'
  });

  console.log('成功:', result.data[0].url);

} catch (error) {
  if (error instanceof BytePlusAPIError) {
    switch (error.statusCode) {
      case 400:
        console.error('パラメータエラー:', error.message);
        // リクエスト内容を修正
        break;

      case 401:
        console.error('認証エラー: APIキーを確認してください');
        // 環境変数 BYTEPLUS_API_KEY を確認
        break;

      case 429:
        console.error('レート制限エラー（自動リトライ済み）');
        // RateLimiter が自動的に処理
        break;

      case 500:
      case 502:
      case 503:
        console.error('サーバーエラー（自動リトライ済み）:', error.message);
        // Exponential Backoff で自動リトライ済み
        break;

      default:
        console.error('APIエラー:', error.message);
        console.error('リクエストID:', error.requestId);
    }
  } else {
    // ネットワークエラーなど
    console.error('予期しないエラー:', error);
  }
}
```

---

## レート制限とリトライ

### レート制限

**制限:** 10リクエスト/秒（1000msウィンドウ）

BytePlusClientは自動的にレート制限を管理します：

```typescript
// RateLimiter が自動的にリクエストを調整
const client = new BytePlusClient({
  apiKey: process.env.BYTEPLUS_API_KEY!,
  endpoint: process.env.BYTEPLUS_ENDPOINT!
});

// レート制限統計を取得
const stats = client.getRateLimiterStats();
console.log(`使用中: ${stats.used}/10`);
console.log(`利用可能: ${stats.available}`);
console.log(`リセットまで: ${stats.resetIn}ms`);
```

### リトライロジック

**設定:**
- デフォルトリトライ回数: 3回
- Exponential Backoff: 1秒 → 2秒 → 4秒 → 8秒（最大10秒）

**リトライ対象:**
- HTTPステータス 429（Rate Limit）
- HTTPステータス 500以上（Server Error）
- ネットワークエラー

**リトライ非対象:**
- HTTPステータス 400番台（429以外）

```typescript
const client = new BytePlusClient({
  apiKey: process.env.BYTEPLUS_API_KEY!,
  endpoint: process.env.BYTEPLUS_ENDPOINT!,
  retryAttempts: 3,    // 最大リトライ回数
  timeout: 30000       // タイムアウト（ミリ秒）
});

// 自動リトライが実行される
const result = await client.generateImage({
  model: 'seedream-4-0-250828',
  prompt: 'test'
});
```

---

## ベストプラクティス

### 1. プロンプト作成

**推奨されるプロンプト構造:**

```
[主題] + [スタイル] + [詳細] + [品質指定]
```

**良い例:**

```typescript
const goodPrompt = `
A professional product photo of a luxury leather handbag,
studio lighting with soft shadows,
white seamless background,
highly detailed texture,
4K resolution,
commercial photography style,
sharp focus
`;
```

**悪い例:**

```typescript
const badPrompt = "a bag";  // 曖昧すぎる
```

### 2. 画像サイズ選択

| サイズ | 解像度 | 用途 | 生成時間 |
|--------|--------|------|----------|
| **1K** | 1024×1024 | プレビュー、テスト | 最速 |
| **2K** | 2048×2048 | 一般的な用途、SNS投稿 | 標準 |
| **4K** | 4096×4096 | 印刷、高品質出力 | 最遅 |

### 3. シード値の活用

同じ結果を再現したい場合はシード値を指定：

```typescript
// 初回生成
const result1 = await client.generateImage({
  model: 'seedream-4-0-250828',
  prompt: 'sunset landscape',
  size: '2K'
});

const seed = result1.seed;  // シード値を保存

// 同じ結果を再生成
const result2 = await client.generateImage({
  model: 'seedream-4-0-250828',
  prompt: 'sunset landscape',
  size: '2K',
  seed: seed  // 同じシード値を使用
});
```

### 4. ウォーターマーク設定

| 用途 | 推奨設定 |
|------|----------|
| 商用利用、最終出力 | `watermark: false` |
| テスト、プレビュー | `watermark: true` |

### 5. バッチ処理の最適化

大量画像生成時は `batchGenerate()` を使用：

```typescript
// ❌ 非効率（逐次処理）
for (const prompt of prompts) {
  await client.generateImage({ model: 'seedream-4-0-250828', prompt });
}

// ✅ 効率的（並列処理）
const result = await client.batchGenerate({
  prompts: prompts,
  sharedParams: { model: 'seedream-4-0-250828', size: '2K' },
  maxConcurrency: 10
});
```

### 6. デバッグモード

開発時はデバッグモードを有効化：

```typescript
const client = new BytePlusClient({
  apiKey: process.env.BYTEPLUS_API_KEY!,
  endpoint: process.env.BYTEPLUS_ENDPOINT!,
  debug: true  // 詳細ログを出力
});
```

### 7. タイムアウト設定

長時間処理が予想される場合はタイムアウトを調整：

```typescript
const client = new BytePlusClient({
  apiKey: process.env.BYTEPLUS_API_KEY!,
  endpoint: process.env.BYTEPLUS_ENDPOINT!,
  timeout: 60000  // 60秒（デフォルトは30秒）
});
```

---

## コード例

### 完全なワークフロー例

```typescript
import { BytePlusAI } from './api/byteplus-ai.js';

async function completeWorkflow() {
  const ai = new BytePlusAI({
    apiKey: process.env.BYTEPLUS_API_KEY!,
    endpoint: process.env.BYTEPLUS_ENDPOINT!,
    debug: true
  });

  try {
    // 1. プロンプト最適化付き画像生成（T2I）
    console.log('ステップ1: 高品質画像生成');
    const imageResult = await ai.generateImage(
      {
        model: 'seedream-4-0-250828',
        prompt: 'epic fantasy landscape',
        size: '2K'
      },
      {
        optimizePrompt: true,
        optimizerModel: 'DeepSeek-R1-250528'
      }
    );

    console.log(`✅ 画像生成完了: ${imageResult.data[0].url}`);

    // 2. 画像編集（I2I）
    console.log('ステップ2: 画像編集');
    const editResult = await ai.generateImage(
      {
        model: 'Bytedance-SeedEdit-3.0-i2i',
        prompt: 'add dramatic sunset lighting',
        image: [imageResult.data[0].url],
        size: '2K'
      },
      { optimizePrompt: true }
    );

    console.log(`✅ 編集完了: ${editResult.data[0].url}`);

    // 3. 動画生成（I2V）
    console.log('ステップ3: 動画生成');
    const videoResult = await ai.generateVideo({
      model: 'Bytedance-Seedance-1.0-pro',
      image: editResult.data[0].url,
      prompt: 'cinematic camera movement',
      resolution: '1080P',
      ratio: '16:9',
      duration: 5,
      fixed_lens: false
    });

    console.log(`✅ 動画生成完了: ${videoResult.data[0].url}`);
    console.log(`   サムネイル: ${videoResult.data[0].thumbnail_url}`);

    // 4. ストーリー生成（連続画像）
    console.log('ステップ4: ストーリー生成');
    const storyImages = await ai.generateStory(
      'A knight\'s quest: castle departure → forest battle → dragon confrontation',
      3,
      {
        model: 'seedream-4-0-250828',
        size: '2K',
        watermark: false
      }
    );

    storyImages.forEach((img, i) => {
      console.log(`✅ シーン ${i + 1}: ${img.data[0].url}`);
    });

    console.log('\n🎉 全ワークフロー完了！');

  } catch (error) {
    console.error('❌ エラー発生:', error);
  }
}

completeWorkflow();
```

### バッチ処理例

```typescript
import { BytePlusClient } from './api/byteplus-client.js';

async function batchImageGeneration() {
  const client = new BytePlusClient({
    apiKey: process.env.BYTEPLUS_API_KEY!,
    endpoint: process.env.BYTEPLUS_ENDPOINT!
  });

  const prompts = [
    'A serene mountain landscape at dawn',
    'A bustling cyberpunk city street at night',
    'An underwater coral reef ecosystem',
    'A cozy coffee shop interior with warm lighting',
    'A futuristic space station orbiting Earth'
  ];

  console.log(`${prompts.length}枚の画像をバッチ生成開始...`);

  const result = await client.batchGenerate({
    prompts,
    sharedParams: {
      model: 'seedream-4-0-250828',
      size: '2K',
      watermark: false
    },
    maxConcurrency: 5
  });

  console.log(`\n成功: ${result.successful.length}/${prompts.length}`);
  console.log(`失敗: ${result.failed.length}/${prompts.length}`);
  console.log(`成功率: ${(result.successRate * 100).toFixed(1)}%`);
  console.log(`総処理時間: ${(result.totalTime / 1000).toFixed(1)}秒`);

  // 成功した画像を保存
  result.successful.forEach((response, i) => {
    console.log(`画像 ${i + 1}: ${response.data[0].url}`);
  });

  // 失敗を報告
  if (result.failed.length > 0) {
    console.log('\n❌ 失敗した生成:');
    result.failed.forEach(failure => {
      console.log(`  - "${failure.prompt}": ${failure.error}`);
    });
  }
}

batchImageGeneration();
```

### エラーリカバリー例

```typescript
import { BytePlusClient, BytePlusAPIError } from './api/byteplus-client.js';

async function robustImageGeneration(prompt: string) {
  const client = new BytePlusClient({
    apiKey: process.env.BYTEPLUS_API_KEY!,
    endpoint: process.env.BYTEPLUS_ENDPOINT!,
    retryAttempts: 3
  });

  let attempts = 0;
  const maxAttempts = 5;

  while (attempts < maxAttempts) {
    try {
      attempts++;
      console.log(`試行 ${attempts}/${maxAttempts}...`);

      const result = await client.generateImage({
        model: 'seedream-4-0-250828',
        prompt,
        size: '2K'
      });

      console.log('✅ 成功:', result.data[0].url);
      return result;

    } catch (error) {
      if (error instanceof BytePlusAPIError) {
        if (error.statusCode === 400) {
          // パラメータエラー - リトライ不要
          console.error('❌ パラメータエラー（リトライ中止）:', error.message);
          throw error;
        } else if (error.statusCode === 429) {
          // レート制限 - 長めに待機
          console.log('⏳ レート制限、60秒待機...');
          await new Promise(resolve => setTimeout(resolve, 60000));
        } else {
          // その他のエラー - 短めに待機
          console.log(`⚠️ エラー（${error.statusCode}）、再試行...`);
          await new Promise(resolve => setTimeout(resolve, 5000));
        }
      } else {
        console.error('❌ 予期しないエラー:', error);
        throw error;
      }
    }
  }

  throw new Error(`${maxAttempts}回の試行後も失敗しました`);
}

robustImageGeneration('a beautiful landscape');
```

---

## 参考情報

### 関連ファイル

| ファイル | 説明 |
|---------|------|
| `src/types/byteplus.ts` | TypeScript型定義 |
| `src/api/byteplus-client.ts` | BytePlus APIクライアント |
| `src/api/byteplus-ai.ts` | 統合クライアント（自動最適化付き） |
| `src/services/prompt-optimizer.ts` | プロンプト最適化サービス |
| `src/services/prompt-chain.ts` | マルチステッププロンプトチェーン |
| `tests/unit/byteplus-client.test.ts` | 包括的ユニットテスト |

### 環境変数テンプレート

```bash
# .env
BYTEPLUS_API_KEY=bp_xxxxxxxxxxxxxxxxxxxxx
BYTEPLUS_ENDPOINT=https://ark.ap-southeast.bytepluses.com/api/v3
```

### トラブルシューティング

| 問題 | 解決方法 |
|------|----------|
| 認証エラー | `BYTEPLUS_API_KEY`を確認 |
| レート制限エラー | RateLimiterが自動調整、待機時間を確認 |
| タイムアウト | `timeout`を増やす（60000ms推奨） |
| 画像品質が低い | プロンプト最適化を使用、`size: '2K'`に設定 |
| 動画が生成されない | ソース画像の品質を確認、`fixed_lens`を調整 |

---

## Python SDK

BytePlusの公式Python SDKを使用した実装例です。

### インストール

```bash
pip install --upgrade 'byteplus-python-sdk-v2'
```

### 基本設定

```python
import os
from byteplussdkarkruntime import Ark

# APIキーを環境変数から読み込み
client = Ark(
    # サービスロケーションに応じてbase_urlを設定
    base_url="https://ark.cn-beijing.volces.com/api/v3",
    # 環境変数からAPIキーを取得
    api_key=os.environ.get("ARK_API_KEY")
)
```

### Vision API（マルチモーダル）

```python
# 画像理解・質問応答
response = client.chat.completions.create(
    model="seed-1-6-250915",
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "image_url",
                    "image_url": {
                        "url": "https://ark-doc.tos-ap-southeast-1.bytepluses.com/see_i2v.jpeg"
                    }
                },
                {
                    "type": "text",
                    "text": "Where is this？"
                }
            ]
        }
    ]
)

print(response.choices[0].message.content)
```

### テキスト生成（プロンプト最適化）

```python
# DeepSeek-R1でプロンプト最適化
response = client.chat.completions.create(
    model="DeepSeek-R1-250528",
    messages=[
        {
            "role": "system",
            "content": "You are a prompt optimization expert for image generation AI."
        },
        {
            "role": "user",
            "content": "Optimize this prompt for high-quality image generation: 'a cat on a windowsill'"
        }
    ],
    max_tokens=2048,
    temperature=0.7
)

optimized_prompt = response.choices[0].message.content
print(f"最適化されたプロンプト: {optimized_prompt}")
```

### 画像生成（T2I）

**注意:** Python SDKでの画像生成APIの直接サポートは未確認です。REST APIを使用することを推奨します。

```python
import requests
import json

# REST API経由での画像生成
def generate_image(api_key, endpoint, prompt):
    url = f"{endpoint}/images/generations"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "seedream-4-0-250828",
        "prompt": prompt,
        "size": "2K",
        "watermark": False
    }

    response = requests.post(url, headers=headers, json=payload)
    response.raise_for_status()
    return response.json()

# 使用例
result = generate_image(
    api_key=os.environ.get("ARK_API_KEY"),
    endpoint="https://ark.ap-southeast.bytepluses.com/api/v3",
    prompt="A beautiful sunset over mountains"
)

print(f"生成画像URL: {result['data'][0]['url']}")
```

### エンドポイントリージョン

| リージョン | Base URL | 推奨地域 |
|-----------|----------|---------|
| **中国（北京）** | `https://ark.cn-beijing.volces.com/api/v3` | 中国本土 |
| **東南アジア** | `https://ark.ap-southeast.bytepluses.com/api/v3` | 日本、APAC |

### エラーハンドリング

```python
from byteplussdkarkruntime import Ark
from byteplussdkarkruntime.exceptions import ArkAPIError

client = Ark(
    base_url="https://ark.cn-beijing.volces.com/api/v3",
    api_key=os.environ.get("ARK_API_KEY")
)

try:
    response = client.chat.completions.create(
        model="seed-1-6-250915",
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "image_url", "image_url": {"url": image_url}},
                    {"type": "text", "text": "この画像を分析してください"}
                ]
            }
        ]
    )

    print(response.choices[0].message.content)

except ArkAPIError as e:
    print(f"APIエラー: {e}")
except Exception as e:
    print(f"予期しないエラー: {e}")
```

### 環境変数設定

```bash
# .env ファイル
ARK_API_KEY=your_byteplus_api_key_here
```

### TypeScriptとの比較

| 機能 | TypeScript (このプロジェクト) | Python SDK |
|------|------------------------------|------------|
| **テキスト生成** | ✅ TextGenerationClient | ✅ client.chat.completions.create() |
| **Vision API** | ✅ マルチモーダルサポート | ✅ ネイティブサポート |
| **画像生成 (T2I)** | ✅ BytePlusClient.generateImage() | ⚠️ REST API推奨 |
| **画像編集 (I2I)** | ✅ フルサポート | ⚠️ REST API推奨 |
| **動画生成 (I2V)** | ✅ BytePlusClient.generateVideo() | ⚠️ REST API推奨 |
| **プロンプト最適化** | ✅ PromptOptimizer, PromptChain | ✅ LLMで実装可能 |
| **バッチ処理** | ✅ batchGenerate() | ⚠️ 手動実装 |
| **レート制限** | ✅ 自動管理 | ⚠️ 手動実装 |
| **リトライロジック** | ✅ Exponential Backoff | ⚠️ 手動実装 |

**推奨:** 画像・動画生成にはTypeScript実装（BytePlusClient）を使用し、Vision APIやテキスト生成にはPython SDKを活用することで、両者の長所を活かせます。

---

**Document Version:** 1.0
**Last Updated:** 2025-10-09
**Maintained by:** test_miyabi (Byteflow) Project
