const products = [
  {
    tag: '熱銷手持',
    title: 'D110 輕巧隨行標籤機',
    image: 'imgs/2e0459f05f556e4a8e4a3aae2d8ebc91.jpg',
    bullets: ['一鍵藍牙連接，30秒上手', 'Type-C 充電，單次續航一整天', '內建 500+ 生活/辦公模板']
  },
  {
    tag: '桌面旗艦',
    title: 'B3 Pro 高速熱轉印標籤機',
    image: 'imgs/35c3dad007c79e54f8a6bf0a3e7354d9.jpg',
    bullets: ['300dpi 高清列印，耗材低成本', '支援 4 吋寬度出紙，適合倉儲出貨', 'Wi-Fi / 藍牙雙模，跨平台打印']
  },
  {
    tag: '創意手帳',
    title: 'D11C 彩色便攜標籤機',
    image: 'imgs/ef82b0f400336c32dcc8ba81b088fa41.jpg',
    bullets: ['多色標籤紙，手帳/收納皆適用', 'APP 模板商店，每週上新', '內建刀頭，一鍵裁切更順手']
  }
];

const faqs = [
  'D11 和 D110 差異是什麼？',
  '如何與手機 APP 連線？',
  '標籤紙有哪些尺寸與材質？',
  '哪裡可以購買與售後？',
  'B3 Pro 適用於什麼場景？',
  '精臣標籤機支援哪些設備？',
  '標籤機的列印速度如何？',
  '如何更換標籤紙？',
  '保固政策是什麼？'
];

const dotsWrap = document.getElementById('dots');
const productImage = document.getElementById('productImage');
const productTitle = document.getElementById('productTitle');
const productTag = document.getElementById('productTag');
const productBullets = document.getElementById('productBullets');
let index = 0;

const renderProduct = () => {
  const p = products[index];
  productImage.src = p.image;
  productTitle.textContent = p.title;
  productTag.textContent = p.tag;
  productBullets.innerHTML = p.bullets.map(item => `<li><i class="ri-check-double-line"></i><span>${item}</span></li>`).join('');
  [...dotsWrap.children].forEach((dot, i) => dot.classList.toggle('active', i === index));
};

products.forEach((_, i) => {
  const dot = document.createElement('div');
  dot.className = 'dot' + (i === 0 ? ' active' : '');
  dot.addEventListener('click', () => { index = i; renderProduct(); });
  dotsWrap.appendChild(dot);
});

document.getElementById('next').addEventListener('click', () => { index = (index + 1) % products.length; renderProduct(); });
document.getElementById('prev').addEventListener('click', () => { index = (index - 1 + products.length) % products.length; renderProduct(); });

const faqChips = document.getElementById('faqChips');
const questionInput = document.getElementById('questionInput');
const answerBox = document.getElementById('answerBox');
faqs.forEach(q => {
  const chip = document.createElement('div');
  chip.className = 'chip';
  chip.textContent = q;
  chip.addEventListener('click', () => ask(q));
  faqChips.appendChild(chip);
});

const mockAnswers = {
  'D11 和 D110 差異是什麼？': 'D110 採用 Type-C 充電、續航更長，並支援新版 APP；D11 主打入門輕巧，皆支援藍牙配對。',
  '如何與手機 APP 連線？': '開啟精臣 APP > 新增裝置 > 開啟標籤機電源並長按配對鍵，依提示完成藍牙配對即可。',
  '標籤紙有哪些尺寸與材質？': '提供 12/15/18/32mm 等寬度，材質含霧面白、透明、霧銀、防水耐刮等，可於購買通路選購。',
  '哪裡可以購買與售後？': '可至官方商城、蝦皮/博客來授權店，或右上聯絡業務洽談企業採購；售後請憑序號與購買證明。',
  'B3 Pro 適用於什麼場景？': 'B3 Pro 適用於倉儲標示、物流出貨、辦公文件管理等需要高品質標籤的場景。',
  '精臣標籤機支援哪些設備？': '精臣標籤機支援 iOS 和 Android 手機，部分型號也支援電腦端打印。',
  '標籤機的列印速度如何？': '不同型號速度不同，一般在 20-50mm/秒之間，高速機型可達 100mm/秒。',
  '如何更換標籤紙？': '關機後打開機蓋，按照指示放入標籤紙卷，確保紙張平整，關上機蓋即可。',
  '保固政策是什麼？': '精臣標籤機提供一年標準保固，註冊後可延長至一年半，具體以官方說明為準。'
};

