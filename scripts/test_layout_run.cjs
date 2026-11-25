const path = require('path');
const { chromium } = require('playwright-core');

async function testLayout() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true
  });

  const fileUrl = 'file:///' + path.resolve('scripts/test_layout.html').replace(/\\/g, '/');

  // Desktop
  const contextDesktop = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const pageDesktop = await contextDesktop.newPage();
  await pageDesktop.goto(fileUrl, { waitUntil: 'networkidle' });

  const desktopStats = await pageDesktop.evaluate(() => {
    const figures = Array.from(document.querySelectorAll('.roteiro-internal-figure'));
    return figures.map((f, i) => {
      const img = f.querySelector('img');
      const fRect = f.getBoundingClientRect();
      const iRect = img.getBoundingClientRect();
      return {
        index: i,
        figure: { width: Math.round(fRect.width), height: Math.round(fRect.height) },
        image: { width: Math.round(iRect.width), height: Math.round(iRect.height) }
      };
    });
  });

  console.log('Desktop Dimensions (target: max ~560px w, ~440px h):', JSON.stringify(desktopStats, null, 2));

  await pageDesktop.screenshot({
    path: 'capturas/test-layout-desktop.png',
    fullPage: true
  });

  // Mobile 375px
  const contextMobile = await browser.newContext({ viewport: { width: 375, height: 667 }, isMobile: true });
  const pageMobile = await contextMobile.newPage();
  await pageMobile.goto(fileUrl, { waitUntil: 'networkidle' });

  const mobileStats = await pageMobile.evaluate(() => {
    const figures = Array.from(document.querySelectorAll('.roteiro-internal-figure'));
    return figures.map((f, i) => {
      const img = f.querySelector('img');
      const fRect = f.getBoundingClientRect();
      const iRect = img.getBoundingClientRect();
      return {
        index: i,
        figure: { width: Math.round(fRect.width), height: Math.round(fRect.height) },
        image: { width: Math.round(iRect.width), height: Math.round(iRect.height) }
      };
    });
  });

  console.log('Mobile Dimensions (target: max ~380px h, fit width):', JSON.stringify(mobileStats, null, 2));

  await pageMobile.screenshot({
    path: 'capturas/test-layout-mobile.png',
    fullPage: true
  });

  await browser.close();
}

testLayout().catch(console.error);
