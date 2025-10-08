# test_miyabi - Claude Code Context

## プロジェクト概要

**test_miyabi (Byteflow)** - BytePlus画像生成APIプラットフォーム

BytePlus APIの強力な画像・動画生成機能（SEEDDREAM、SEEDDREAM4、SEEDDANCE）を活用し、創造的なビジュアルコンテンツ制作を民主化する次世代AIプラットフォームです。Miyabiフレームワークと識学理論(Shikigaku Theory)に基づく7つの自律型AI Agentsで運用されています。

詳細は[PROJECT_DEFINITION.md](./PROJECT_DEFINITION.md)を参照してください。

## 🌸 Miyabi Framework

### 7つの自律エージェント

1. **CoordinatorAgent** - タスク統括・並列実行制御
   - DAG（Directed Acyclic Graph）ベースのタスク分解
   - Critical Path特定と並列実行最適化

2. **IssueAgent** - Issue分析・ラベル管理
   - 識学理論65ラベル体系による自動分類
   - タスク複雑度推定（小/中/大/特大）

3. **CodeGenAgent** - AI駆動コード生成
   - Claude Sonnet 4による高品質コード生成
   - TypeScript strict mode完全対応

4. **ReviewAgent** - コード品質判定
   - 静的解析・セキュリティスキャン
   - 品質スコアリング（100点満点、80点以上で合格）

5. **PRAgent** - Pull Request自動作成
   - Conventional Commits準拠
   - Draft PR自動生成

6. **DeploymentAgent** - CI/CDデプロイ自動化
   - 自動デプロイ・ヘルスチェック
   - 自動Rollback機能

7. **TestAgent** - テスト自動実行
   - テスト実行・カバレッジレポート
   - 80%+カバレッジ目標

## GitHub OS Integration

このプロジェクトは「GitHubをOSとして扱う」設計思想で構築されています:

### 自動化されたワークフロー

1. **Issue作成** → IssueAgentが自動ラベル分類
2. **CoordinatorAgent** → タスクをDAG分解、並列実行プラン作成
3. **CodeGenAgent** → コード実装、テスト生成
4. **ReviewAgent** → 品質チェック（80点以上で次へ）
5. **TestAgent** → テスト実行（カバレッジ確認）
6. **PRAgent** → Draft PR作成
7. **DeploymentAgent** → マージ後に自動デプロイ

**全工程が自律実行、人間の介入は最小限。**

## ラベル体系（識学理論準拠）

### 10カテゴリー、53ラベル

- **type:** bug, feature, refactor, docs, test, chore, security
- **priority:** P0-Critical, P1-High, P2-Medium, P3-Low
- **state:** pending, analyzing, implementing, reviewing, testing, deploying, done
- **agent:** codegen, review, deployment, test, coordinator, issue, pr
- **complexity:** small, medium, large, xlarge
- **phase:** planning, design, implementation, testing, deployment
- **impact:** breaking, major, minor, patch
- **category:** frontend, backend, infra, dx, security
- **effort:** 1h, 4h, 1d, 3d, 1w, 2w
- **blocked:** waiting-review, waiting-deployment, waiting-feedback

## 開発ガイドライン

### TypeScript設定

```json
{
  "compilerOptions": {
    "strict": true,
    "module": "ESNext",
    "target": "ES2022"
  }
}
```

### セキュリティ

- **機密情報は環境変数で管理**: `GITHUB_TOKEN`, `ANTHROPIC_API_KEY`
- **.env を .gitignore に含める**
- **Webhook検証**: HMAC-SHA256署名検証

### テスト

```bash
npm test                    # 全テスト実行
npm run test:watch          # Watch mode
npm run test:coverage       # カバレッジレポート
```

目標: 80%+ カバレッジ

## 使用方法

### Issue作成（Claude Code推奨）

```bash
# Claude Code から直接実行
gh issue create --title "機能追加: ユーザー認証" --body "JWT認証を実装"
```

または Claude Code のスラッシュコマンド:

```
/create-issue
```

### 状態確認

```bash
npx miyabi status          # 現在の状態
npx miyabi status --watch  # リアルタイム監視
```

### Agent実行

```bash
/agent-run                 # Claude Code から実行
```

## プロジェクト構造

