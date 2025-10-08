# Byteflow - BytePlus画像生成プラットフォーム

> 超リッチな画像・動画生成体験を、数行のコードで。

**Byteflow**は、BytePlus API（SEEDDREAM、SEEDDREAM4、SEEDDANCE）を活用した次世代AIビジュアルコンテンツ生成プラットフォームです。Miyabiフレームワークと7つの自律型AI Agentsにより、完全自動化された開発とデプロイを実現します。

## 主要機能

- **高品質画像生成**: SEEDDREAM/SEEDDREAM4による4K画像生成
- **動画生成**: SEEDDANCEによるダンス動画自動生成
- **自律開発**: 7つのAI Agentsが協調動作
- **TypeScript完全対応**: Strict mode + 型安全性100%
- **品質保証**: ReviewAgentによる自動品質検証（80点以上保証）

## クイックスタート

### インストール

```bash
# リポジトリクローン
git clone https://github.com/your-org/byteflow.git
cd byteflow

# 依存関係インストール
npm install

# 環境変数設定
cp .env.example .env
# .envを編集してAPIキーを設定
```

### 環境変数

```bash
GITHUB_TOKEN=ghp_xxxxx
ANTHROPIC_API_KEY=sk-ant-xxxxx
BYTEPLUS_API_KEY=bp_xxxxx
BYTEPLUS_ENDPOINT=https://api.byteplus.com/v1
```

### 基本的な使い方

```typescript
import { BytePlusClient } from './api/byteplus-client.js';

const client = new BytePlusClient({
  apiKey: process.env.BYTEPLUS_API_KEY!,
  endpoint: process.env.BYTEPLUS_ENDPOINT!
});

// 画像生成
const result = await client.generateImage('seeddream4', {
  prompt: 'A beautiful sunset over mountains, photorealistic',
  width: 1024,
  height: 1024,
  style: 'Photorealistic'
});

console.log(`Generated: ${result.imageUrl}`);
```

## アーキテクチャ

Byteflowは7つの自律型AI Agentsで構成されています：

| Agent | 責任 |
|-------|------|
| **CoordinatorAgent** | タスク分解・並列実行制御 |
| **IssueAgent** | 要件分析・複雑度推定 |
| **CodeGenAgent** | プロンプト最適化・コード生成 |
| **ReviewAgent** | 品質判定・再生成指示 |
| **PRAgent** | バージョン管理・PR作成 |
| **DeploymentAgent** | CDN配信・デプロイ |
| **TestAgent** | 統合テスト・負荷テスト |

## 開発ロードマップ

- [x] **Phase 1**: 基盤構築（Week 1-2）
  - [x] プロジェクト初期化
  - [ ] BytePlus API統合
  - [ ] TypeScript型定義作成
- [ ] **Phase 2**: コア機能実装（Week 3-5）
  - [ ] プロンプトテンプレートシステム
  - [ ] バッチ生成機能
  - [ ] 生成履歴管理
- [ ] **Phase 3**: 高度機能実装（Week 6-8）
  - [ ] スタイル転送パイプライン
  - [ ] 動画生成ワークフロー
  - [ ] A/Bテスト機能
- [ ] **Phase 4**: 最適化・スケーリング（Week 9-12）
  - [ ] 並列生成最適化
  - [ ] コスト最適化エンジン
  - [ ] リアルタイムストリーミング

## ドキュメント

- [PROJECT_DEFINITION.md](./PROJECT_DEFINITION.md) - 包括的なプロジェクト定義
- [CLAUDE.md](./CLAUDE.md) - Claude Code開発コンテキスト

## 技術スタック

- **言語**: TypeScript (strict mode)
- **ランタイム**: Node.js
- **Framework**: Miyabi Framework
- **AI Model**: Claude Sonnet 4
- **API**: BytePlus (SEEDDREAM/SEEDDREAM4/SEEDDANCE)
- **テスト**: Vitest
- **CI/CD**: GitHub Actions

## スラッシュコマンド

Claude Codeで以下のコマンドが使用可能：

- `/test` - プロジェクト全体のテストを実行
- `/generate-docs` - コードからドキュメント自動生成
- `/create-issue` - Agent実行用Issueを対話的に作成
- `/deploy` - デプロイ実行
- `/verify` - システム動作確認
- `/security-scan` - セキュリティ脆弱性スキャン
- `/agent-run` - Autonomous Agent実行

## コントリビューション

このプロジェクトは識学理論（Shikigaku Theory）に基づく自律開発プロジェクトです。コントリビューションは歓迎しますが、Agent駆動の開発フローに従ってください。

1. GitHub Issueを作成
2. IssueAgentによる自動ラベル分類を待つ
3. `/agent-run`でAgent実行開始
4. ReviewAgentの品質チェック合格を待つ
5. マージ

## ライセンス

MIT License

---

🌸 **Byteflow** - Beauty in AI-Powered Visual Creation

*Powered by Miyabi Framework | Built with Claude Code*
