const { chromium } = require('playwright-core');

async function testAnchorScroll() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });

  // Desktop
  const pageDesk = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await pageDesk.goto('http://localhost:5173/festival/2026/#imprensa', { waitUntil: 'networkidle' });
  await pageDesk.waitForTimeout(500);

  const deskReturnBar = await pageDesk.$('.portal-return-bar');
  const deskTitle = await pageDesk.$('#imprensa-titulo');
  const deskBadge = await pageDesk.$('.press-badge');

  const rBarBox = deskReturnBar ? await deskReturnBar.boundingBox() : null;
  const titleBox = deskTitle ? await deskTitle.boundingBox() : null;
  const badgeBox = deskBadge ? await deskBadge.boundingBox() : null;

  console.log('=== Desktop Anchor Check ===');
  console.log('Return bar box:', rBarBox);
  console.log('Badge box:', badgeBox);
  console.log('Title box:', titleBox);

  // Mobile
  const pageMob = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await pageMob.goto('http://localhost:5173/festival/2026/#imprensa', { waitUntil: 'networkidle' });
  await pageMob.waitForTimeout(500);

  const mobReturnBar = await pageMob.$('.portal-return-bar');
  const mobTitle = await pageMob.$('#imprensa-titulo');
  const mobBadge = await pageMob.$('.press-badge');

  const mobRBarBox = mobReturnBar ? await mobReturnBar.boundingBox() : null;
  const mobTitleBox = mobTitle ? await mobTitle.boundingBox() : null;
  const mobBadgeBox = mobBadge ? await mobBadge.boundingBox() : null;

  console.log('=== Mobile Anchor Check ===');
  console.log('Return bar box:', mobRBarBox);
  console.log('Badge box:', mobBadgeBox);
  console.log('Title box:', mobTitleBox);

  await browser.close();
}

testAnchorScroll().catch(console.error);