```
test_miyabi/
├── .claude/               # Claude Code設定
│   ├── agents/           # Agent定義
│   ├── commands/         # カスタムコマンド
│   └── settings.json     # Claude設定
├── .github/
│   └── workflows/        # 26+ GitHub Actions
├── src/                  # ソースコード
├── tests/                # テストコード
├── CLAUDE.md             # このファイル
└── package.json
```

## カスタムスラッシュコマンド

Claude Code で以下のコマンドが使用可能:

- `/test` - プロジェクト全体のテストを実行
- `/generate-docs` - コードからドキュメント自動生成
- `/create-issue` - Agent実行用Issueを対話的に作成
- `/deploy` - デプロイ実行
- `/verify` - システム動作確認（環境・コンパイル・テスト）
- `/security-scan` - セキュリティ脆弱性スキャン実行
- `/agent-run` - Autonomous Agent実行（Issue自動処理パイプライン）

## 識学理論（Shikigaku Theory）5原則

1. **責任の明確化** - 各AgentがIssueに対する責任を負う
2. **権限の委譲** - Agentは自律的に判断・実行可能
3. **階層の設計** - CoordinatorAgent → 各専門Agent
4. **結果の評価** - 品質スコア、カバレッジ、実行時間で評価
5. **曖昧性の排除** - DAGによる依存関係明示、状態ラベルで進捗可視化

## 環境変数

```bash
# GitHub Personal Access Token（必須）
GITHUB_TOKEN=ghp_xxxxx

# Anthropic API Key（必須 - Agent実行時）
ANTHROPIC_API_KEY=sk-ant-xxxxx

# BytePlus API Key（必須 - Byteflow機能）
BYTEPLUS_API_KEY=bp_xxxxx

# BytePlus API Endpoint (v3 base URL)
# Client appends paths: /images/generations, /videos/generations, /chat/completions
BYTEPLUS_ENDPOINT=https://ark.ap-southeast.bytepluses.com/api/v3
```

## Byteflow開発ガイドライン

### 🤖 プロンプト最適化（T2T: Text-to-Text）

BytePlusのテキスト生成AI（DeepSeek-R1、Skylark-pro）を使用して、画像・動画生成用の高品質プロンプトを自動生成できます。

#### 統合クライアント（推奨）

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
    prompt: 'a beautiful sunset', // シンプルな入力
    size: '2K'
  },
  { optimizePrompt: true } // 自動最適化
);

// AIが "a beautiful sunset" を詳細な高品質プロンプトに変換
console.log(`Generated: ${result.data[0].url}`);
```

#### プロンプトチェーン（最高品質）

複数ステップで段階的にプロンプトを改善：

```typescript
// マルチステップ最適化
const result = await ai.generateImage(
  {
    model: 'seedream-4-0-250828',
    prompt: 'sunset landscape',
    size: '2K'
  },
  { useChain: true } // プロンプトチェーン使用
);

// 3ステップで最適化:
// 1. コンセプト拡張
// 2. 技術的詳細追加
// 3. 最終磨き上げ
```

#### ストーリー生成（連続画像）

一貫性のある複数画像を自動生成：

```typescript
const images = await ai.generateStory(
  'A hero\'s journey: village → forest → castle',
  3, // 3枚の画像
  {
    model: 'seedream-4-0-250828',
    size: '2K',
    watermark: false
  }
);

// AIがストーリーを3つのシーンに分解し、
// 各シーンに最適化されたプロンプトで画像生成
images.forEach((img, i) => {
  console.log(`Scene ${i + 1}: ${img.data[0].url}`);
});
```

#### 手動プロンプト最適化

```typescript
import { PromptOptimizer } from './services/prompt-optimizer.js';

const optimizer = new PromptOptimizer({
  apiKey: process.env.BYTEPLUS_API_KEY!,
  endpoint: process.env.BYTEPLUS_ENDPOINT!
});

// 画像生成用プロンプト最適化
const t2iPrompt = await optimizer.optimizeForImage(
  'a cat on a windowsill',
  'photorealistic'
);

// 画像編集用プロンプト最適化
const i2iPrompt = await optimizer.optimizeForImageEdit(
  'add rainbow in sky'
);

// 動画生成用プロンプト最適化
const i2vPrompt = await optimizer.optimizeForVideo(
  'smooth camera pan left'
);

console.log('Optimized prompts:', { t2iPrompt, i2iPrompt, i2vPrompt });
```

#### カスタムプロンプトチェーン

```typescript
import { PromptChain } from './services/prompt-chain.js';

