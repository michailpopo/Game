// Does the result dialog overflow (scrollbars) while its entry animations run? Freezes every running animation
// at several points of its timeline and measures the dialog's scroll box. Needs a preview on :4174.
//   node tools/qa/dialog-overflow.mjs
import { chromium } from "playwright";
const b = await chromium.launch({ executablePath: process.env.PW_CHROMIUM_PATH || undefined, args: ["--enable-unsafe-swiftshader"] });
for (const [w, h] of [[1280, 720], [800, 450], [450, 800]]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  await ctx.route(/sdk\.crazygames\.com/, (r) => r.fulfill({ path: "dev/mock-crazygames-sdk.js", contentType: "text/javascript" }));
  const p = await ctx.newPage();
  await p.goto("http://127.0.0.1:4174/?qa=1&runs=2&level=44", { waitUntil: "domcontentloaded" });
  await p.waitForFunction(() => window.__GS_QA__ && document.getElementById("boot")?.classList.contains("done"), null, { timeout: 60000 });
  await p.evaluate(() => window.__GS_QA__.start());
  await new Promise((r) => setTimeout(r, 800));
  await p.evaluate(() => window.__GS_QA__.forceWin());
  await p.waitForFunction(() => document.querySelector(".modal:not([hidden]) .dialog"), null, { timeout: 30000 });
  const res = await p.evaluate(() => {
    const d = document.querySelector(".modal:not([hidden]) .dialog");
    const anims = d.getAnimations({ subtree: true });
    anims.forEach((a) => a.pause());
    const out = [];
    for (const t of [0, 100, 200, 300, 350, 400, 500, 600, 700, 760]) {
      anims.forEach((a) => { a.currentTime = Math.min(t, a.effect.getTiming().duration); });
      out.push(`${t}ms:${d.scrollWidth > d.clientWidth ? "X" : "-"}${d.scrollHeight > d.clientHeight ? "Y" : "-"}`);
    }
    anims.forEach((a) => a.finish());
    return { anims: anims.length, out: out.join(" "), overflow: getComputedStyle(d).overflowX + "/" + getComputedStyle(d).overflowY };
  });
  console.log(`${w}x${h}`, JSON.stringify(res));
  await ctx.close();
}
await b.close();
