const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': 'CuritiPao-Verification/2.0' } }, res => {
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
  console.log('=== VERIFYING PRODUCTION DEPLOYMENT FOR HISTORIAS DO PAO JPGs ===\n');

  const images = [
    'origem-do-pao.jpg',
    'pao-islandia.jpg',
    'lavash-armenia.jpg',
    'shokupan.jpg',
    'cortes-no-pao.jpg',
    'historia-da-baguete-francesa.jpg',
    'historia-do-panetone.jpg',
    'pao-alemao-pumpernickel.jpg'
  ];

  let allOk = true;

  console.log('--- Checking 8 JPG files in production ---');
  for (const img of images) {
    const url = `https://curitipao.com.br/assets/photos/blog/historias-do-pao/${img}`;
    try {
      const res = await fetchUrl(url);
      const is200 = res.statusCode === 200;
      const cType = res.headers['content-type'] || '';
      const isJpg = cType.includes('image/jpeg');
      console.log(`[HTTP ${res.statusCode}] ${img} -> Content-Type: ${cType}`);
      if (!is200 || !isJpg) allOk = false;
    } catch (e) {
      console.error(`[FAIL] ${url}: ${e.message}`);
      allOk = false;
    }
  }

  console.log('\n--- Checking 4 Live Articles HTML & Open Graph ---');
  const articles = [
    { slug: 'como-surgiu-o-pao', file: 'origem-do-pao.jpg' },
    { slug: 'pao-islandia-calor-da-terra', file: 'pao-islandia.jpg' },
    { slug: 'lavash-pao-tradicional-armenia', file: 'lavash-armenia.jpg' },
    { slug: 'shokupan-pao-japones', file: 'shokupan.jpg' }
  ];

  for (const art of articles) {
    const url = `https://curitipao.com.br/blog/${art.slug}/`;
    try {
      const res = await fetchUrl(url);
      const is200 = res.statusCode === 200;
      const hasImgSrc = res.body.includes(`/assets/photos/blog/historias-do-pao/${art.file}`);
      const hasOg = res.body.includes(`property="og:image" content="https://curitipao.com.br/assets/photos/blog/historias-do-pao/${art.file}"`);
      const hasTw = res.body.includes(`name="twitter:image" content="https://curitipao.com.br/assets/photos/blog/historias-do-pao/${art.file}"`);
      console.log(`[HTTP ${res.statusCode}] /blog/${art.slug}/`);
      console.log(`    img src JPG: ${hasImgSrc} | og:image JPG: ${hasOg} | twitter:image JPG: ${hasTw}`);
      if (!is200 || !hasImgSrc || !hasOg) allOk = false;
    } catch (e) {
      console.error(`[FAIL] ${url}: ${e.message}`);
      allOk = false;
    }
  }

  console.log('\n--- Checking Blog Index ---');
  try {
    const res = await fetchUrl('https://curitipao.com.br/blog/');
    console.log(`[HTTP ${res.statusCode}] https://curitipao.com.br/blog/`);
    for (const art of articles) {
      const base = art.file.replace('.jpg', '');
      const hasCompiledJpg = new RegExp(`/assets/${base}(-[\\w-]+)?\\.jpg`).test(res.body);
      console.log(`    Card ${art.slug} references compiled JPG: ${hasCompiledJpg}`);
      if (!hasCompiledJpg) allOk = false;
    }
  } catch (e) {
    console.error(`[FAIL] https://curitipao.com.br/blog/: ${e.message}`);
    allOk = false;
  }

  console.log(`\n=== FINAL STATUS: ${allOk ? 'ALL PASS (100% IN PRODUCTION)' : 'CHECKS PENDING / PROPAGATING'} ===`);
  if (!allOk) process.exit(1);
}

verifyLive();