const chain = new PromptChain({
  apiKey: process.env.BYTEPLUS_API_KEY!,
  endpoint: process.env.BYTEPLUS_ENDPOINT!
});

// カスタムチェーン定義
const result = await chain.execute(
  'cyberpunk city',
  [
    {
      name: 'Style Analysis',
      systemPrompt: 'Analyze and expand the cyberpunk aesthetic',
      temperature: 0.8
    },
    {
      name: 'Technical Details',
      systemPrompt: 'Add lighting, composition, camera details',
      temperature: 0.6
    },
    {
      name: 'Final Polish',
      systemPrompt: 'Refine for maximum quality',
      temperature: 0.5
    }
  ]
);

console.log('Final prompt:', result.finalPrompt);
console.log('Tokens used:', result.totalTokens);
console.log('Steps:', result.steps.map(s => s.name));
```

### BytePlus API使用方法

#### Text-to-Image（SEEDREAM4）

```typescript
import { BytePlusClient } from './api/byteplus-client.js';

const client = new BytePlusClient({
  apiKey: process.env.BYTEPLUS_API_KEY!,
  endpoint: process.env.BYTEPLUS_ENDPOINT!
});

// 基本的な画像生成（t2i）
const result = await client.generateImage({
  model: 'seedream-4-0-250828',
  prompt: 'A beautiful sunset over mountains, photorealistic style',
  size: '2K',
  response_format: 'url',
  watermark: true,
  seed: 42
});

console.log(`Generated image: ${result.data[0].url}`);
```

#### Image-to-Image（SEEDEDIT i2i）

```typescript
// 画像編集（i2i）
const result = await client.generateImage({
  model: 'Bytedance-SeedEdit-3.0-i2i',
  prompt: 'Add a rainbow in the sky, enhance colors',
  image: ['https://example.com/source-image.jpg'],
  size: '2K',
  response_format: 'url'
});

console.log(`Edited image: ${result.data[0].url}`);
```

#### Sequential Image Generation（連続生成）

```typescript
// 複数画像の連続生成
const result = await client.generateImage({
  model: 'seedream-4-0-250828',
  prompt: 'Generate 3 images of a girl and a cow plushie happily riding a roller coaster',
  image: ['https://example.com/ref1.png', 'https://example.com/ref2.png'],
  sequential_image_generation: 'auto',
  sequential_image_generation_options: {
    max_images: 3
  },
  size: '2K',
  stream: true,
  watermark: true
});

result.data.forEach((img, i) => {
  console.log(`Image ${i + 1}: ${img.url}`);
});
```

#### Image-to-Video（AI動画生成）

```typescript
// 画像から動画を生成（i2v）
const video = await client.generateVideo({
  model: 'Bytedance-Seedance-1.0-pro',
  image: 'https://example.com/source-image.jpg',
  prompt: 'Dynamic camera movement, cinematic style, smooth motion',
  resolution: '1080P',
  ratio: '16:9',
  duration: 5,
  quantity: 1,
  fixed_lens: false, // カメラを動的に移動
  watermark: true,
  seed: 42
});

console.log(`Generated video: ${video.data[0].url}`);
console.log(`Thumbnail: ${video.data[0].thumbnail_url}`);
```

#### 固定カメラでの動画生成

```typescript
// 固定カメラ（フレーミング固定）
const video = await client.generateVideo({
  model: 'Bytedance-Seedance-1.0-pro',
  image: 'https://example.com/product.jpg',
  prompt: 'Product showcase, professional lighting',
  resolution: '1080P',
  ratio: '1:1',
  duration: 10,
  fixed_lens: true, // カメラ固定
  watermark: false
});
```

### モデル選択ガイドライン

| 用途 | 推奨モデル | パラメータ | 理由 |
|------|-----------|-----------|------|
| **画像生成** ||||
| 新規画像生成 | seedream-4-0-250828 | t2i | 最高品質、テキストから画像 |
| 画像編集・修正 | Bytedance-SeedEdit-3.0-i2i | i2i | 既存画像の編集・加工 |
| 連続ストーリー | sequential_image_generation | max_images: 3-10 | 一貫性のある複数画像 |
| 大量生成 | batchGenerate() | maxConcurrency: 10 | コスト効率重視 |
| **動画生成** ||||
| AI動画生成 | Bytedance-Seedance-1.0-pro | i2v | 画像から動画生成 |
| 固定カメラ動画 | Bytedance-Seedance-1.0-pro | fixed_lens: true | 商品紹介、静的シーン |
| **プロンプト最適化** ||||
| 高度な推論 | DeepSeek-R1-250528 | T2T | 詳細分析、複雑なプロンプト |
| 高速生成 | Skylark-pro-250415 | T2T | BytePlus最適化、低レイテンシ |
| プロンプトチェーン | 3ステップ最適化 | useChain: true | 最高品質プロンプト |

### T2Tモデルの使い分け

**DeepSeek-R1-250528**:
- 高度な推論能力
- 複雑なコンセプトの展開
- 詳細なプロンプト生成
- 無料枠: 500,000 tokens

**Skylark-pro-250415**:
- BytePlus最適化モデル
- 低レイテンシ
- シンプルなプロンプト最適化
- アジア太平洋地域で高速

### エラーハンドリング

```typescript
import { BytePlusAPIError } from './api/byteplus-client.js';

