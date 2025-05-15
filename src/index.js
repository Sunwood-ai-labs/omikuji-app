// おみくじアプリのバックエンド with MCP StreamableHTTP
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import cors from 'cors';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';

// __dirnameを取得するための設定（ESモジュールでは必要）
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ポート設定
const PORT = process.env.PORT || 9999;
const HOST = process.env.HOST || '0.0.0.0';

// おみくじの結果一覧
const omikujiResults = [
  { result: '大吉', description: '今日はとても良い日です！思い切った行動が吉と出ています。', emoji: '🌟' },
  { result: '中吉', description: '良いことが起きるでしょう。前向きに過ごしましょう。', emoji: '✨' },
  { result: '小吉', description: 'まずまずの運勢です。慎重に行動すれば良い結果につながります。', emoji: '🍀' },
  { result: '吉', description: '平穏な一日になりそうです。日常を大切にしましょう。', emoji: '😊' },
  { result: '末吉', description: '最後には良いことがあります。焦らず進みましょう。', emoji: '🌱' },
  { result: '凶', description: '少し注意が必要な日です。慎重に行動しましょう。', emoji: '⚠️' },
  { result: '大凶', description: '困難があるかもしれませんが、冷静に対処すれば乗り越えられます。', emoji: '🔥' }
];

// おみくじの関連アドバイス
const adviceCategories = {
  love: [
    '積極的にアプローチするのが吉！',
    '相手の気持ちを考えると良い結果に！',
    '一歩引いて様子を見るのがベスト！',
    '友達との時間も大切にしよう！',
    '自分磨きに集中する時期かも！'
  ],
  work: [
    '新しいチャレンジをするのが吉！',
    'チームワークを大切にすると進展あり！',
    '地道な努力が実を結ぶとき！',
    '柔軟な発想で問題解決を！',
    'スキルアップに取り組むと未来が開ける！'
  ],
  health: [
    '適度な運動を心がけよう！',
    '食生活の見直しが幸運を呼ぶ！',
    '十分な睡眠が大切！',
    'ストレス発散を意識して！',
    'リラックスする時間を作ろう！'
  ]
};

// ランダムなおみくじ結果を返す関数
function getRandomOmikuji() {
  const randomIndex = Math.floor(Math.random() * omikujiResults.length);
  return omikujiResults[randomIndex];
}

// カテゴリ別のランダムなアドバイスを取得する関数
function getRandomAdvice(category) {
  const adviceList = adviceCategories[category] || [];
  if (adviceList.length === 0) return null;
  
  const randomIndex = Math.floor(Math.random() * adviceList.length);
  return adviceList[randomIndex];
}

// アプリケーションの設定
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(join(__dirname, 'public')));

// MCP Server設定
const server = new McpServer({
  name: 'omikuji-mcp-server',
  version: '1.0.0',
  description: 'おみくじアプリのMCPサーバー',
});

// ツールの定義（おみくじ機能）
server.addTool({
  name: 'drawOmikuji',
  description: 'おみくじを引いて結果を取得します',
  input_schema: {
    type: 'object',
    properties: {},
    required: []
  },
  output_schema: {
    type: 'object',
    properties: {
      result: { type: 'string', description: 'おみくじの結果（大吉、中吉など）' },
      description: { type: 'string', description: '結果の詳細説明' },
      emoji: { type: 'string', description: '結果に関連する絵文字' }
    },
    required: ['result', 'description', 'emoji']
  },
  function: async () => {
    return getRandomOmikuji();
  }
});

// ツールの定義（アドバイス機能）
server.addTool({
  name: 'getAdvice',
  description: '特定のカテゴリに関するアドバイスを取得します',
  input_schema: {
    type: 'object',
    properties: {
      category: {
        type: 'string',
        enum: ['love', 'work', 'health'],
        description: 'アドバイスのカテゴリ（love: 恋愛, work: 仕事, health: 健康）'
      }
    },
    required: ['category']
  },
  output_schema: {
    type: 'object',
    properties: {
      advice: { type: 'string', description: 'カテゴリに関するアドバイス' }
    },
    required: ['advice']
  },
  function: async ({ category }) => {
    const advice = getRandomAdvice(category);
    return { advice: advice || 'アドバイスが見つかりませんでした。' };
  }
});

// HTTP RESTful API エンドポイント（非MCP用）
app.get('/api/omikuji', (req, res) => {
  res.json(getRandomOmikuji());
});

app.get('/api/advice/:category', (req, res) => {
  const { category } = req.params;
  const advice = getRandomAdvice(category);
  
  if (!advice) {
    return res.status(404).json({ error: '指定されたカテゴリが見つかりません。' });
  }
  
  res.json({ advice });
});

// MCPエンドポイント - セッション管理用のマップ
const sessions = new Map();

// MCPエンドポイント
app.all('/mcp', async (req, res) => {
  try {
    const sessionId = req.headers['mcp-session-id'];
    let transport;
    
    if (sessionId && sessions.has(sessionId)) {
      // 既存セッションを再利用
      transport = sessions.get(sessionId);
    } else {
      // 新しいトランスポートを作成
      transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => {
          const newSessionId = `session-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
          return newSessionId;
        }
      });
      
      // サーバーに接続
      await server.connect(transport);
      
      // セッションIDがあれば保存
      const newSessionId = transport.sessionId;
      if (newSessionId) {
        sessions.set(newSessionId, transport);
        
        // セッション終了時のクリーンアップ
        res.on('close', () => {
          if (newSessionId && sessions.has(newSessionId)) {
            sessions.delete(newSessionId);
          }
        });
      }
    }
    
    // リクエスト処理
    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    console.error('MCPリクエスト処理エラー:', error);
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: '2.0',
        error: {
          code: -32603,
          message: 'Internal server error',
          data: process.env.NODE_ENV === 'development' ? error.message : undefined
        },
        id: null
      });
    }
  }
});

// メインページルート
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'index.html'));
});

// サーバー起動
app.listen(PORT, HOST, () => {
  console.log(`✨✨ おみくじサーバー起動！ http://${HOST}:${PORT} でアクセスできるよ！✨✨`);
});
