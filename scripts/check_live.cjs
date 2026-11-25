const https = require('https');

https.get('https://curitipao.com.br/roteiros/onde-comer-croissant-em-curitiba/?t=' + Date.now(), res => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Last-Modified header:', res.headers['last-modified']);
    console.log('x-hcdn-cache-status:', res.headers['x-hcdn-cache-status']);
    const cssMatch = data.match(/href="(\/assets\/main-[^"]+\.css)"/);
    console.log('CSS file in live HTML:', cssMatch ? cssMatch[1] : 'none');
    console.log('Has roteiro-internal-photo-stage:', data.includes('roteiro-internal-photo-stage'));
    console.log('Has roteiro-internal-figure:', data.includes('roteiro-internal-figure'));
    console.log('Has Maçã max-width 430px:', data.includes('max-width: min(100%, 430px)'));
    console.log('Has Origem max-width 342px:', data.includes('max-width: min(100%, 342px)'));
  });
}).on('error', err => console.error(err));
