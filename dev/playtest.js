/* HOPTOPIA playtest bot — plays like a kid: walks, rides, asserts.
   Run before every push:  node dev/playtest.js  (server on :8123 required)  */
const { chromium } = require('/private/tmp/claude-501/-Users-ltc-lilypad-os/52ebe3af-a02d-4e00-bdfe-a92d07ee7576/scratchpad/pw8yTj/node_modules/playwright-core');
const CHROME = '/Users/ltc/Library/Caches/ms-playwright/chromium-1223/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';
(async () => {
  const browser = await chromium.launch({ executablePath: CHROME, args: ['--use-angle=swiftshader'] });
  const page = await (await browser.newContext({ viewport: { width: 1180, height: 820 } })).newPage();
  const errors = []; page.on('pageerror', e => errors.push(e.message.slice(0, 160)));
  await page.goto('http://localhost:8123/hoptopia.html');
  for (let i = 0; i < 150; i++) { if (await page.evaluate(() => [...document.querySelectorAll('.bigb')].some(b => b.textContent.includes('Hop in'))).catch(() => false)) break; await page.waitForTimeout(400); }
  await page.evaluate(() => { [...document.querySelectorAll('.bigb')].find(b => b.textContent.includes('Hop in')).click(); document.querySelector('#mExplore').click(); });
  await page.waitForTimeout(1500);
  await page.evaluate(() => closeDialog());
  await page.evaluate(() => {
    /* bot-walk: steer camera toward target and hold W — real player input */
    window.walkTo = async (x, z, timeout = 20000) => {
      keys.KeyW = true;
      const t0 = performance.now();
      while (performance.now() - t0 < timeout) {
        cam.yaw = Math.atan2(-(x - P.x), -(z - P.z));
        if (Math.hypot(P.x - x, P.z - z) < 1.3) { keys.KeyW = false; keys.Space = false; return true; }
        if (Math.random() < 0.15) keys.Space = true; else keys.Space = false; /* hop over lips */
        await new Promise(r => setTimeout(r, 100));
      }
      keys.KeyW = false; keys.Space = false; return false;
    };
  });
  const R = {};

  /* --- scenario 1: water park, full kid path --- */
  R.park = await page.evaluate(async () => {
    const tx = SPLASH.x + 14, tz = SPLASH.z - 14, g = SPLASH.h;
    teleport([SPLASH.x - 2.5, walkGroundY(SPLASH.x - 2.5, SPLASH.z - 20.5) + 0.5, SPLASH.z - 20.5]); /* arrive at park edge */
    await new Promise(r => setTimeout(r, 500));
    await walkTo(SPLASH.x + 16.5, SPLASH.z - 4.5, 30000); /* around the pool */
    const reachedPad = await walkTo(tx + 0.5, tz + 5.5, 30000);
    await new Promise(r => setTimeout(r, 1500));
    const atTop = P.y > g + 12;
    if (!atTop) return { reachedPad, atTop, fail: 'lift' };
    const mouth = SLIDES[1].pts[0];
    const reachedMouth = await walkTo(mouth[0] + 0.5, mouth[2] + 0.5, 9000);
    let started = !!RIDE;
    for (let i = 0; i < 20 && !RIDE; i++) await new Promise(r => setTimeout(r, 150)); /* scoop catch */
    started = started || !!RIDE;
    let minY = 99, clipped = false;
    for (let i = 0; i < 140 && RIDE; i++) {
      minY = Math.min(minY, P.y);
      if (P.y < g - 2) clipped = true;
      await new Promise(r => setTimeout(r, 150));
    }
    const done = !RIDE;
    await new Promise(r => setTimeout(r, 1500));
    const splashdown = Math.hypot(P.x - (SPLASH.x - 2), P.z - (SPLASH.z + 3)) < 20 && P.y < g + 4;
    const walkedOut = await walkTo(SPLASH.x - 18.5, SPLASH.z + 12.5, 60000) && !P.inWater;
    return { reachedPad, atTop, reachedMouth, started, done, clipped, splashdown, walkedOut };
  });

  /* --- scenario 2: forest walk, no stuck --- */
  R.forest = await page.evaluate(async () => {
    teleport([MOSS.x - 20.5, 30, MOSS.z - 20.5]);
    let wedged = 0; keys.KeyW = true;
    const iv = setInterval(() => { if (boxSolid(P, P.x, P.y, P.z)) wedged++; cam.yaw += 0.09; }, 100);
    await new Promise(r => setTimeout(r, 4000));
    clearInterval(iv); keys.KeyW = false;
    return { wedged };
  });

  /* --- scenario 3: obby first mover carries the player --- */
  R.obby = await page.evaluate(async () => {
    startMini('obby');
    if (modalOpen) closeModal();
    if (dialog.npc) closeDialog();
    await new Promise(r => setTimeout(r, 400));
    const m = MOVERS[0], p0 = moverPos(m, RENDT);
    teleport([p0[0], p0[1] + 0.6, p0[2]]);
    await new Promise(r => setTimeout(r, 1200));
    const p1 = moverPos(m, RENDT);
    const carried = Math.abs(P.x - p1[0]) < 1.2 && P.onGround;
    endMini(false); if (modalOpen) closeModal();
    return { carried };
  });

  R.errors = errors;
  const pass = R.park.atTop && R.park.started && R.park.done && !R.park.clipped && R.park.splashdown && R.park.walkedOut
    && R.forest.wedged === 0 && R.obby.carried && errors.length === 0;
  console.log(JSON.stringify(R, null, 1));
  console.log(pass ? 'PLAYTEST: PASS' : 'PLAYTEST: FAIL');
  await browser.close();
  process.exit(pass ? 0 : 1);
})().catch(e => { console.error('FATAL', e); process.exit(1); });
