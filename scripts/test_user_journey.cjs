const { chromium } = require('playwright-core');
const path = require('path');

async function testJourney() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 }
  });
  const page = await context.newPage();

  console.log('1. Navigating to http://localhost:5173/ ...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });

  // Dismiss cookie banner
  await page.evaluate(() => {
    localStorage.setItem('curitipao_cookies_consent', 'accepted');
    document.querySelectorAll('.cookie-banner, #cookie-consent-banner').forEach(el => el.remove());
  });

  console.log('2. Clicking "Festival" in header navigation...');
  const festivalNavLink = await page.$('.nav-desktop a[href="/festival/"]');
  if (!festivalNavLink) {
    console.error('ERROR: Could not find Festival link in desktop nav!');
  } else {
    await festivalNavLink.click();
    await page.waitForLoadState('networkidle');
    console.log('Current URL after clicking Festival:', page.url());
  }

  // Dismiss cookie banner again on /festival/
  await page.evaluate(() => {
    localStorage.setItem('curitipao_cookies_consent', 'accepted');
    document.querySelectorAll('.cookie-banner, #cookie-consent-banner').forEach(el => el.remove());
  });

  console.log('3. Checking "Ver repercussão na imprensa" button on /festival/...');
  const pressBtn = await page.$('a[href="/festival/2026/#imprensa"]');
  if (!pressBtn) {
    console.error('ERROR: Button a[href="/festival/2026/#imprensa"] NOT found on /festival/!');
  } else {
    const text = await pressBtn.innerText();
    const isVisible = await pressBtn.isVisible();
    const boundingBox = await pressBtn.boundingBox();
    console.log('Found button text:', text.trim());
    console.log('Is visible:', isVisible);
    console.log('Bounding box:', boundingBox);

    console.log('4. Clicking "Ver repercussão na imprensa"...');
    await pressBtn.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(600);
    console.log('Current URL after click:', page.url());

    // Check scroll position and header occlusion
    const scrollY = await page.evaluate(() => window.scrollY);
    const imprensaTitle = await page.$('#imprensa-titulo');
    const returnBar = await page.$('.portal-return-bar');

    let titleBox = null;
    let returnBarBox = null;
    if (imprensaTitle) titleBox = await imprensaTitle.boundingBox();
    if (returnBar) returnBarBox = await returnBar.boundingBox();

    console.log('Window scrollY:', scrollY);
    console.log('Imprensa title bounding box:', titleBox);
    console.log('Return bar bounding box:', returnBarBox);

    if (titleBox && returnBarBox) {
      const isOccluded = (titleBox.y < (returnBarBox.y + returnBarBox.height));
      console.log('Is title occluded by return bar?:', isOccluded);
      if (isOccluded) {
        console.log('Overlap amount:', (returnBarBox.y + returnBarBox.height) - titleBox.y);
      }
    }
  }

  await browser.close();
}

testJourney().catch(err => {
  console.error('Error in testJourney:', err);
  process.exit(1);
});