const API_KEY = '8e726894de9f4e9da340183a010f698d.xcvS4V7aDLiyCOTS'; // 注意：前端暴露金鑰僅供演示；生产请移除
const ASSISTANT_ID = '65940acff94777010aa6b796'; // ChatGLM（官方）

async function ask(text, targetBox = answerBox) {
  const question = text || questionInput.value.trim();
  questionInput.value = question;
  if (!question) {
    targetBox.textContent = '請輸入問題後送出喔！';
    return;
  }
  targetBox.textContent = 'AI 正在思考中...';
  try {
    // 验证问题长度
    if (question.length < 2) {
      targetBox.textContent = '請輸入更詳細的問題，以便我更好地為您解答。';
      return;
    }
    
    // 在本地开发环境中直接调用API，生产环境使用代理
    const useProxy = false;
    const endpoint = useProxy
      ? '/api/assistant'
      : 'https://open.bigmodel.cn/api/paas/v4/assistant';

    console.log('AI 請求發送中:', {
      endpoint,
      question: question.substring(0, 50) + (question.length > 50 ? '...' : ''),
      useProxy
    });

    const resp = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(useProxy ? {} : { Authorization: `Bearer ${API_KEY}` }),
      },
      body: JSON.stringify({
        assistant_id: ASSISTANT_ID,
        model: 'glm-4-assistant',
        stream: true,
        messages: [{ role: 'user', content: question }]
      })
    });
    if (!resp.ok) {
      const detail = await resp.text().catch(() => '');
      throw new Error(`HTTP ${resp.status} ${detail || ''}`.trim());
    }
    
    // 处理流式响应
    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let fullResponse = '';
    let msg = '';
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value, { stream: true });
      fullResponse += chunk;
      
      // 处理流式响应的每一行
      const lines = chunk.split('\n');
      for (const line of lines) {
        if (line.trim() === '') continue;
        if (line.startsWith('data: ')) {
          const dataStr = line.slice(6);
          if (dataStr === '[DONE]') break;
          try {
            const data = JSON.parse(dataStr);
            const delta = data?.choices?.[0]?.delta;
            if (delta?.content) {
              msg += delta.content;
              // 实时更新UI
              targetBox.textContent = msg;
            }
          } catch (e) {
            console.error('解析流式数据失败', e);
          }
        }
      }
    }
    
    // 确保最终有内容
    targetBox.textContent = (msg && msg.trim()) || '暫未取得回覆，請稍後再試。';
  } catch (err) {
    console.error('AI 請求失敗', err);
    // 分析錯誤類型
    let errorMessage = '暫時無法連線到 AI 服務';
    if (err.message.includes('Failed to fetch')) {
      errorMessage = '網路連線失敗，請檢查您的網路設定';
    } else if (err.message.includes('401')) {
      errorMessage = 'API 認證失敗，請確認 API 金鑰是否正確';
    } else if (err.message.includes('403')) {
      errorMessage = '無權限存取 API，請檢查 API 金鑰權限';
    } else if (err.message.includes('404')) {
      errorMessage = 'API 端點不存在，請確認設定是否正確';
    } else if (err.message.includes('500')) {
      errorMessage = 'API 伺服器錯誤，請稍後再試';
    }
    
    // 尝试模糊匹配问题
    let matchedAnswer = mockAnswers[question];
    if (!matchedAnswer) {
      // 增强的模糊匹配：检查问题是否包含关键词
      const questionLower = question.toLowerCase();
      let bestMatch = null;
      let bestScore = 0;
      
      for (const [key, value] of Object.entries(mockAnswers)) {
        const keyLower = key.toLowerCase();
        // 检查完全匹配
        if (keyLower === questionLower) {
          matchedAnswer = value;
          break;
        }
        // 检查部分匹配
        if (keyLower.includes(questionLower) || questionLower.includes(keyLower)) {
          matchedAnswer = value;
          break;
        }
        // 检查关键词匹配
        const questionWords = questionLower.split(/\s+/);
        const keyWords = keyLower.split(/\s+/);
        let score = 0;
        
        for (const qWord of questionWords) {
          for (const kWord of keyWords) {
            if (qWord.includes(kWord) || kWord.includes(qWord)) {
              score++;
            }
          }
        }
        
        if (score > bestScore) {
          bestScore = score;
          bestMatch = value;
        }
      }
      
      if (bestScore > 0) {
        matchedAnswer = bestMatch;
      }
    }
    
    targetBox.textContent = matchedAnswer || `${errorMessage}（${err?.message || 'unknown'}）。\n\n建議您：\n1. 檢查網路連線\n2. 稍後再試\n3. 或嘗試點擊常見問題快速獲取答案`;
  }
}

