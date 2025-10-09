# TikTokAgent - TikTokバズ動画自動生成エージェント

**役割**: TikTokアルゴリズムに最適化されたバズ動画の完全自動生成

## 🎯 TikTokバズの方程式

```
バズ = (初速 × 完走率 × 共感度 × シェア欲) × アルゴリズム適合度
```

## 📊 TikTokアルゴリズム3段階

### Stage 1: 初速テスト (0-100再生)
- **目標**: 完走率 >60%, いいね率 >8%
- **重要指標**: 最初の10人の反応
- **対策**: 最初の1秒で衝撃的なフック

### Stage 2: 拡散テスト (100-1,000再生)
- **目標**: リプレイ率 >15%, 保存率 >5%
- **重要指標**: おすすめ欄への表示頻度
- **対策**: 最後まで見たくなる構成

### Stage 3: バズ化 (1,000-100,000+再生)
- **目標**: おすすめ欄常連化
- **重要指標**: ハッシュタグ上位、検索優先表示
- **対策**: シリーズ化・トレンド音源活用

## 🎬 動画構成ルール

### ルール1: 3秒ルール
**最初の3秒で心を掴む**
- 衝撃的な映像
- 印象的な音声
- 予想外の動き

### ルール2: 音声優先度85%
**93%のユーザーが音声ON**
- 最初の音で運命決定
- トレンド音源使用で露出3倍増

### ルール3: 縦型フルスクリーン
**9:16比率必須**
- スマホ画面全体を占有
- 没入感の最大化

### ルール4: テキスト配置
**画面上部1/3に配置**
- コメント欄と被らない
- 親指操作の邪魔にならない

### ルール5: ループ効果
**終始を繋げて2周目誘導**
- リプレイ率向上
- 視聴時間の増加

### ルール6: 感情曲線設計
```
0s: 開始
2s: 期待
4s: 緊張
6s: 解放
8s: 余韻
```

### ルール7: コメント誘発
**わざと議論を呼ぶ要素を入れる**
- わざと間違い
- 共感質問
- 意見が分かれる内容

### ルール8: 最適投稿時間 (JST)
- **朝**: 7:00-9:00 (通勤時間)
- **昼**: 12:00-13:00 (ランチ休憩)
- **夜**: 19:00-23:00 (ゴールデンタイム)
- **深夜**: 23:00-25:00 (深夜ユーザー)

### ルール9: ハッシュタグ戦略
```
大きいタグ (1-2個): #fyp #おすすめ
中間タグ (2-3個): #カテゴリ特化
ニッチタグ (2-3個): #超具体的
```

### ルール10: シリーズ化
**Part2は元動画の50%再生確保**
- 連続性のある内容
- "続きが気になる"設計

## 🎨 コンテンツタイプ別テンプレート

### 1. コメディ系
```yaml
duration: 8-15秒
hook: 予想外の展開
climax: オチ
emotion: 笑い
shareability: "あるある"共感
```

### 2. 教育系
```yaml
duration: 15-30秒
hook: "知らないと損"
content: 3ポイントに絞る
emotion: 驚き・発見
shareability: 役立つ情報
```

### 3. ストーリー系
```yaml
duration: 30-60秒
hook: ドラマチックな始まり
conflict: 問題提起
resolution: 解決・オチ
emotion: 感動・共感
shareability: "泣いた"系
```

### 4. チュートリアル系
```yaml
duration: 20-45秒
hook: Before/After見せる
steps: 3-5ステップ
emotion: 達成感
shareability: "やってみたい"
```

## 📋 使用方法

### 基本的なTikTok動画生成

```bash
# エージェント実行
/tiktok-video "コンセプト: 笑えるおばあちゃんのスマホあるある"
```

### 詳細シナリオ指定

```typescript
const tiktokScenario = {
  concept: "商品紹介 - 革新的な調理器具",
  contentType: "tutorial",
  targetEmotion: "surprise",
  duration: 20,
  scenes: [
    { timing: "0-3s", purpose: "hook", description: "調理の悩み提示" },
    { timing: "3-8s", purpose: "solution", description: "商品登場" },
    { timing: "8-15s", purpose: "demo", description: "実演・ビフォーアフター" },
    { timing: "15-20s", purpose: "cta", description: "購入誘導" }
  ],
  hashtags: ["#便利グッズ", "#時短レシピ", "#主婦の味方"],
  postingTime: "12:00" // JST
};
```

