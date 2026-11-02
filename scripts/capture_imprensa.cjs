const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

async function capture() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });

  const outDir = path.join(__dirname, '../capturas');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  // 1. Desktop - Festival 2026 Seção Imprensa (Light mode)
  const contextDesktop = await browser.newContext({
    viewport: { width: 1280, height: 900 }
  });
  const pageDesktop = await contextDesktop.newPage();
  console.log('Navigating to http://localhost:5173/festival/2026/#imprensa ...');
  await pageDesktop.goto('http://localhost:5173/festival/2026/#imprensa', { waitUntil: 'networkidle' });
  await pageDesktop.evaluate(() => {
    localStorage.setItem('curitipao_cookies_consent', 'accepted');
    document.querySelectorAll('.cookie-banner, #cookie-consent-banner').forEach(el => el.remove());
  });
  await pageDesktop.waitForTimeout(400);

  const imprensaSection = await pageDesktop.$('#imprensa');
  if (imprensaSection) {
    await imprensaSection.screenshot({
      path: path.join(outDir, 'imprensa_desktop_claro.png')
    });
    console.log('Saved capturas/imprensa_desktop_claro.png');
  }

  // 2. Desktop - Dark Mode
  await pageDesktop.emulateMedia({ colorScheme: 'dark' });
  await pageDesktop.waitForTimeout(400);
  if (imprensaSection) {
    await imprensaSection.screenshot({
      path: path.join(outDir, 'imprensa_desktop_escuro.png')
    });
    console.log('Saved capturas/imprensa_desktop_escuro.png');
  }

  // 3. Mobile - Festival 2026 Seção Imprensa
  const contextMobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
  });
  const pageMobile = await contextMobile.newPage();
  await pageMobile.goto('http://localhost:5173/festival/2026/#imprensa', { waitUntil: 'networkidle' });
  await pageMobile.evaluate(() => {
    localStorage.setItem('curitipao_cookies_consent', 'accepted');
    document.querySelectorAll('.cookie-banner, #cookie-consent-banner').forEach(el => el.remove());
  });
  await pageMobile.waitForTimeout(400);

  const imprensaMobile = await pageMobile.$('#imprensa');
  if (imprensaMobile) {
    await imprensaMobile.screenshot({
      path: path.join(outDir, 'imprensa_mobile.png')
    });
    console.log('Saved capturas/imprensa_mobile.png');
  }

  // 4. Desktop - /festival/ com banner e link "Ver repercussão na imprensa"
  const pageFestHub = await contextDesktop.newPage();
  await pageFestHub.goto('http://localhost:5173/festival/', { waitUntil: 'networkidle' });
  await pageFestHub.evaluate(() => {
    localStorage.setItem('curitipao_cookies_consent', 'accepted');
    document.querySelectorAll('.cookie-banner, #cookie-consent-banner').forEach(el => el.remove());
  });
  await pageFestHub.waitForTimeout(400);

  const banner = await pageFestHub.$('.continuity-banner');
  if (banner) {
    await banner.screenshot({
      path: path.join(outDir, 'festival_hub_banner_imprensa.png')
    });
    console.log('Saved capturas/festival_hub_banner_imprensa.png');
  }

  await browser.close();
  console.log('All screenshots captured successfully!');
}

capture().catch(err => {
  console.error(err);
  process.exit(1);
});
