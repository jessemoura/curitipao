const { chromium } = require('playwright-core');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:5173';
const outDir = 'C:\\Users\\Jesse\\.gemini\\antigravity-ide\\brain\\68a17cf5-6727-477d-93bf-43c3c9374475';

async function capture() {
  console.log('--- CAPTURING HEADER SCREENSHOT ---');
  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true
  });

  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });

  // Locate the header
  const header = page.locator('header.site-header');
  const outPath = path.join(outDir, 'header_corrigido.png');
  await header.screenshot({ path: outPath });
  console.log('Header screenshot saved to:', outPath);

  // Also take full desktop viewport of top of page
  const fullTopPath = path.join(outDir, 'top_page_corrigido.png');
  await page.screenshot({ path: fullTopPath, clip: { x: 0, y: 0, width: 1280, height: 400 } });
  console.log('Top page screenshot saved to:', fullTopPath);

  await browser.close();
}

capture().catch(err => {
  console.error('Capture error:', err);
  process.exit(1);
});
