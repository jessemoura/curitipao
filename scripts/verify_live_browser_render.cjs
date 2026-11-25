const { chromium } = require('playwright-core');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true
  });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  
  const urls = [
    'https://curitipao.com.br/blog/',
    'https://curitipao.com.br/blog/shokupan-pao-japones/',
    'https://curitipao.com.br/blog/como-surgiu-o-pao/',
    'https://curitipao.com.br/blog/pao-islandia-calor-da-terra/',
    'https://curitipao.com.br/blog/lavash-pao-tradicional-armenia/'
  ];
  
  for (const u of urls) {
    await page.goto(u, { waitUntil: 'networkidle' });
    const imgOk = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img')).filter(i => 
        i.src.includes('historias-do-pao') || 
        i.src.includes('shokupan') || 
        i.src.includes('origem-do-pao') ||
        i.src.includes('pao-islandia') ||
        i.src.includes('lavash-armenia')
      );
      return imgs.map(i => ({ 
        src: i.src.split('/').pop(), 
        naturalWidth: i.naturalWidth, 
        naturalHeight: i.naturalHeight,
        complete: i.complete 
      }));
    });
    console.log(u);
    console.log(imgOk);
  }
  await browser.close();
})();
