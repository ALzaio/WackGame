// Builds slides.pdf: one 1920×1080 page per scene, each showing the scene's final beat.
// Usage (needs Node + Playwright with Chromium):  node tools/make-slides-pdf.js
const path = require('path');
const { chromium } = require('playwright');

(async () => {
  const root = path.resolve(__dirname, '..');
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto('file://' + path.join(root, 'index.html') + '?print');
  await page.waitForFunction(() => document.body.dataset.ready === '1');
  await page.evaluate(() => Promise.all([...document.images].map(im => (im.complete ? 0 : new Promise(r => { im.onload = im.onerror = r; })))));
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({
    path: path.join(root, 'slides.pdf'),
    width: '1920px', height: '1080px', printBackground: true, preferCSSPageSize: true,
  });
  await browser.close();
  console.log('wrote', path.join(root, 'slides.pdf'));
})();