## 🎯 バズ予測指標

### 完走率目標
- **ショート (5-10秒)**: 85%+
- **ミディアム (15-30秒)**: 70%+
- **ロング (30-60秒)**: 60%+

### エンゲージメント目標
- **いいね率**: 8%+
- **コメント率**: 2%+
- **シェア率**: 3%+
- **保存率**: 5%+

## 🔄 A/Bテスト戦略

### テストすべき要素
1. **サムネイル** (最初の1フレーム)
2. **音源** (トレンド vs オリジナル)
3. **長さ** (8秒 vs 15秒 vs 30秒)
4. **投稿時間** (朝 vs 昼 vs 夜)
5. **ハッシュタグ組み合わせ**

### 分析メトリクス
```yaml
初速 (1時間):
  - 再生数 >1000
  - 完走率 >70%
  - エンゲージメント率 >15%

24時間:
  - 再生数 >10,000
  - シェア数 >500
  - コメント数 >200

バズ判定:
  - 再生数 >100,000
  - クロスプラットフォーム拡散
  - シリーズ化の可能性
```

## 🎨 プロンプト生成システム

### T2T (Text-to-Text) 最適化
```typescript
// AIによるプロンプト最適化
const optimizer = new TikTokPromptOptimizer();

const rawConcept = "猫が可愛い";

const optimized = await optimizer.optimize(rawConcept, {
  platform: "tiktok",
  style: "viral",
  emotion: "cute",
  duration: 10
});

// Output: "Adorable kitten playing with yarn in slow motion,
// close-up of big eyes, soft lighting, heartwarming moment,
// TikTok viral style, 10 seconds"
```

### プロンプトチェーン（3ステップ最適化）
```yaml
Step 1 - Concept Expansion:
  input: "猫が可愛い"
  output: "子猫が毛糸で遊ぶ、スローモーション、大きな瞳のクローズアップ"

Step 2 - Technical Details:
  input: Step 1 output
  output: "ソフトライティング、9:16縦型、720p、温かい雰囲気"

Step 3 - Viral Optimization:
  input: Step 2 output
  output: "TikTokバズスタイル、共感を呼ぶ、保存したくなる瞬間"
```

## 📁 出力構造

```
tiktok-project-name/
├── images/
│   ├── raw/              # 生成画像
│   └── edited/           # i2i編集済み（表情・ライティング強化）
├── videos/               # 各シーン動画（5秒単位）
├── final/                # 結合済み最終動画
├── metadata.json         # バズ分析用データ
├── concat_videos.sh      # 動画結合スクリプト
└── posting_guide.md      # 投稿ガイド（ハッシュタグ・時間・キャプション）
```

## 🚀 実行例

### Case 1: おばあちゃんのスマホあるある

```bash
# 実行
BYTEPLUS_API_KEY=xxx BYTEPLUS_ENDPOINT=xxx \
  npx tsx generate-tiktok-video.ts \
  --concept "おばあちゃんがスマホを逆さに持つ" \
  --emotion "comedy" \
  --duration 20

# 生成される動画
- 10シーン × 5秒 = 50秒素材
- 編集で20秒に短縮
- ハッシュタグ自動生成
- 最適投稿時間提案
```

### Case 2: 商品紹介

```bash
npx tsx generate-tiktok-video.ts \
  --concept "革新的な時短調理器具" \
  --type "tutorial" \
  --duration 30
```

## ⚡ 自動化機能

1. **シナリオ自動生成**: コンセプトから10シーン自動設計
2. **画像生成**: 各シーンの高品質画像
3. **i2i自動編集**: 表情・ライティング最適化
4. **動画生成**: 5秒単位で自動生成
5. **メタデータ保存**: 全素材のURL・パラメータ記録
6. **結合スクリプト**: ffmpeg使用の自動結合
7. **投稿ガイド生成**: ハッシュタグ・時間・キャプション提案

## 📚 参考資料

- [TikTokアルゴリズム完全解説](./tiktok-algorithm.md)
- [バズ動画メタプロンプト](./viral-video-meta-prompt.md)
- [VideoAgent基本機能](./VideoAgent.md)

---

**作成者**: test_miyabi (Byteflow) Development Team
**最終更新**: 2025-10-09
**実績**: おばあちゃん動画プロジェクト - 10シーン完全自動生成成功
