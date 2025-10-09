# VideoAgent - AI動画生成自動化エージェント

**役割**: BytePlus APIを使用した高品質動画の自動生成・編集

## 🎯 主な機能

### 1. 画像生成 (Text-to-Image)
- **モデル**: seedream-4-0-250828
- **解像度**: 1K / 2K / 4K
- **フォーマット**: 9:16 (縦型) / 16:9 (横型)

### 2. 画像編集 (Image-to-Image)
- **モデル**: seededit-3-0-i2i-250628
- **編集内容**: 表情強調、ライティング改善、ディテール向上
- **adaptive size対応**

### 3. 動画生成 (Image-to-Video)
- **モデル**: seedance-1-0-lite-i2v-250428
- **長さ**: 5秒 (固定)
- **解像度**: 720p / 1080p
- **アスペクト比**: 9:16 / 16:9 / 1:1

### 4. バッチ処理
- 複数シーンの並列生成
- レート制限自動制御 (10req/sec)
- エラーハンドリング・リトライ機能

## 📋 使用方法

### 基本的な動画生成

```typescript
// エージェント実行
const videoAgent = new VideoAgent({
  apiKey: process.env.BYTEPLUS_API_KEY,
  endpoint: process.env.BYTEPLUS_ENDPOINT
});

// シナリオ定義
const scenario = {
  title: "商品紹介動画",
  scenes: [
    {
      id: 1,
      description: "商品全体像",
      prompt: "Professional product photography, white background, high detail",
      duration: 5
    },
    {
      id: 2,
      description: "ディテールクローズアップ",
      prompt: "Close-up of product details, macro photography, high quality",
      duration: 5
    }
  ]
};

// 実行
await videoAgent.generateScenario(scenario);
```

## 🔧 設定可能なパラメータ

### 画像生成
- `model`: seedream-4-0-250828
- `prompt`: テキストプロンプト (2000文字以内)
- `size`: 1K / 2K / 4K
- `watermark`: true / false
- `seed`: 再現性のための乱数シード

### 画像編集 (i2i)
- `model`: seededit-3-0-i2i-250628
- `image`: 元画像URL
- `prompt`: 編集指示
- `size`: adaptive (推奨)
- `guidance_scale`: 5.5 (推奨)

### 動画生成 (i2v)
- `model`: seedance-1-0-lite-i2v-250428
- `image`: 元画像URL
- `prompt`: モーション指示
- `duration`: 5 (固定)
- `ratio`: 9:16 / 16:9 / 1:1
- `resolution`: 720p / 1080p
- `camerafixed`: true / false

## 📊 ワークフロー

```
1. シナリオ分析
   ↓
2. シーンごとの画像生成 (t2i)
   ↓
3. 画像編集・微調整 (i2i) ※オプション
   ↓
4. 動画生成 (i2v)
   ↓
5. ダウンロード・保存
   ↓
6. メタデータ生成
   ↓
7. 結合スクリプト作成
```

## 🎨 プロンプト設計ガイドライン

### 高品質画像生成のコツ
- **具体的な描写**: "professional photography, high detail, 4K quality"
- **ライティング**: "natural daylight", "studio lighting", "warm atmosphere"
- **カメラアングル**: "medium close-up", "wide shot", "overhead view"
- **スタイル指定**: "photorealistic", "cinematic", "minimalist"

### i2i編集のコツ
- **改善指示**: "Enhance facial expression", "Improve lighting"
- **追加要素**: "Add soft glow effect", "Make colors more vibrant"
- **維持指示**: "Keep composition", "Preserve original style"

### i2v動画生成のコツ
- **モーション指示**: "Smooth camera pan", "Subtle head movement"
- **表情変化**: "Expression transitions from serious to smiling"
- **カメラワーク**: "Dynamic camera movement", "Fixed lens for stability"

## ⚠️ 制約事項

- **レート制限**: 10リクエスト/秒 (自動制御)
- **動画長さ**: 5秒固定 (i2vモデル)
- **最大並列数**: 10タスク同時実行
- **タイムアウト**: 180秒/動画

## 🔄 エラーハンドリング

- **429 (Rate Limit)**: 自動リトライ (Exponential Backoff)
- **500 (Server Error)**: 最大3回リトライ
- **400 (Bad Request)**: パラメータ検証・修正提案
- **タイムアウト**: 進行状況をログ保存して報告

## 📁 出力構造

```
project-name/
├── images/
│   ├── raw/           # 生成画像
│   └── edited/        # i2i編集済み
├── videos/            # 各シーン動画
├── final/             # 結合済み最終動画
├── metadata.json      # 全データ情報
└── concat_videos.sh   # 結合スクリプト
```

## 🚀 高度な使用例

### マルチシーンストーリー生成

```typescript
const story = {
  title: "Product Journey",
  totalDuration: 20, // 秒
  scenes: [
    { timing: "0-5s", description: "Introduction", ...},
    { timing: "5-10s", description: "Features", ...},
    { timing: "10-15s", description: "Benefits", ...},
    { timing: "15-20s", description: "Call-to-action", ...}
  ]
};

await videoAgent.generateStory(story);
```

### A/Bテスト用バリエーション生成

```typescript
const variations = {
  basePrompt: "Professional product shot",
  variations: [
    { style: "minimalist white background" },
    { style: "lifestyle setting with props" },
    { style: "dark moody atmosphere" }
  ]
};

await videoAgent.generateVariations(variations);
```

## 📚 参考資料

- [BytePlus API Documentation](https://www.bytepluses.com/docs)
- [CLAUDE.md - Byteflow開発ガイドライン](../CLAUDE.md)
- [プロンプトエンジニアリングベストプラクティス](./prompt-best-practices.md)

---

**作成者**: test_miyabi (Byteflow) Development Team
**最終更新**: 2025-10-09
