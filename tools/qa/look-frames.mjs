// Look-review stills (ready, shop, charge at 85%, 8 frames right after the release, 6 s later).
// Needs a preview server: npx vite preview --port 4174 --strictPort   then:
//   node tools/qa/look-frames.mjs qa/frames [extra query] [WxH]      (NOSHOP=1 skips the shop still)
// Software WebGL runs at ~2 fps here: the bolt shows in the first 1-2 seq frames only.
import { chromium } from "playwright";
const [out, q = "", size = "1280x720"] = process.argv.slice(2);
const [w, h] = size.split("x").map(Number);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const b = await chromium.launch({ executablePath: process.env.PW_CHROMIUM_PATH || undefined, args: ["--enable-unsafe-swiftshader"] });
const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
await ctx.route(/sdk\.crazygames\.com\/crazygames-sdk-v3\.js/, (r) => r.fulfill({ path: "dev/mock-crazygames-sdk.js", contentType: "text/javascript" }));
const page = await ctx.newPage();
page.on("pageerror", (e) => console.log("pageerror", e.message));
await page.goto(`http://127.0.0.1:4174/?qa=1&runs=2${q ? "&" + q : ""}`, { waitUntil: "domcontentloaded" });
await page.waitForFunction(() => window.__GS_QA__ && document.getElementById("boot")?.classList.contains("done"), null, { timeout: 60000 });
await sleep(1500);
await page.screenshot({ path: `${out}/ready-${size}.png` });
const shopBtn = await page.$(".shop-btn");
if (!process.env.NOSHOP && shopBtn && await shopBtn.isVisible()) { await shopBtn.click(); await sleep(1500); await page.screenshot({ path: `${out}/shop-${size}.png` });
  console.log("video buttons in shop:", await page.evaluate(() => [...document.querySelectorAll(".shop-modal [data-video]")].filter((e) => e.getBoundingClientRect().width > 0).length));
  await page.click(".shop .close"); await sleep(800); }
await page.evaluate(() => window.__GS_QA__.start()); await page.waitForFunction(() => window.__GS_QA__.state.phase === "run", null, { timeout: 20000 }); await sleep(1500);
await page.evaluate(() => { const q = window.__GS_QA__; q.setAim(-1); q.freezeWhen({ charge: 0.85 }); q.setHold(true); });
await page.waitForFunction(() => window.__GS_QA__.frozen, null, { timeout: 30000 });
await sleep(800);
await page.screenshot({ path: `${out}/charge-${size}.png` });
await page.evaluate(() => { const q = window.__GS_QA__; q.freezeWhen({ district: 99 }); q.setHold(false); q.freeze(false); });
for (let i = 0; i < 8; i++) { await page.screenshot({ path: `${out}/seq${i}-${size}.png` }); }
await page.evaluate(() => { const q = window.__GS_QA__; q.freezeWhen({ district: 99 }); q.freeze(false); q.setHold(null); });
await sleep(6000);
await page.screenshot({ path: `${out}/after-${size}.png` });
console.log(JSON.stringify(await page.evaluate(() => { const s = window.__GS_QA__.state; return { phase: s.phase, lit: s.lit, of: s.buildings, skin: s.skin }; })));
await b.close();
