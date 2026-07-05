/* Pond Puzzle playtest — real mouse drags, completes a puzzle, checks save. */
const { chromium } = require('/private/tmp/claude-501/-Users-ltc-lilypad-os/52ebe3af-a02d-4e00-bdfe-a92d07ee7576/scratchpad/pw8yTj/node_modules/playwright-core');
const CHROME = '/Users/ltc/Library/Caches/ms-playwright/chromium-1223/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';
(async () => {
  const browser = await chromium.launch({ executablePath: CHROME, args: ['--use-angle=swiftshader'] });
  const page = await (await browser.newContext({ viewport: { width: 1180, height: 820 } })).newPage();
  const errors = []; page.on('pageerror', e => errors.push(e.message.slice(0, 160)));
  await page.goto('http://localhost:8123/puzzle.html');
  await page.waitForTimeout(2500);
  const gal = await page.evaluate(() => ({
    scenes: PZ.SCENES.length,
    cards: document.querySelectorAll('.gcard').length,
  }));
  // open size picker by tapping the 3rd card, choose 6 pieces
  await page.evaluate(() => { document.querySelectorAll('.gcard')[2].dispatchEvent(new PointerEvent('pointerup', { bubbles: true })); });
  await page.waitForTimeout(300);
  const veil = await page.evaluate(() => document.querySelector('#veil').classList.contains('on'));
  await page.click('.sizeb.s6');
  await page.waitForTimeout(600);
  // drag every piece home with REAL mouse input
  const n = await page.evaluate(() => PZ.cur().pieces.length);
  for (let pass = 0; pass < 4; pass++) {
    for (let i = 0; i < n; i++) {
      const p = await page.evaluate(k => {
        const q = PZ.cur().pieces[k];
        return { fx: q.x + q.cv.width / 2, fy: q.y + q.cv.height / 2, dx: q.tx - q.x, dy: q.ty - q.y, locked: q.locked };
      }, i);
      if (p.locked) continue;
      await page.mouse.move(p.fx, p.fy);
      await page.mouse.down();
      await page.mouse.move(p.fx + p.dx / 2, p.fy + p.dy / 2, { steps: 4 });
      await page.mouse.move(p.fx + p.dx, p.fy + p.dy, { steps: 4 });
      await page.mouse.up();
      await page.waitForTimeout(80);
    }
    if (await page.evaluate(() => PZ.cur().pieces.every(q => q.locked))) break;
  }
  await page.waitForTimeout(1200);
  const done = await page.evaluate(() => ({
    placed: PZ.cur().placed, total: PZ.cur().size.n,
    winShown: document.querySelector('#winV').classList.contains('on'),
    saved: !!((JSON.parse(localStorage.getItem('pondpz')||'{}').done||{})[PZ.SCENES[2].id] || {})[6],
  }));
  await page.screenshot({ path: '/private/tmp/claude-501/-Users-ltc-lilypad-os/52ebe3af-a02d-4e00-bdfe-a92d07ee7576/scratchpad/pw8yTj/pz-win.png' });
  // start a 48-piece to sanity-check big sizes render
  await page.evaluate(() => { document.querySelector('#winV').classList.remove('on'); PZ.startPuzzle(5, 48); });
  await page.waitForTimeout(900);
  const big = await page.evaluate(() => ({ pieces: document.querySelectorAll('.piece').length }));
  await page.screenshot({ path: '/private/tmp/claude-501/-Users-ltc-lilypad-os/52ebe3af-a02d-4e00-bdfe-a92d07ee7576/scratchpad/pw8yTj/pz-48.png' });
  const R = { gal, veil, done, big, errors };
  const pass = gal.scenes >= 20 && gal.cards >= 20 && veil && done.placed === done.total && done.winShown && done.saved && big.pieces === 48 && errors.length === 0;
  console.log(JSON.stringify(R, null, 1));
  console.log(pass ? 'PLAYTEST: PASS' : 'PLAYTEST: FAIL');
  await browser.close();
  process.exit(pass ? 0 : 1);
})().catch(e => { console.error('FATAL', e); process.exit(1); });
