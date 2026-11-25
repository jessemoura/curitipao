const path = require('path');
const { chromium } = require('playwright-core');

async function checkOverflow() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true
  });
  const context = await browser.newContext({
    viewport: { width: 375, height: 667 },
    isMobile: true
  });
  const page = await context.newPage();
  const fileUrl = 'file:///' + path.resolve('dist/roteiros/onde-comer-croissant-em-curitiba/index.html').replace(/\\/g, '/');
  await page.goto(fileUrl, { waitUntil: 'networkidle' });

  const overflowElements = await page.evaluate(() => {
    const docWidth = document.documentElement.clientWidth;
    const elements = document.querySelectorAll('*');
    const offenders = [];
    for (const el of elements) {
      const rect = el.getBoundingClientRect();
      if (rect.right > docWidth + 1 || rect.width > docWidth + 1) {
        offenders.push({
          tag: el.tagName,
          id: el.id,
          className: el.className,
          rectRight: rect.right,
          rectWidth: rect.width,
          outerHtml: el.outerHTML.slice(0, 100)
        });
      }
    }
    return offenders;
  });

  console.log('Offenders found:', overflowElements.length);
  overflowElements.slice(0, 15).forEach((off, i) => {
    console.log(`${i}: <${off.tag} id="${off.id}" class="${off.className}"> right=${off.rectRight} width=${off.rectWidth}`);
    console.log('   snippet:', off.outerHtml);
  });

  await browser.close();
}

checkOverflow().catch(console.error);
