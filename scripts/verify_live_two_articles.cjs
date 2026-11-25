const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': 'CuritiPao-Verification/1.0' } }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({
        statusCode: res.statusCode,
        headers: res.headers,
        body: data
      }));
    });
    req.on('error', reject);
    req.setTimeout(15000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

async function verifyLive() {
  console.log('=== VERIFYING PRODUCTION DEPLOYMENT (https://curitipao.com.br) ===\n');

  const urlsToTest = [
    { url: 'https://curitipao.com.br/blog/shokupan-pao-japones/', type: 'text/html' },
    { url: 'https://curitipao.com.br/blog/por-que-fazer-cortes-na-massa-do-pao/', type: 'text/html' },
    { url: 'https://curitipao.com.br/assets/photos/blog/historias-do-pao/shokupan.jpg', type: 'image/jpeg' },
    { url: 'https://curitipao.com.br/assets/photos/blog/cortes-no-pao.webp', type: 'image/webp' },
    { url: 'https://curitipao.com.br/assets/photos/blog/cortes-no-pao-share.jpg', type: 'image/jpeg' },
    { url: 'https://curitipao.com.br/sitemap.xml', type: 'xml' },
    { url: 'https://curitipao.com.br/blog/', type: 'text/html' }
  ];

  let allOk = true;

  for (const item of urlsToTest) {
    try {
      const res = await fetchUrl(item.url);
      const is200 = res.statusCode === 200;
      const cType = res.headers['content-type'] || '';
      const matchesType = cType.includes(item.type) || (item.type === 'xml' && cType.includes('xml'));
      
      console.log(`[HTTP ${res.statusCode}] ${item.url}`);
      console.log(`    Content-Type: ${cType}`);
      
      if (!is200) {
        console.error(`    ERROR: Expected HTTP 200, got ${res.statusCode}`);
        allOk = false;
      }
      
      if (item.url.includes('/blog/shokupan-pao-japones/')) {
        const hasH1 = res.body.includes('<h1>Shokupan: conheça o pão japonês de miolo macio</h1>');
        const hasAuthor = res.body.includes('Por <strong>Curadoria CuritiPão</strong>');
        const hasCaption = res.body.includes('<span>Imagem ilustrativa</span>');
        const hasSeriesNav = res.body.includes('aria-label="Série Histórias do pão"');
        const hasOg = res.body.includes('property="og:image" content="https://curitipao.com.br/assets/photos/blog/historias-do-pao/shokupan.jpg"');
        console.log(`    H1: ${hasH1} | Author: ${hasAuthor} | Caption: ${hasCaption} | SeriesNav: ${hasSeriesNav} | OG: ${hasOg}`);
        if (!hasH1 || !hasAuthor || !hasCaption || !hasSeriesNav) allOk = false;
      }

      if (item.url.includes('/blog/por-que-fazer-cortes-na-massa-do-pao/')) {
        const hasH1 = res.body.includes('<h1>Por que o padeiro faz cortes na massa do pão?</h1>');
        const hasAuthor = res.body.includes('Por <strong>Curadoria CuritiPão</strong>');
        const hasCaption = res.body.includes('<span>Imagem ilustrativa</span>');
        const hasOg = res.body.includes('property="og:image" content="https://curitipao.com.br/assets/photos/blog/cortes-no-pao-share.jpg"');
        console.log(`    H1: ${hasH1} | Author: ${hasAuthor} | Caption: ${hasCaption} | OG: ${hasOg}`);
        if (!hasH1 || !hasAuthor || !hasCaption) allOk = false;
      }

      if (item.url.includes('/sitemap.xml')) {
        const hasShokupan = res.body.includes('https://curitipao.com.br/blog/shokupan-pao-japones/');
        const hasCortes = res.body.includes('https://curitipao.com.br/blog/por-que-fazer-cortes-na-massa-do-pao/');
        console.log(`    Sitemap has Shokupan: ${hasShokupan} | has Cortes: ${hasCortes}`);
        if (!hasShokupan || !hasCortes) allOk = false;
      }

      if (item.url === 'https://curitipao.com.br/blog/') {
        const hasShokupanCard = res.body.includes('/blog/shokupan-pao-japones/');
        const hasCortesCard = res.body.includes('/blog/por-que-fazer-cortes-na-massa-do-pao/');
        console.log(`    Blog Index has Shokupan card: ${hasShokupanCard} | has Cortes card: ${hasCortesCard}`);
        if (!hasShokupanCard || !hasCortesCard) allOk = false;
      }

      console.log('');
    } catch (err) {
      console.error(`[FAIL] ${item.url}: ${err.message}`);
      allOk = false;
    }
  }

  if (allOk) {
    console.log('=== PRODUCTION VALIDATION COMPLETE: ALL CHECKS PASSED 100% ===');
  } else {
    console.warn('=== PRODUCTION VALIDATION WARNING: SOME CHECKS NEED RETRY (DEPLOY MAY STILL BE PROPAGATING) ===');
    process.exit(1);
  }
}

verifyLive();
