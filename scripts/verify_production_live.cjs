const https = require('https');

const urls = [
  'https://curitipao.com.br/blog/como-surgiu-o-pao/',
  'https://curitipao.com.br/blog/pao-islandia-calor-da-terra/',
  'https://curitipao.com.br/blog/lavash-pao-tradicional-armenia/',
  'https://curitipao.com.br/blog/',
  'https://curitipao.com.br/sitemap.xml',
  'https://curitipao.com.br/robots.txt',
  'https://curitipao.com.br/assets/photos/blog/historias-do-pao/origem-do-pao-share.jpg',
  'https://curitipao.com.br/assets/photos/blog/historias-do-pao/pao-islandia-share.jpg',
  'https://curitipao.com.br/assets/photos/blog/historias-do-pao/lavash-armenia-share.jpg',
  'https://curitipao.com.br/assets/photos/blog/historias-do-pao/origem-do-pao.webp',
  'https://curitipao.com.br/assets/photos/blog/historias-do-pao/pao-islandia.webp',
  'https://curitipao.com.br/assets/photos/blog/historias-do-pao/lavash-armenia.webp'
];

function checkUrl(url) {
  return new Promise(resolve => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, res => {
      let data = '';
      res.on('data', chunk => {
        if (data.length < 5000) data += chunk.toString();
      });
      res.on('end', () => {
        resolve({
          url,
          status: res.statusCode,
          contentType: res.headers['content-type'],
          contentLength: res.headers['content-length'] || data.length,
          preview: data.slice(0, 200).replace(/\s+/g, ' ')
        });
      });
    }).on('error', err => {
      resolve({ url, error: err.message });
    });
  });
}

async function run() {
  console.log('--- CHECKING PRODUCTION URLS ---');
  for (const url of urls) {
    const res = await checkUrl(url);
    if (res.error) {
      console.log(`[ERR] ${url} -> ${res.error}`);
    } else {
      console.log(`[HTTP ${res.status}] ${url} (${res.contentType}, ${res.contentLength} bytes)`);
    }
  }
}

run();