document.getElementById('askBtn').addEventListener('click', () => ask(questionInput.value.trim()));

// Floating chat modal
const modal = document.getElementById('chatModal');
const openers = [document.getElementById('fab'), document.getElementById('openAssistant'), document.getElementById('navAssistant')];
openers.forEach(btn => btn.addEventListener('click', () => modal.classList.add('active')));
document.getElementById('closeModal').addEventListener('click', () => modal.classList.remove('active'));
modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('active'); });

document.getElementById('chatSend').addEventListener('click', () => {
  const text = document.getElementById('chatInput').value.trim();
  if (!text) {
    document.getElementById('chatBody').textContent = '請輸入問題後送出喔！';
    return;
  }
  document.getElementById('chatBody').textContent = `已收到您的問題：「${text}」，AI 正在思考最佳建議...`;
  ask(text, document.getElementById('chatBody'));
});

// Scroll behaviors
document.getElementById('toTop').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Simple parallax
const parallax = document.querySelector('[data-parallax]');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  parallax.style.transform = `translateY(${y * 0.04}px)`;
});

// Init
renderProduct();

// External CTA targets from official TW site
const PRODUCT_URL = 'https://www.niimbot.com/tw/consumable/detail?expandCode=MSC250623093600000050';
document.getElementById('btnExplore')?.addEventListener('click', () => window.open(PRODUCT_URL, '_blank'));
document.getElementById('btnCompare')?.addEventListener('click', () => window.open(PRODUCT_URL, '_blank'));
document.getElementById('btnVideo')?.addEventListener('click', () => window.open(`${PRODUCT_URL}#video`, '_blank'));
const DOWNLOAD_URL = 'https://www.niimbot.com/tw/download';
document.getElementById('btnDownload')?.addEventListener('click', () => window.open(DOWNLOAD_URL, '_blank'));

// Buy / Business contact
const SHOP_URL = 'https://www.niimbot.com/tw/';
document.getElementById('btnShop')?.addEventListener('click', () => window.open(SHOP_URL, '_blank'));

const contactModal = document.getElementById('contactModal');
document.getElementById('btnBiz')?.addEventListener('click', () => contactModal?.classList.add('active'));
document.getElementById('closeContact')?.addEventListener('click', () => contactModal?.classList.remove('active'));
contactModal?.addEventListener('click', (e) => { if (e.target === contactModal) contactModal.classList.remove('active'); });

document.getElementById('contactCopy')?.addEventListener('click', async () => {
  const text =
`企業採購專線：(+886) 02-0000-0000
業務信箱：sales@jingchen.tw
客服信箱：service@jingchen.tw
服務時間：週一至週五 09:30-18:00`;
  try {
    await navigator.clipboard.writeText(text);
    alert('已複製聯絡資訊');
  } catch {
    // Fallback if clipboard API blocked
    prompt('複製以下聯絡資訊：', text);
  }
});
