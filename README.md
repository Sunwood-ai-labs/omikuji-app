<div align="center">
  <h1>✨ おみくじアプリ with MCP StreamableHTTP ✨</h1>
  <img src="docs/screenshots/omikuji-preview.png" alt="おみくじアプリのプレビュー" width="600">
  
  <p>MCPのStreamableHTTPを活用したモダンなおみくじアプリ</p>

  <div>
    <img src="https://img.shields.io/badge/Node.js-v20.19.0-green" alt="Node.js v20.19.0">
    <img src="https://img.shields.io/badge/MCP-StreamableHTTP-blue" alt="MCP StreamableHTTP">
    <img src="https://img.shields.io/badge/Express-4.18.3-lightgrey" alt="Express 4.18.3">
    <img src="https://img.shields.io/badge/License-MIT-yellow" alt="License MIT">
  </div>
</div>

## 📋 概要

このプロジェクトは、最新のModel Context Protocol (MCP) のStreamableHTTPトランスポートを活用したおみくじアプリです。ユーザーはおみくじを引いて運勢を占うことができます。MCP StreamableHTTPの特徴であるシンプルな通信方式と効率的なデータ転送を体験できるサンプルアプリケーションです。

## ✨ 特徴

- 🎯 **MCPのStreamableHTTP**: 最新のAI通信プロトコルを使用
- 🔄 **リアルタイム通信**: シームレスなデータ転送
- 💫 **美しいアニメーション**: カード反転などのエフェクト
- 📱 **レスポンシブデザイン**: すべてのデバイスで快適に動作
- 🌈 **カテゴリ別アドバイス**: 恋愛・仕事・健康の運勢アドバイス

## 🛠️ 技術スタック

- **フロントエンド**: HTML, CSS, JavaScript (Vanilla)
- **バックエンド**: Node.js, Express
- **通信プロトコル**: MCP StreamableHTTP
- **その他**: SVG アニメーション

## 📥 インストール方法

1. リポジトリをクローン:
```bash
git clone https://github.com/Sunwood-ai-labs/omikuji-app.git
cd omikuji-app
```

2. 依存関係をインストール:
```bash
npm install
```

3. アプリを起動:
```bash
npm start
```

4. ブラウザで以下にアクセス:
```
http://localhost:9999
```

## 📊 使い方

1. トップページにアクセスします
2. 「おみくじを引く」ボタンをクリックします
3. アニメーションと共におみくじの結果が表示されます
4. カテゴリタブをクリックして、恋愛・仕事・健康に関するアドバイスを確認できます
5. 「もう一度引く」で新しいおみくじを引くことができます

## 🔧 MCP StreamableHTTPとは

Model Context Protocol (MCP) のStreamableHTTPは、AIモデルと外部ツールやサービスを接続するための標準化されたプロトコルです。
従来のSSE (Server-Sent Events) 方式と比べて、単一のHTTPエンドポイントで双方向通信を実現し、
よりシンプルなアーキテクチャで効率的な通信を可能にします。

このアプリケーションでは、以下のMCP機能を実装しています:

- 単一HTTPエンドポイント (`/mcp`) での双方向通信
- セッション管理によるクライアント状態の保持
- ツール定義によるAPI機能の抽象化
- RESTful APIとの互換性維持

## 📄 APIエンドポイント

### RESTful API

- **GET /api/omikuji** - おみくじの結果をランダムに取得
- **GET /api/advice/:category** - 特定カテゴリ(love, work, health)のアドバイスを取得

### MCP エンドポイント

- **POST /mcp** - MCPリクエスト処理用エンドポイント
- **GET /mcp** - MCP SSE ストリーム用エンドポイント（StreamableHTTP互換）

## 🚀 デプロイ

```bash
# 環境変数の設定
export PORT=9999
export HOST=0.0.0.0

# アプリを起動
npm start
```

## 🤝 コントリビューション

コントリビューションは大歓迎です！以下の手順で参加できます：

1. このリポジトリをフォーク
2. 新しいブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチをプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📜 ライセンス

MIT ライセンスの下で配布されています。詳細は [LICENSE](LICENSE) ファイルを参照してください。

## 📞 お問い合わせ

質問やフィードバックがある場合は、GitHub Issuesでお気軽にお問い合わせください。
