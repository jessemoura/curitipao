const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

async function verifyFullFlow() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });

  const outDir = path.join(__dirname, '../capturas');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  console.log('--- TEST 1: DESKTOP FLOW ---');
  const contextDesk = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const pageDesk = await contextDesk.newPage();

  // 1. Home
  await pageDesk.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await pageDesk.evaluate(() => {
    localStorage.setItem('curitipao_cookies_consent', 'accepted');
    document.querySelectorAll('.cookie-banner, #cookie-consent-banner').forEach(el => el.remove());
  });

  // 2. Click "Festival" in desktop menu
  const festLinkDesk = await pageDesk.$('.nav-desktop a[href="/festival/"]');
  console.log('Desktop "Festival" link found:', !!festLinkDesk);
  await festLinkDesk.click();
  await pageDesk.waitForLoadState('networkidle');
  await pageDesk.waitForTimeout(400);
  console.log('Arrived at URL:', pageDesk.url());

  // Dismiss cookie banner on /festival/
  await pageDesk.evaluate(() => {
    localStorage.setItem('curitipao_cookies_consent', 'accepted');
    document.querySelectorAll('.cookie-banner, #cookie-consent-banner').forEach(el => el.remove());
  });

  // Capture /festival/ page showing both buttons
  await pageDesk.screenshot({
    path: path.join(outDir, 'fluxo_1_festival_hub_desktop.png'),
    fullPage: false
  });
  console.log('Saved capturas/fluxo_1_festival_hub_desktop.png');

  // 3. Click "Ver repercussão na imprensa"
  const pressBtnDesk = await pageDesk.$('a[href="/festival/2026/#imprensa"]');
  console.log('Button "Ver repercussão na imprensa" found:', !!pressBtnDesk);
  await pressBtnDesk.click();
  await pageDesk.waitForLoadState('networkidle');
  await pageDesk.waitForTimeout(700);
  console.log('Arrived at URL after click:', pageDesk.url());

  // Dismiss cookie banner on /festival/2026/
  await pageDesk.evaluate(() => {
    localStorage.setItem('curitipao_cookies_consent', 'accepted');
    document.querySelectorAll('.cookie-banner, #cookie-consent-banner').forEach(el => el.remove());
  });

  // Verify header occlusion on desktop
  const deskTitle = await pageDesk.$('#imprensa-titulo');
  const deskReturnBar = await pageDesk.$('.portal-return-bar');
  const titleBox = deskTitle ? await deskTitle.boundingBox() : null;
  const barBox = deskReturnBar ? await deskReturnBar.boundingBox() : null;

  console.log('Desktop title box:', titleBox);
  console.log('Desktop return bar box:', barBox);
  if (titleBox && barBox) {
    const isOccluded = titleBox.y < (barBox.y + barBox.height);
    console.log('Is desktop title occluded?:', isOccluded);
  }

  // Capture viewport showing the scrolled #imprensa section
  await pageDesk.screenshot({
    path: path.join(outDir, 'fluxo_2_imprensa_ancora_desktop.png'),
    fullPage: false
  });
  console.log('Saved capturas/fluxo_2_imprensa_ancora_desktop.png');

  console.log('\n--- TEST 2: MOBILE FLOW ---');
  const contextMob = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
  });
  const pageMob = await contextMob.newPage();

  // 1. Home Mobile
  await pageMob.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await pageMob.evaluate(() => {
    localStorage.setItem('curitipao_cookies_consent', 'accepted');
    document.querySelectorAll('.cookie-banner, #cookie-consent-banner').forEach(el => el.remove());
  });

  // 2. Open drawer & click Festival
  await pageMob.click('.menu-toggle-btn');
  await pageMob.waitForTimeout(300);
  await pageMob.click('.mobile-nav-drawer a[href="/festival/"]');
  await pageMob.waitForLoadState('networkidle');
  await pageMob.waitForTimeout(400);
  console.log('Mobile arrived at URL:', pageMob.url());

  // Dismiss cookie banner
  await pageMob.evaluate(() => {
    localStorage.setItem('curitipao_cookies_consent', 'accepted');
    document.querySelectorAll('.cookie-banner, #cookie-consent-banner').forEach(el => el.remove());
  });

  // Capture /festival/ on mobile
  await pageMob.screenshot({
    path: path.join(outDir, 'fluxo_3_festival_hub_mobile.png'),
    fullPage: false
  });
  console.log('Saved capturas/fluxo_3_festival_hub_mobile.png');

  // 3. Click "Ver repercussão na imprensa" on mobile
  const pressBtnMob = await pageMob.$('a[href="/festival/2026/#imprensa"]');
  console.log('Mobile "Ver repercussão na imprensa" found:', !!pressBtnMob);
  await pressBtnMob.click();
  await pageMob.waitForLoadState('networkidle');
  await pageMob.waitForTimeout(700);
  console.log('Mobile arrived at URL after click:', pageMob.url());

  // Dismiss cookie banner
  await pageMob.evaluate(() => {
    localStorage.setItem('curitipao_cookies_consent', 'accepted');
    document.querySelectorAll('.cookie-banner, #cookie-consent-banner').forEach(el => el.remove());
  });

  // Verify header occlusion on mobile
  const mobTitle = await pageMob.$('#imprensa-titulo');
  const mobReturnBar = await pageMob.$('.portal-return-bar');
  const mTitleBox = mobTitle ? await mobTitle.boundingBox() : null;
  const mBarBox = mobReturnBar ? await mobReturnBar.boundingBox() : null;

  console.log('Mobile title box:', mTitleBox);
  console.log('Mobile return bar box:', mBarBox);
  if (mTitleBox && mBarBox) {
    const isOccludedMob = mTitleBox.y < (mBarBox.y + mBarBox.height);
    console.log('Is mobile title occluded?:', isOccludedMob);
  }

  // Capture viewport showing the scrolled #imprensa section on mobile
  await pageMob.screenshot({
    path: path.join(outDir, 'fluxo_4_imprensa_ancora_mobile.png'),
    fullPage: false
  });
  console.log('Saved capturas/fluxo_4_imprensa_ancora_mobile.png');

  await browser.close();
  console.log('\nFULL FLOW VERIFICATION COMPLETE!');
}

verifyFullFlow().catch(err => {
  console.error('Error in verifyFullFlow:', err);
  process.exit(1);
});
