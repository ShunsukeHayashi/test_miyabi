# BytePlus API v3 Integration Tests

## 概要

このディレクトリには、BytePlus API v3の包括的な統合テストが含まれています。

### テスト対象API

| API | モデル | テストケース数 |
|-----|--------|---------------|
| **T2I (Text-to-Image)** | seedream-4-0-250828 | 3 |
| **I2I (Image-to-Image)** | Bytedance-SeedEdit-3.0-i2i | 3 |
| **Sequential Generation** | seedream-4-0-250828 | 1 |
| **I2V (Image-to-Video)** | Bytedance-Seedance-1.0-pro | 5 |
| **T2T (Text-to-Text)** | DeepSeek-R1, Skylark-pro | 2 |
| **Vision API** | seed-1-6-250915 | 2 |
| **Error Handling** | - | 2 |
| **Rate Limiting** | - | 1 |
| **Batch Generation** | - | 1 |
| **Health Check** | - | 1 |
| **合計** | - | **21** |

## セットアップ

### 1. 環境変数の設定

テストを実行するには、以下の環境変数が必要です：

```bash
# .env.test ファイルを作成
cat > .env.test <<EOF
BYTEPLUS_API_KEY=your_api_key_here
BYTEPLUS_ENDPOINT=https://ark.ap-southeast.bytepluses.com/api/v3
EOF
```

### 2. テスト実行

```bash
# すべての統合テストを実行
npm test -- tests/integration/byteplus-api-v3.test.ts

# デバッグモードで実行
DEBUG=1 npm test -- tests/integration/byteplus-api-v3.test.ts

# 特定のテストスイートのみ実行
npm test -- tests/integration/byteplus-api-v3.test.ts -t "T2I"
npm test -- tests/integration/byteplus-api-v3.test.ts -t "I2V"
npm test -- tests/integration/byteplus-api-v3.test.ts -t "Vision API"
```

### 3. 環境変数なしでの実行

環境変数が設定されていない場合、テストは自動的にスキップされます：

```
⚠️ Skipping integration tests: BYTEPLUS_API_KEY or BYTEPLUS_ENDPOINT not set
```

## テストケース詳細

### T2I (Text-to-Image)

**テストケース:**
1. ✅ seedream-4-0-250828で画像生成（1K、シード固定）
2. ✅ 2K画像生成（ウォーターマークなし）
3. ✅ 空プロンプトでのエラーハンドリング

**検証項目:**
- レスポンスデータ構造
- 画像URLの形式（https://）
- シード値の再現性
- メタデータの存在

### I2I (Image-to-Image)

**テストケース:**
1. ✅ Bytedance-SeedEdit-3.0-i2iで画像編集
2. ✅ ソース画像なしでのエラーハンドリング
3. ✅ 複数参照画像の使用

**検証項目:**
- 編集された画像URLの生成
- 画像配列パラメータの必須性
- マルチリファレンスサポート

### Sequential Image Generation

**テストケース:**
1. ✅ 連続画像生成（3枚）

**検証項目:**
- 生成画像数の一致
- 各画像URLの有効性
- ストーリー性の維持

### I2V (Image-to-Video)

**テストケース:**
1. ✅ 動的カメラでの動画生成
2. ✅ 固定カメラでの動画生成
3. ✅ 複数バリエーション生成（quantity: 2）
4. ✅ ソース画像なしでのエラー
5. ✅ 無効なdurationパラメータのバリデーション

**検証項目:**
- 動画URLの生成
- サムネイルURLの存在
- カメラモード（fixed_lens）の動作
- シード値の再現性
- パラメータバリデーション

### T2T (Text-to-Text) - プロンプト最適化

**テストケース:**
1. ✅ DeepSeek-R1-250528でプロンプト最適化
2. ✅ Skylark-pro-250415での高速生成

**検証項目:**
- 最適化されたプロンプトの生成
- トークン使用量の記録
- レスポンス形式の検証

### Vision API (マルチモーダル)

**テストケース:**
1. ✅ seed-1-6-250915で画像分析
2. ✅ ビジュアル質問応答（VQA）

**検証項目:**
- 画像内容の詳細な説明
- 質問応答の正確性
- レスポンス長の妥当性

### エラーハンドリング

**テストケース:**
1. ✅ 400 Bad Requestの処理
2. ✅ 無効なモデル名の処理

**検証項目:**
- 適切なエラーのthrow
- エラーメッセージの存在

### Rate Limiting

**テストケース:**
1. ✅ レート制限統計の取得

**検証項目:**
- used, available, resetInの値
- 統計データの妥当性

### Batch Generation

**テストケース:**
1. ✅ 複数画像の並列生成（3枚）

**検証項目:**
- 成功率の計算
- 総処理時間の記録
- 各画像URLの生成

