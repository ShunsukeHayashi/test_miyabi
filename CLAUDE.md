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

# BytePlus API Endpoint
BYTEPLUS_ENDPOINT=https://api.byteplus.com/v1
```

## Byteflow開発ガイドライン

### BytePlus API使用方法

#### SEEDDREAM（高品質画像生成）

```typescript
import { BytePlusClient } from './api/byteplus-client.js';

const client = new BytePlusClient({
  apiKey: process.env.BYTEPLUS_API_KEY!,
  endpoint: process.env.BYTEPLUS_ENDPOINT!
});

// 基本的な画像生成
const result = await client.generateImage('seeddream', {
  prompt: 'A beautiful sunset over mountains, photorealistic style',
  negativePrompt: 'blurry, low quality, distorted',
  width: 1024,
  height: 1024,
  style: 'Photorealistic',
  seed: 42,
  guidanceScale: 7.5
});

console.log(`Generated image: ${result.imageUrl}`);
```

#### SEEDDREAM4（次世代モデル）

```typescript
// より高品質な画像生成
const result = await client.generateImage('seeddream4', {
  prompt: 'Futuristic cityscape with flying cars, cyberpunk aesthetic',
  width: 2048,
  height: 2048,
  style: '3D',
  guidanceScale: 8.0
});
```

#### SEEDDANCE（動画生成）

```typescript
// ダンス動画生成
const video = await client.generateDanceVideo(
  './source-image.png',
  'hip-hop'
);

console.log(`Generated video: ${video.videoUrl}`);
```

### モデル選択ガイドライン

| 用途 | 推奨モデル | 理由 |
|------|-----------|------|
| 商品画像 | SEEDDREAM | コスパ良好、高品質 |
| 芸術作品 | SEEDDREAM4 | 最高品質、複雑な表現 |
| 動画コンテンツ | SEEDDANCE | 動的コンテンツ専用 |
| 大量生成 | SEEDDREAM | コスト効率重視 |
| プロトタイプ | SEEDDREAM | 高速生成 |

### エラーハンドリング

```typescript
import { BytePlusAPIError } from './api/byteplus-client.js';

try {
  const result = await client.generateImage('seeddream', request);
} catch (error) {
  if (error instanceof BytePlusAPIError) {
    if (error.statusCode === 429) {
      // レート制限エラー: リトライ
      await exponentialBackoff();
      return retry();
    } else if (error.statusCode === 400) {
      // 不正なリクエスト: プロンプト修正
      console.error('Invalid prompt:', request.prompt);
    }
  }
  throw error;
}
```

### プロンプトベストプラクティス

#### 高品質プロンプト例

```typescript
const goodPrompt = `
A professional product photo of a luxury leather handbag,
studio lighting, white background, high detail, 4K resolution,
commercial photography style
`;

// NG例: 曖昧すぎる
const badPrompt = "a bag";
```

#### ネガティブプロンプト活用

```typescript
const negativePrompt = `
blurry, low quality, distorted, deformed, ugly,
bad anatomy, watermark, text, signature
`;
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
