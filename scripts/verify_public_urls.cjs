const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, body: data }));
    }).on('error', reject);
  });
}

async function verify() {
  console.log('--- VERIFICANDO DOMÍNIO PÚBLICO CURITIPAO.COM.BR ---');

  // 1. Roteiro Croissant
  try {
    const res = await fetchUrl('https://curitipao.com.br/roteiros/onde-comer-croissant-em-curitiba/');
    console.log('[1] https://curitipao.com.br/roteiros/onde-comer-croissant-em-curitiba/');
    console.log('    HTTP Status:', res.statusCode);
    console.log('    Has H1 Title:', res.body.includes('Onde comer croissant no estilo francês em Curitiba'));
    console.log('    Has Noni "croi":', res.body.includes('croi'));
    console.log('    Has Maçã Sete de Setembro:', res.body.includes('Avenida Sete de Setembro, 4979'));
    console.log('    Has Curadoria CuritiPão:', res.body.includes('Curadoria CuritiPão'));
    console.log('    Has Cover Image:', res.body.includes('capa-croissant-curitiba-16x9.webp'));
  } catch (err) {
    console.error('Error fetching croissant article:', err.message);
  }

  // 2. Roteiros Index
  try {
    const res = await fetchUrl('https://curitipao.com.br/roteiros/');
    console.log('\n[2] https://curitipao.com.br/roteiros/');
    console.log('    HTTP Status:', res.statusCode);
    console.log('    Has Croissant Card Link:', res.body.includes('/roteiros/onde-comer-croissant-em-curitiba/'));
    console.log('    Has Croissant Card Title:', res.body.includes('Onde comer croissant no estilo francês em Curitiba'));
  } catch (err) {
    console.error('Error fetching roteiros index:', err.message);
  }

  // 3. Sitemap
  try {
    const res = await fetchUrl('https://curitipao.com.br/sitemap.xml');
    console.log('\n[3] https://curitipao.com.br/sitemap.xml');
    console.log('    HTTP Status:', res.statusCode);
    console.log('    Sitemap Has Croissant URL:', res.body.includes('https://curitipao.com.br/roteiros/onde-comer-croissant-em-curitiba/'));
  } catch (err) {
    console.error('Error fetching sitemap:', err.message);
  }
}

verify();
