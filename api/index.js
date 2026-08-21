export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const url = new URL(req.url);
  url.host = 'generativelanguage.googleapis.com';

  // 1. 处理跨域预检
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': '*',
      },
    });
  }

  // 2. 修正请求头
  const newHeaders = new Headers(req.headers);
  newHeaders.set('Host', 'generativelanguage.googleapis.com');

  // 3. 转发到 Google 官方接口
  const response = await fetch(url.toString(), {
    method: req.method,
    headers: newHeaders,
    body: req.body,
    redirect: 'follow',
  });

  // 4. 附加跨域头并返回
  const resHeaders = new Headers(response.headers);
  resHeaders.set('Access-Control-Allow-Origin', '*');

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: resHeaders,
  });
}
