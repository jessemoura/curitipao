const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function runTests() {
  console.log('--- STARTING COMPREHENSIVE AUTOMATED VERIFICATION ---');
  const browser = await chromium.launch({
    executablePath: chromePath,
    headless: true
  });

  const capturasDir = path.resolve('capturas');
  if (!fs.existsSync(capturasDir)) fs.mkdirSync(capturasDir, { recursive: true });

  const results = {
    headerDesktop: null,
    headerMobile: null,
    homeRevisite: null,
    imprensaPage: null,
    imprensa2026Anchor: null,
    pressCardsCount: 0,
    pressCardsOrder: null,
    ricVideoImprensa: null,
    ricVideoFestival: null,
    hashRedirectDirect: null,
    hashRedirectDynamic: null,
    hashNoRedirectOther: null,
    photoCreditsFestival: null,
    disclaimersFestival: null,
    footerCredits: null,
    horizontalScrollIssues: []
  };

  try {
    const page = await browser.newPage();

    // 1. TEST VIEWPORTS & HEADER ORDER
    const viewports = [
      { name: 'mobile', width: 375, height: 667 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'notebook', width: 1024, height: 768 },
      { name: 'desktop', width: 1440, height: 900 }
    ];

    console.log('\n[TEST 1] Testing viewports and horizontal scroll...');
    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      const hasHScroll = scrollWidth > clientWidth;
      console.log(`- Viewport ${vp.name} (${vp.width}x${vp.height}): scrollWidth=${scrollWidth}, clientWidth=${clientWidth}, hasHScroll=${hasHScroll}`);
      if (hasHScroll) {
        results.horizontalScrollIssues.push(`${vp.name} (${scrollWidth} > ${clientWidth})`);
      }
    }

    // Desktop Header Links
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
    const desktopLinks = await page.$$eval('.nav-desktop .nav-link', els => els.map(el => el.textContent.trim()));
    console.log('\n[TEST 2] Desktop Header Links:', desktopLinks);
    const expectedOrder = ['Início', 'Padarias', 'Festival', 'Roteiros', 'Blog', 'Imprensa', 'Contato'];
    results.headerDesktop = JSON.stringify(desktopLinks) === JSON.stringify(expectedOrder);
    console.log('Desktop header exact match:', results.headerDesktop);

    const contactIsBtn = await page.$eval('.nav-desktop a[href="/contato/"]', el => el.classList.contains('nav-link-btn'));
    console.log('Contato has nav-link-btn class on desktop:', contactIsBtn);

    // Screenshot Desktop Header
    await page.screenshot({ path: path.join(capturasDir, '01_header_desktop.png'), clip: { x: 0, y: 0, width: 1440, height: 120 } });
    console.log('Saved 01_header_desktop.png');

    // Mobile Drawer Links
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
    await page.click('.menu-toggle-btn');
    await page.waitForTimeout(400); // animation

    const mobileLinks = await page.$$eval('.mobile-nav-links .mobile-nav-link', els => els.map(el => el.textContent.trim()));
    console.log('\n[TEST 3] Mobile Menu Links:', mobileLinks);
    results.headerMobile = JSON.stringify(mobileLinks) === JSON.stringify(expectedOrder);
    console.log('Mobile menu exact match:', results.headerMobile);

    const contactMobileIsBtn = await page.$eval('.mobile-nav-links a[href="/contato/"]', el => el.classList.contains('mobile-nav-btn'));
    console.log('Contato has mobile-nav-btn class on mobile:', contactMobileIsBtn);

    // Screenshot Mobile Header with Drawer
    await page.screenshot({ path: path.join(capturasDir, '02_header_mobile_drawer.png') });
    console.log('Saved 02_header_mobile_drawer.png');

    // 2. TEST HOME CORRECTION "Revisite"
    console.log('\n[TEST 4] Checking Home page "Revisite"...');
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
    const homeText = await page.content();
    results.homeRevisite = homeText.includes('Revisite a primeira edição do Festival CuritiPão') && !homeText.includes('Revise a primeira edição do Festival CuritiPão');
    console.log('Home "Revisite" verified:', results.homeRevisite);

    // Check Footer Credits CONEXUS Digital Solutions
    results.footerCredits = homeText.includes('CONEXUS Digital Solutions');
    console.log('Footer credits contain CONEXUS Digital Solutions:', results.footerCredits);

    // 3. TEST /imprensa/ PAGE
    console.log('\n[TEST 5] Testing /imprensa/ page...');
    await page.goto('http://localhost:5173/imprensa/', { waitUntil: 'networkidle' });

    const h1Text = await page.$eval('h1', el => el.textContent.trim());
    console.log('H1 text:', h1Text);
    results.imprensaPage = h1Text === 'CuritiPão na imprensa';

    // Check #2026 anchor
    const anchor2026 = await page.$('[id="2026"]');
    results.imprensa2026Anchor = !!anchor2026;
    console.log('Section #2026 exists:', results.imprensa2026Anchor);

    // Check Cards Count
    const cards = await page.$$('.press-grid .press-card');
    results.pressCardsCount = cards.length;
    console.log('Count of external press cards in grid:', results.pressCardsCount);

    // Check Ordering (Newest to Oldest)
    const cardDates = await page.$$eval('.press-grid .press-card .press-meta-date time', els => els.map(el => el.textContent.trim()));
    console.log('Card Dates (Chronological newest to oldest):', cardDates);

    // Verify ordering
    let isSorted = true;
    for (let i = 0; i < cardDates.length - 1; i++) {
      const d1 = new Date(cardDates[i].split('/').reverse().join('-')).getTime();
      const d2 = new Date(cardDates[i+1].split('/').reverse().join('-')).getTime();
      if (d1 < d2) {
        isSorted = false;
        break;
      }
    }
    results.pressCardsOrder = isSorted && cardDates.length === 17;
    console.log('Cards sorted newest to oldest and count 17:', results.pressCardsOrder);

    // Check RIC Video on /imprensa/
    const ricVideoImprensa = await page.$('.press-video-feature-card video');
    results.ricVideoImprensa = !!ricVideoImprensa;
    console.log('RIC video feature exists on /imprensa/:', results.ricVideoImprensa);

    // Capture /imprensa/ desktop screenshot
    await page.screenshot({ path: path.join(capturasDir, '03_imprensa_desktop.png'), fullPage: false });
    console.log('Saved 03_imprensa_desktop.png');

    // Capture /imprensa/ mobile screenshot
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:5173/imprensa/', { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(capturasDir, '04_imprensa_mobile.png'), fullPage: false });
    console.log('Saved 04_imprensa_mobile.png');

    // 4. TEST /festival/2026/ AND HASH REDIRECT
    console.log('\n[TEST 6] Testing /festival/2026/#imprensa hash forwarding...');
    await page.setViewportSize({ width: 1440, height: 900 });

    // Direct access to /festival/2026/#imprensa
    await page.goto('http://localhost:5173/festival/2026/#imprensa', { waitUntil: 'load' });
    await page.waitForTimeout(500);
    const directUrl = page.url();
    console.log('Direct access to /festival/2026/#imprensa resulted in URL:', directUrl);
    results.hashRedirectDirect = directUrl.includes('/imprensa/#2026');

    // Normal access to /festival/2026/ without hash
    await page.goto('http://localhost:5173/festival/2026/', { waitUntil: 'networkidle' });
    const festivalUrl = page.url();
    console.log('Normal access URL:', festivalUrl);

    // Dynamic hashchange to #imprensa
    await page.evaluate(() => { window.location.hash = '#imprensa'; });
    await page.waitForTimeout(500);
    const dynamicUrl = page.url();
    console.log('Dynamic hash change to #imprensa resulted in URL:', dynamicUrl);
    results.hashRedirectDynamic = dynamicUrl.includes('/imprensa/#2026');

    // Normal anchor #bonin must NOT redirect
    await page.goto('http://localhost:5173/festival/2026/#bonin', { waitUntil: 'load' });
    await page.waitForTimeout(500);
    const boninUrl = page.url();
    console.log('Anchor #bonin resulted in URL:', boninUrl);
    results.hashNoRedirectOther = boninUrl.includes('/festival/2026/#bonin');

    // Check RIC video in /festival/2026/
    await page.goto('http://localhost:5173/festival/2026/', { waitUntil: 'networkidle' });
    const ricVideoFestival = await page.$('.festival-video-featured-card video');
    results.ricVideoFestival = !!ricVideoFestival;
    console.log('RIC video player exists on /festival/2026/:', results.ricVideoFestival);

    const btnVerImprensa = await page.$eval('.festival-video-featured-card a', el => el.getAttribute('href'));
    console.log('RIC video button target:', btnVerImprensa);

    // Check Photo credits & disclaimers in /festival/2026/
    const festivalContent = await page.content();
    results.photoCreditsFestival = festivalContent.includes('Foto: Lorena Lenara Batista');
    results.disclaimersFestival = festivalContent.includes('Criação apresentada no Festival CuritiPão 2026. Consulte a padaria sobre a disponibilidade atual.');
    console.log('Photo credits "Foto: Lorena Lenara Batista" in /festival/2026/:', results.photoCreditsFestival);
    console.log('Creation disclaimers in /festival/2026/:', results.disclaimersFestival);

    console.log('\n--- FINAL AUDIT RESULTS ---');
    console.log(JSON.stringify(results, null, 2));

  } catch (err) {
    console.error('Error during automated tests:', err);
  } finally {
    await browser.close();
  }
}

runTests();