### Health Check

**テストケース:**
1. ✅ APIヘルスチェック

**検証項目:**
- boolean型の返却
- API接続性の確認

## タイムアウト設定

各テストのタイムアウト設定：

| テストタイプ | タイムアウト | 理由 |
|-------------|-------------|------|
| T2I | 120秒 | 画像生成時間を考慮 |
| I2I | 120秒 | 画像編集時間を考慮 |
| Sequential | 180秒 | 複数画像生成 |
| I2V | 180秒 | 動画生成の長時間処理 |
| I2V Batch | 240秒 | 複数動画生成 |
| T2T | 60秒 | テキスト生成は比較的高速 |
| Vision | 60秒 | 画像分析は高速 |
| Batch | 300秒 | 3枚の画像を並列生成 |

## 期待される結果

すべてのテストが成功すると、以下のような出力が得られます：

```
✅ T2I Test passed
   Generated image: https://...
   Seed: 42

✅ I2I Test passed
   Edited image: https://...

✅ I2V Dynamic camera test passed
   Video: https://...
   Thumbnail: https://...

✅ DeepSeek-R1 optimization passed
   Optimized prompt: A photorealistic image of...
   Tokens used: 245

✅ Vision API test passed
   Image analysis: The image shows...

✅ Batch generation passed
   Success rate: 100.0%
   Total time: 45.2s
```

## 実行結果 (2025-10-09)

### 成功したテスト

| API | テスト | 結果 | 詳細 |
|-----|--------|------|------|
| **T2I** | seedream-4-0-250828 | ✅ 成功 | 画像生成成功、URL取得 |

**T2I テスト詳細:**
```
Model: seedream-4-0-250828
Size: 1248x832
Usage: {"generated_images":1,"output_tokens":4056,"total_tokens":4056}
Duration: ~6秒
```

### API アクセス制限

現在のAPIキーでは以下のAPIにアクセスできません（404 Not Found）:

| API | モデル | ステータス |
|-----|--------|-----------|
| T2T | DeepSeek-R1-250528 | ❌ 404 Not Found |
| T2T | Skylark-pro-250415 | ❌ 404 Not Found |
| Vision | seed-1-6-250915 | ❌ 404 Not Found |

**推測される原因:**
1. モデル名が変更された可能性
2. APIキーのアクセス権限が画像生成のみに制限されている
3. リージョン固有のモデルアクセス制限

**確認済みの動作:**
- ✅ T2I (seedream-4-0-250828): 完全動作
- ✅ 環境変数の読み込み: 正常
- ✅ レート制限: 正常動作
- ✅ デバッグログ: 正常出力

## トラブルシューティング

### 環境変数が読み込まれない

```bash
# .envファイルから読み込む
source .env.test
npm test -- tests/integration/byteplus-api-v3.test.ts
```

### タイムアウトエラー

```bash
# タイムアウトを延長
npm test -- tests/integration/byteplus-api-v3.test.ts --testTimeout=300000
```

### レート制限エラー

```bash
# 実行間隔を空ける
sleep 10
npm test -- tests/integration/byteplus-api-v3.test.ts
```

### デバッグ情報の出力

テストは `debug: true` で実行されるため、詳細なAPIリクエスト/レスポンスがコンソールに出力されます。

## CI/CD統合

GitHub Actionsでの実行例：

```yaml
name: BytePlus API Integration Tests

on:
  push:
    branches: [main]
  pull_request:

jobs:
  integration-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Run integration tests
        env:
          BYTEPLUS_API_KEY: ${{ secrets.BYTEPLUS_API_KEY }}
          BYTEPLUS_ENDPOINT: ${{ secrets.BYTEPLUS_ENDPOINT }}
        run: npm test -- tests/integration/byteplus-api-v3.test.ts
```

## コスト考慮事項

これらのテストはすべて実際のAPIを呼び出すため、**料金が発生します**。

**推定コスト（1回の完全実行）:**
- T2I: ~5枚の画像生成
- I2I: ~4枚の画像編集
- I2V: ~4本の動画生成
- T2T: ~3回のテキスト生成
- Vision: ~2回の画像分析
- Batch: ~3枚の並列生成

**合計:** 約20-30APIコール

**推奨運用:**
- 開発時は個別テストのみ実行（`-t "T2I"`など）
- CI/CDでは環境変数なしで実行（自動スキップ）
- 本番リリース前のみフル実行

## 参考資料

- [BytePlus API仕様書](../../BYTEPLUS_API_SPECIFICATION.md)
- [BytePlusClient実装](../../src/api/byteplus-client.ts)
- [TextGenerationClient実装](../../src/api/text-generation-client.ts)

---

**Last Updated:** 2025-10-09
**Test Coverage:** 21 test cases across 6 API types
