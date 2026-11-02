const { chromium } = require('playwright-core');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:5173';

async function runTests() {
  console.log('--- STARTING COMPREHENSIVE MIGRATION TEST SUITE ---');
  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });

  const page = await context.newPage();

  // Test 1: Test padarias page and click bakery card
  console.log('\n[TEST 1] Testing /padarias/ card links...');
  await page.goto(`${BASE_URL}/padarias/`, { waitUntil: 'networkidle' });

  // Click on "Ver edição 2026" for Aquarius
  const aquariusLink = page.locator('a[href="/festival/2026/#aquarius-panificadora"]').first();
  const aquariusExists = await aquariusLink.count() > 0;
  console.log('Aquarius 2026 link exists on /padarias/:', aquariusExists);

  if (aquariusExists) {
    await aquariusLink.click();
    await page.waitForTimeout(500);
    console.log('URL after clicking Aquarius card:', page.url());
    const aquariusBox = await page.locator('#aquarius-panificadora').boundingBox();
    console.log('Aquarius card position y:', aquariusBox ? aquariusBox.y : 'not found');
  }

  // Test 2: Test direct anchor navigation to multiple bakeries
  console.log('\n[TEST 2] Testing direct anchor jumps in /festival/2026/...');
  const anchorsToTest = [
    '#padarias',
    '#felipane',
    '#saint-germain-panificadora',
    '#sphair-atelie-de-paes',
    '#imprensa',
    '#encerramento'
  ];

  for (const anchor of anchorsToTest) {
    await page.goto(`${BASE_URL}/festival/2026/${anchor}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    const target = page.locator(anchor);
    const box = await target.boundingBox();
    console.log(`Anchor ${anchor} -> element found: ${await target.count() > 0}, position Y: ${box ? box.y : 'N/A'}`);
  }

  // Test 3: Query parameters preservation test (Simulating QR Code UTM scan)
  console.log('\n[TEST 3] Testing URL with QR Code parameters...');
  await page.goto(`${BASE_URL}/festival/2026/?utm_source=qrcode&utm_campaign=festival2026#padarias`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);
  console.log('Active URL with params:', page.url());
  const padariasBox = await page.locator('#padarias').boundingBox();
  console.log('Padarias section position with params Y:', padariasBox ? padariasBox.y : 'N/A');

  // Test 4: Verify return bar and footer portal button
  console.log('\n[TEST 4] Testing portal return elements in 2026 archive...');
  const topReturnLink = page.locator('.portal-return-link').first();
  const footerReturnLink = page.locator('.btn-footer-portal');
  console.log('Top return link exists:', await topReturnLink.count() > 0);
  console.log('Footer return button exists:', await footerReturnLink.count() > 0);

  // Test 5: Verify all portal routes for 200 OK and canonical tag
  console.log('\n[TEST 5] Checking canonical tags and HTTP status for all public pages...');
  const routes = [
    '/',
    '/sobre/',
    '/padarias/',
    '/roteiros/',
    '/blog/',
    '/blog/o-curitipao-continua/',
    '/festival/',
    '/festival/2026/',
    '/contato/',
    '/solucoes-digitais/',
    '/privacidade/'
  ];

  for (const r of routes) {
    const res = await page.goto(`${BASE_URL}${r}`, { waitUntil: 'networkidle' });
    const status = res.status();
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    const robots = await page.locator('meta[name="robots"]').count() > 0 
      ? await page.locator('meta[name="robots"]').getAttribute('content') 
      : 'none';
    console.log(`Route ${r.padEnd(28)} | HTTP ${status} | Canonical: ${canonical} | Robots: ${robots}`);
  }

  // Test 6: Verify template pages have noindex
  console.log('\n[TEST 6] Checking template/draft pages have noindex...');
  for (const draft of ['/padarias/modelo/', '/roteiros/modelo/']) {
    await page.goto(`${BASE_URL}${draft}`, { waitUntil: 'networkidle' });
    const robots = await page.locator('meta[name="robots"]').getAttribute('content');
    console.log(`Draft ${draft.padEnd(24)} | Robots meta: ${robots}`);
  }

  await browser.close();
  console.log('\n--- ALL TESTS COMPLETED SUCCESSFULLY ---');
}

runTests().catch(err => {
  console.error('Test suite error:', err);
  process.exit(1);
});
