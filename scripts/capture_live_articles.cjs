const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright-core');

const artifactDir = 'C:\\Users\\Jesse\\.gemini\\antigravity\\brain\\faeb36a3-aba3-4c94-a8cf-e202e9054597';

async function runVisualChecks() {
  console.log('=== RUNNING LIVE VISUAL AND RESPONSIVE CHECKS ===');

  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true
  });

  const targets = [
    {
      name: 'shokupan',
      url: 'https://curitipao.com.br/blog/shokupan-pao-japones/'
    },
    {
      name: 'cortes',
      url: 'https://curitipao.com.br/blog/por-que-fazer-cortes-na-massa-do-pao/'
    }
  ];

  for (const target of targets) {
    console.log(`\nTesting ${target.name} (${target.url})...`);

    // 1. Desktop 1280x800
    const desktopContext = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const pageDesktop = await desktopContext.newPage();
    await pageDesktop.goto(target.url, { waitUntil: 'networkidle' });

    // Dismiss cookie banner if present
    try {
      const btn = await pageDesktop.$('.cookie-consent-actions button, #cookie-accept-btn, button:has-text("Aceitar")');
      if (btn) await btn.click();
      await pageDesktop.waitForTimeout(200);
    } catch (e) {}

    const desktopOverflow = await pageDesktop.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    console.log(`  [Desktop 1280px] Horizontal overflow: ${desktopOverflow ? 'FAIL (overflow detected)' : 'PASS (clean)'}`);

    const desktopShot = path.join(artifactDir, `live-${target.name}-desktop.png`);
    await pageDesktop.screenshot({ path: desktopShot, fullPage: false });
    console.log(`  Saved screenshot: live-${target.name}-desktop.png`);
    await desktopContext.close();

    // 2. Mobile 375x812 (iPhone X/12)
    const mobileContext = await browser.newContext({ viewport: { width: 375, height: 812 } });
    const pageMobile = await mobileContext.newPage();
    await pageMobile.goto(target.url, { waitUntil: 'networkidle' });
    try {
      const btn = await pageMobile.$('.cookie-consent-actions button, #cookie-accept-btn, button:has-text("Aceitar")');
      if (btn) await btn.click();
      await pageMobile.waitForTimeout(200);
    } catch (e) {}

    const mobileOverflow = await pageMobile.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    console.log(`  [Mobile 375px] Horizontal overflow: ${mobileOverflow ? 'FAIL (overflow detected)' : 'PASS (clean)'}`);

    const mobileShot = path.join(artifactDir, `live-${target.name}-mobile-375.png`);
    await pageMobile.screenshot({ path: mobileShot, fullPage: false });
    console.log(`  Saved screenshot: live-${target.name}-mobile-375.png`);
    await mobileContext.close();

    // 3. Mobile 320x568 (Small device)
    const smallContext = await browser.newContext({ viewport: { width: 320, height: 568 } });
    const pageSmall = await smallContext.newPage();
    await pageSmall.goto(target.url, { waitUntil: 'networkidle' });
    const smallOverflow = await pageSmall.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    console.log(`  [Mobile 320px] Horizontal overflow: ${smallOverflow ? 'FAIL (overflow detected)' : 'PASS (clean)'}`);
    await smallContext.close();
  }

  // Also check Blog index desktop
  const blogContext = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const pageBlog = await blogContext.newPage();
  await pageBlog.goto('https://curitipao.com.br/blog/', { waitUntil: 'networkidle' });
  const blogShot = path.join(artifactDir, 'live-blog-index-with-new-articles.png');
  await pageBlog.screenshot({ path: blogShot, fullPage: false });
  console.log(`\nSaved blog index screenshot: live-blog-index-with-new-articles.png`);
  await blogContext.close();

  await browser.close();
  console.log('\n=== ALL VISUAL AND RESPONSIVE CHECKS COMPLETE ===');
}

runVisualChecks().catch(err => {
  console.error('Error during visual checks:', err);
  process.exit(1);
});
