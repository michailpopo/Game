// Cloud look check: ready + in-play stills at a few cities. Needs `npx vite preview --port 4174 --strictPort`.
//   node tools/qa/cloud-shots.mjs <outDir> <tag> [levels=1,12,26]
import { chromium } from "playwright";
const [out, tag, levels = "1,12,26"] = process.argv.slice(2);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const b = await chromium.launch({ executablePath: process.env.PW_CHROMIUM_PATH || undefined, args: ["--enable-unsafe-swiftshader"] });
for (const lv of levels.split(",")) {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
  await ctx.route(/sdk\.crazygames\.com/, (r) => r.fulfill({ path: "dev/mock-crazygames-sdk.js", contentType: "text/javascript" }));
  const p = await ctx.newPage();
  p.on("pageerror", (e) => console.log("pageerror", e.message));
  await p.goto(`http://127.0.0.1:4174/?qa=1&runs=2&level=${lv}`, { waitUntil: "domcontentloaded" });
  await p.waitForFunction(() => window.__GS_QA__ && document.getElementById("boot")?.classList.contains("done"), null, { timeout: 60000 });
  await sleep(1200);
  await p.screenshot({ path: `${out}/${tag}-L${lv}-ready.png` });
  await p.evaluate(() => window.__GS_QA__.start());
  await sleep(1500);
  await p.evaluate(() => { const q = window.__GS_QA__; q.setAim(-1); q.freezeWhen({ charge: 0.5 }); q.setHold(true); });
  await p.waitForFunction(() => window.__GS_QA__.frozen, null, { timeout: 30000 }).catch(() => {});
  await sleep(800);
  await p.screenshot({ path: `${out}/${tag}-L${lv}-play.png`, clip: { x: 0, y: 0, width: 1280, height: 300 } });
  await ctx.close();
}
await b.close();
