const { chromium } = require('playwright-core');
const fs = require('fs');

const sources = [
  {
    name: 'Band',
    url: 'https://www.band.com.br/nacional/pr/festival-curitipao-destaca-paes-artesanais-em-curitiba'
  },
  {
    name: 'CBN Curitiba',
    url: 'https://cbncuritiba.com.br/materias/festival-curitipao-vai-ate-sexta-30-em-15-padarias-de-curitiba-ouca-a-coluna/'
  },
  {
    name: 'Where Curitiba',
    url: 'https://www.wherecuritiba.com.br/festival-curitipao-reune-15-padarias-com-criacoes-exclusivas/'
  },
  {
    name: 'Notícias de Curitiba',
    url: 'https://www.noticiasdecuritiba.com.br/materia/festival-curitipao-2026-curitiba-15-padarias-receitas-exclusivas'
  },
  {
    name: 'Júlio Zaruch',
    url: 'https://juliozaruch.com.br/gastronomia/festival-de-padarias-de-20-a-30-de-outubro/'
  },
  {
    name: 'O Que Fazer Curitiba',
    url: 'https://oquefazercuritiba.com.br/curitiba-vai-ficar-com-cheiro-de-pao-quentinho-vem-ai-o-festival-curitipao/'
  },
  {
    name: 'Bem Paraná - Comer e Curtir 05/10',
    url: 'https://www.bemparana.com.br/publicacao/blogs/comerecurtir/curitipao-reune-15-padarias-com-criacoes-exclusivas-em-curitiba/'
  },
  {
    name: 'Curitiba Honesta - Agenda 23/10',
    url: 'https://curitibahonesta.com.br/final-de-semana-chegou-e-que-tem-para-fazer/'
  }
];

async function inspect() {
  const possiblePaths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
  ];
  let execPath = possiblePaths.find(p => fs.existsSync(p));

  const browser = await chromium.launch({
    executablePath: execPath,
    headless: true
  });

  const page = await browser.newPage({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });

  const results = [];

  for (const item of sources) {
    console.log(`\nChecking: ${item.name} (${item.url})`);
    try {
      const response = await page.goto(item.url, { waitUntil: 'domcontentloaded', timeout: 25000 });
      const status = response ? response.status() : 'no-response';
      
      await page.waitForTimeout(1500);

      const data = await page.evaluate(() => {
        const h1 = document.querySelector('h1')?.innerText?.trim() || '';
        const title = document.title || '';
        const timeEl = document.querySelector('time')?.innerText?.trim() || document.querySelector('time')?.getAttribute('datetime') || '';
        const metaDate = document.querySelector('meta[property="article:published_time"]')?.getAttribute('content') 
          || document.querySelector('meta[name="publish-date"]')?.getAttribute('content')
          || document.querySelector('meta[name="date"]')?.getAttribute('content')
          || '';
        
        // Search text for date pattern
        const bodyText = document.body ? document.body.innerText : '';
        const dateMatch = bodyText.match(/\b(\d{1,2}[\/\.-]\d{1,2}[\/\.-]\d{2,4})\b/);

        // Check audio
        const audioTags = document.querySelectorAll('audio, iframe[src*="spotify"], iframe[src*="soundcloud"], iframe[src*="cbn"], iframe[src*="podcast"], [class*="audio"], [class*="player"]');
        const hasAudio = audioTags.length > 0;
        const audioSrcs = Array.from(audioTags).map(a => a.src || a.getAttribute('src') || a.className).slice(0, 3);

        // Check video
        const videoTags = document.querySelectorAll('video, iframe[src*="youtube"], iframe[src*="vimeo"]');
        const hasVideo = videoTags.length > 0;

        return {
          h1,
          title,
          timeEl,
          metaDate,
          firstDateInText: dateMatch ? dateMatch[1] : null,
          hasAudio,
          audioSrcs,
          hasVideo
        };
      });

      results.push({
        name: item.name,
        url: item.url,
        status,
        ...data
      });
      console.log(`STATUS: ${status} | H1: ${data.h1} | Date: ${data.timeEl || data.metaDate || data.firstDateInText} | Audio: ${data.hasAudio}`);
    } catch (err) {
      console.log(`ERROR on ${item.name}: ${err.message}`);
      results.push({
        name: item.name,
        url: item.url,
        error: err.message
      });
    }
  }

  await browser.close();

  fs.writeFileSync('scripts/press_inspection_results.json', JSON.stringify(results, null, 2), 'utf8');
  console.log('\nWrote inspection results to scripts/press_inspection_results.json');
}

inspect();
