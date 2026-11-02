const { chromium } = require('playwright-core');

const blockedUrls = [
  { name: 'CBN Curitiba', url: 'https://cbncuritiba.com.br/materias/festival-curitipao-vai-ate-sexta-30-em-15-padarias-de-curitiba-ouca-a-coluna/' },
  { name: 'Bem Paraná — Comer e Curtir 1', url: 'https://www.bemparana.com.br/publicacao/blogs/comerecurtir/festival-curitipao-reune-criacoes-exclusivas-em-15-padarias-de-curitiba/' },
  { name: 'Bem Paraná — Comer e Curtir 2', url: 'https://www.bemparana.com.br/publicacao/blogs/comerecurtir/festival-curitipao-reune-criacoes-exclusivas-em-15-padarias-ate-sexta-feira/' },
  { name: 'Bem Paraná — Mesa Dividida 1', url: 'https://www.bemparana.com.br/publicacao/blogs/mesadividida/curitiba-celebra-a-arte-de-fazer-pao-com-o-festival-curitipao/' },
  { name: 'Bem Paraná — Mesa Dividida 2', url: 'https://www.bemparana.com.br/publicacao/blogs/mesadividida/curitiba-celebra-a-panificacao-autoral/' }
];

async function checkWithBrowser() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });

  const page = await browser.newPage();
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'pt-BR,pt;q=0.9'
  });

  for (const item of blockedUrls) {
    console.log('Visiting:', item.name);
    try {
      const res = await page.goto(item.url, { waitUntil: 'domcontentloaded', timeout: 25000 });
      const status = res ? res.status() : 'unknown';
      const title = await page.title();
      
      // Look for h1, dates, audio
      const h1 = await page.$eval('h1', el => el.innerText).catch(() => '');
      
      // date
      const dateText = await page.evaluate(() => {
        const timeEl = document.querySelector('time');
        if (timeEl) return timeEl.getAttribute('datetime') || timeEl.innerText;
        const metaDate = document.querySelector('meta[property="article:published_time"]');
        if (metaDate) return metaDate.getAttribute('content');
        return document.body.innerText.match(/\d{1,2}\s+de\s+[a-zç]+\s+de\s+\d{4}/i)?.[0] || '';
      });

      // audio
      const hasAudio = await page.evaluate(() => {
        return !!(document.querySelector('audio') || document.querySelector('iframe[src*="audio"]') || document.querySelector('iframe[src*="cbn"]') || document.querySelector('iframe[src*="soundcloud"]') || document.querySelector('iframe[src*="spotify"]') || document.querySelector('.audio-player') || document.querySelector('[class*="audio"]'));
      });

      // body text check for festival
      const hasFestival = await page.evaluate(() => {
        return document.body.innerText.toLowerCase().includes('curitipão') || document.body.innerText.toLowerCase().includes('curitipao');
      });

      console.log('Result for:', item.name);
      console.log('  Status:', status);
      console.log('  Title (tag):', title);
      console.log('  H1:', h1);
      console.log('  Date:', dateText);
      console.log('  Has Audio:', hasAudio);
      console.log('  Confirms Festival:', hasFestival);
    } catch (err) {
      console.log('  Error visiting:', item.name, err.message);
    }
  }

  await browser.close();
}

checkWithBrowser();