try {
  const result = await client.generateImage({
    model: 'seedream-4-0-250828',
    prompt: 'test',
    size: '2K'
  });
} catch (error) {
  if (error instanceof BytePlusAPIError) {
    if (error.statusCode === 429) {
      // レート制限エラー: 自動リトライ（内部で実行済み）
      console.error('Rate limit exceeded');
    } else if (error.statusCode === 400) {
      // 不正なリクエスト: パラメータ確認
      console.error('Invalid request parameters');
    } else if (error.statusCode === 401) {
      // 認証エラー: APIキー確認
      console.error('Invalid API key or endpoint');
    }
  }
  throw error;
}
```

### プロンプトベストプラクティス

#### 高品質プロンプト例（t2i）

```typescript
const goodPrompt = `
A professional product photo of a luxury leather handbag,
studio lighting, white background, high detail, 4K resolution,
commercial photography style
`;

// NG例: 曖昧すぎる
const badPrompt = "a bag";

// 使用例
const result = await client.generateImage({
  model: 'seedream-4-0-250828',
  prompt: goodPrompt,
  size: '2K',
  watermark: false // 商品写真では透かしを無効化
});
```

#### 画像編集プロンプト例（i2i）

```typescript
// 既存画像を編集する場合
const editPrompt = `
Add vibrant sunset lighting, enhance colors,
add soft glow effect, professional photo editing
`;

const result = await client.generateImage({
  model: 'Bytedance-SeedEdit-3.0-i2i',
  prompt: editPrompt,
  image: ['https://example.com/original.jpg'],
  size: '2K'
});
```

### Agent連携パターン

#### CodeGenAgent → BytePlus統合

```typescript
class ImageGenAgent extends BaseAgent {
  async execute(task: Task): Promise<AgentResult> {
    this.log('Generating image with BytePlus API');

    // Claude Sonnet 4でプロンプト最適化
    const optimizedPrompt = await this.optimizePrompt(task.data.description);

    // BytePlus APIで画像生成
    const result = await this.byteplusClient.generateImage('seeddream4', {
      prompt: optimizedPrompt,
      width: 1024,
      height: 1024
    });

    // ReviewAgentで品質検証
    const qualityScore = await this.reviewAgent.evaluateImage(result.imageUrl);

    if (qualityScore < 80) {
      this.log('Quality too low, regenerating...');
      return this.execute(task); // 再生成
    }

    return {
      status: 'success',
      data: result,
      metrics: {
        qualityScore,
        generationTime: result.metadata.generationTime
      }
    };
  }
}
```

### 制約事項

- **レート制限**: 10リクエスト/秒（RateLimiterで自動制御）
- **最大画像サイズ**: 4096x4096px
- **同時実行数**: 最大10並列（CoordinatorAgentで制御）
- **タイムアウト**: 30秒/リクエスト
- **再試行**: 最大3回（Exponential Backoff）

## サポート

- **Framework**: [Miyabi](https://github.com/ShunsukeHayashi/Autonomous-Operations)
- **Documentation**: README.md
- **Issues**: GitHub Issues で管理

---

🌸 **Miyabi** - Beauty in Autonomous Development

*このファイルは Claude Code が自動的に参照します。プロジェクトの変更に応じて更新してください。*
