import express from 'express';
import fetch from 'node-fetch'; // node >=18 可用原生 fetch；低版本请保留此依赖
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors()); // 前端不同端口时允许跨域；生产可按域名收紧

// 请在 .env 中设置 ZHIPU_API_KEY=你的key
const API_KEY = process.env.ZHIPU_API_KEY;
const API_URL = 'https://open.bigmodel.cn/api/paas/v4/assistant';

if (!API_KEY) {
  console.warn('[warning] 未在 .env 中设置 ZHIPU_API_KEY，代理将无法工作');
}

app.post('/api/assistant', async (req, res) => {
  try {
    const upstream = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(req.body),
    });
    const text = await upstream.text();
    res.status(upstream.status).send(text);
  } catch (e) {
    console.error('proxy error', e);
    res.status(500).json({ error: 'proxy error', detail: e.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Proxy running at http://localhost:${PORT}/api/assistant`);
});
