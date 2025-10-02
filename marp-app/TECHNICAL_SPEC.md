# Marp変換アプリ 技術仕様書

## システム概要

テキストファイルをClaude APIで自動的にMarp形式に変換し、PowerPointファイルとして出力するWebアプリケーション

---

## 技術スタック

### フロントエンド
- Next.js 15.5.4
- React 19.1.0
- TailwindCSS 4

### バックエンド
- Next.js API Routes
- Anthropic Claude API (claude-sonnet-4)
- pptxgenjs 4.0.1

---

## システム構成

### アーキテクチャ
- フルスタックNext.jsアプリケーション
- APIルートでサーバーサイド処理
- クライアントサイドでファイルアップロード

### デプロイ環境
- 開発: Github Codespaces
- 本番: Railway

---

## 主要機能

### ファイルアップロード
- 対応形式: .txt, .md
- クライアントサイドでファイル読み込み

### Marp変換
- Claude APIにテキストを送信
- マークダウン形式でスライド構造を生成
- 見出しレベルと箇条書きの自動認識

### PowerPoint生成
- Marp形式からPPTX形式に変換
- フォント: BIZ UDPゴシック
- 自動レイアウト調整

---

## 環境変数

### 必須設定

ANTHROPIC_API_KEY=sk-ant-xxxxx
PORT=3000

---

## API仕様

### POST /api/convert
テキストをMarp形式に変換

**リクエスト:**
- Content-Type: multipart/form-data
- Body: file (File)

**レスポンス:**

{
  "marp": "変換されたMarp形式テキスト"
}

### POST /api/generate-ppt
Marp形式からPowerPointを生成

**リクエスト:**
- Content-Type: application/json
- Body: { "marpContent": "string" }

**レスポンス:**
- Content-Type: application/vnd.openxmlformats-officedocument.presentationml.presentation
- Binary: PPTXファイル

---

## デプロイ手順

### Railway設定
1. Root Directory: marp-app
2. 環境変数設定
3. ポート: 8080

### 開発環境起動

cd marp-app
npm install
npm run dev

---

## 制約事項

### スライド制約
- 1スライドの最大高さ: 7.5インチ
- 超過分は自動的にカット

### 対応マークダウン
- 見出し: #, ##, ###
- 箇条書き: -
- 太字: **text**
- コードブロック: 削除

---

## 今後の改善案

- デザインテンプレート追加
- 画像挿入機能
- カスタムレイアウト設定
- バッチ処理機能