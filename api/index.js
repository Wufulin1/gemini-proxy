// api/index.js

export const config = {
  runtime: 'edge', // 使用 Edge Runtime 速度更快
};

export default async function handler(req) {
  const url = new URL(req.url);
  
  // 1. 简单的测试：如果你直接访问 /api/，它应该告诉你成功了
  if (url.pathname === '/api/' || url.pathname === '/api') {
    return new Response(JSON.stringify({ 
      status: 'success', 
      message: 'Gemini Proxy is running!', 
      note: 'Please use POST method to call Gemini API.' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // 2. 代理逻辑核心
  // 获取原本的请求路径 (例如 /v1/models)
  const path = url.pathname.replace(/^\/api/, ''); 
  
  // 目标地址：Google Gemini API
  const targetUrl = `https://generativelanguage.googleapis.com${path}${url.search}`;

  // 克隆请求头，移除一些可能导致冲突的头
  const headers = new Headers(req.headers);
  headers.set('Host', 'generativelanguage.googleapis.com');
  
  // ⚠️ 重要：这里通常需要处理 API Key
  // 如果你的代理是为了让用户带 Key 访问，保持原样即可。
  // 如果是为了隐藏 Key，你需要在这里 headers.set('x-goog-api-key', '你的真实KEY');

  try {
    // 发起请求到 Google
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: headers,
      body: req.body, // 转发 Body (针对 POST 请求)
    });

    // 将 Google 的响应返回给用户
    return new Response(response.body, {
      status: response.status,
      headers: response.headers,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
