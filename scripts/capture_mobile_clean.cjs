const { chromium } = require('playwright-core');

async function test() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  const cookie = await page.$('#btn-cookie-accept');
  if (cookie) await cookie.click();
  await page.waitForTimeout(300);
  const footer = await page.$('.site-footer');
  await footer.screenshot({ path: './capturas/rodape_mobile_limpo.png' });
  await browser.close();
  console.log('Captured rodape_mobile_limpo.png');
}
test();
