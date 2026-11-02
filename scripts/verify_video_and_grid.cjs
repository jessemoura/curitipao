const { chromium } = require('playwright-core');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:5173';

async function verify() {
  console.log('--- VERIFYING VIDEO COVER & BAKERY GRID FIXES ---');
  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true
  });

  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  // 1. Check /festival/2026/
  console.log('Loading /festival/2026/...');
  await page.goto(`${BASE_URL}/festival/2026/`, { waitUntil: 'networkidle' });

  // Check video section
  const videoCoverImg = page.locator('#video-abertura img.video-cover-img');
  const imgCount = await videoCoverImg.count();
  console.log('Video cover img element found:', imgCount > 0);

  if (imgCount > 0) {
    const naturalWidth = await videoCoverImg.evaluate(img => img.naturalWidth);
    const currentSrc = await videoCoverImg.evaluate(img => img.currentSrc);
    console.log(`Video cover image currentSrc: ${currentSrc}`);
    console.log(`Video cover naturalWidth: ${naturalWidth} (valid image if > 0)`);
  }

  // 2. Check Bakery Cards Grid
  console.log('\nChecking Bakery Cards Grid structure...');
  const cards = page.locator('#padarias .card');
  const count = await cards.count();
  console.log(`Total bakery cards found in #padarias: ${count} (expected 15)`);

  // Check bounding boxes for first 6 cards to verify 3 columns
  const boxes = [];
  for (let i = 0; i < Math.min(6, count); i++) {
    const box = await cards.nth(i).boundingBox();
    boxes.push({ index: i, x: Math.round(box.x), y: Math.round(box.y), width: Math.round(box.width), height: Math.round(box.height) });
  }

  console.log('Cards bounding boxes (first 6):', boxes);

  // Group by Y to determine columns
  const row1 = boxes.filter(b => Math.abs(b.y - boxes[0].y) < 10);
  console.log(`Cards in first row on desktop (1280px): ${row1.length} (expected 3)`);

  // Check empty elements inside .cards container
  const emptyChildren = await page.evaluate(() => {
    const container = document.querySelector('.cards');
    if (!container) return -1;
    const directChildren = Array.from(container.children);
    return directChildren.map(c => ({
      tagName: c.tagName,
      className: c.className,
      id: c.id,
      width: c.offsetWidth,
      height: c.offsetHeight
    }));
  });

  console.log('\nDirect children of .cards container:', emptyChildren.length);
  emptyChildren.forEach((c, idx) => {
    console.log(`  [Child ${idx + 1}] <${c.tagName.toLowerCase()} class="${c.className}" id="${c.id}"> ${c.width}x${c.height}px`);
  });

  // Check mobile viewport
  console.log('\nTesting Mobile Viewport (375x667)...');
  await page.setViewportSize({ width: 375, height: 667 });
  await page.waitForTimeout(300);

  const mobileBoxes = [];
  for (let i = 0; i < 3; i++) {
    const box = await cards.nth(i).boundingBox();
    mobileBoxes.push({ index: i, x: Math.round(box.x), y: Math.round(box.y), width: Math.round(box.width) });
  }
  console.log('Mobile cards bounding boxes (first 3):', mobileBoxes);
  const isOneColMobile = mobileBoxes[0].x === mobileBoxes[1].x;
  console.log(`Is single column on mobile: ${isOneColMobile} (expected true)`);

  await browser.close();
  console.log('\n--- VERIFICATION FINISHED ---');
}

verify().catch(e => {
  console.error('Verification error:', e);
  process.exit(1);
});
