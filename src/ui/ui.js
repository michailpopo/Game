/**
 * DOM UI layer - Storm Grid: the run HUD (% powered + plate ticks, strikes left, city panel), the
 * city intro (wordmark, city + theme, the pulsing "hold" hint), the charge ring around the target,
 * onboarding pill, BLOCK POWERED card, pause overlay, upgrade cards, the Supercharged-start offer,
 * the bolt shop, the result dialog (plate ladder, One-more-strike countdown ring), toasts, floating
 * numbers, coin fly-ins and the ad-request blocker.
 *
 * Why DOM and not in-canvas UI: crisp at every devicePixelRatio, legible at the CG-GAME-002
 * minimum iframe sizes, accessible, and it costs no draw calls.
 *
 * Styles: src/ui/styles.css (shared classes: .hud .score .meter .ranks .home .hint .pill .world-card
 * .btn .card .dialog .pod ...). Storm-Grid-only pieces carry inline styles and these class names for
 * the look pass: .charge (ring: .charge-track .charge-band .charge-fill), .powered-label,
 * .meter-tick, .strike-pips (.pip, .pip.used), .plate-ladder.
 *
 * Rewarded-ad UI rules baked in (CG-ADS-007/008, CG-QUAL-004): an offer and its decline/alternative
 * use the SAME button class - same size, font and colour - and appear in the same frame; the offer
 * carries a video icon (`data-video`). The countdown ring only ever removes the offer. Do not
 * "improve" any of that by styling, sizing, delaying or animating one of the two differently:
 * tools/qa/browser-qa.mjs (ad-ui) fails the build when they differ.
 */

import { t } from "../core/i18n.js";

const ICON = {
  coin: `<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="13.5" fill="#ffd23f" stroke="#e08e12" stroke-width="3"/><circle cx="16" cy="16" r="8" fill="none" stroke="#fff1b8" stroke-width="2.4"/></svg>`,
  video: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="5" width="14" height="14" rx="3"/><path d="M17 10.2 22 7v10l-5-3.2z"/></svg>`,
  soundOn: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>`,
  soundOff: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16.5 9.5l5 5m0-5-5 5" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/></svg>`,
  pause: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1.2"/><rect x="14" y="5" width="4" height="14" rx="1.2"/></svg>`,
  mouse: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="3" width="12" height="18" rx="6" fill="none" stroke="#fff" stroke-width="2"/><path d="M12 7v4" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>`,
  finger: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 11V5.5a1.5 1.5 0 0 1 3 0V10l5 1.2c1 .3 1.6 1.2 1.5 2.2L18 18c-.2 1.7-1.6 3-3.3 3h-3.2c-1 0-1.9-.5-2.5-1.3L5.7 15.6a1.4 1.4 0 0 1 2.1-1.8L9 15z" fill="#fff"/></svg>`,
  keys: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="8" width="20" height="9" rx="2" fill="none" stroke="#fff" stroke-width="2"/><path d="M6 12.5h12" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>`,
  bolt: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13 2 4 14h6l-1 8 9-12h-6z" fill="#fff"/></svg>`,
  voltage: `<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="17" fill="#4df3ff" opacity=".25"/><path d="M27 6 13 27h9l-2 15 15-22h-9z" fill="#fff"/></svg>`,
  fork: `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 4 18 20l6 3-4 21" fill="none" stroke="#fff" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/><path d="m24 23 10 8-3 13" fill="none" stroke="#bff8ff" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"/></svg>`,
  capacitor: `<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="12" y="10" width="24" height="32" rx="5" fill="none" stroke="#fff" stroke-width="4"/><rect x="19" y="5" width="10" height="6" rx="2" fill="#fff"/><rect x="17" y="24" width="14" height="13" rx="2" fill="#ffe066"/></svg>`,
  strikes: `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M16 6 8 24h7l-2 16 11-20h-7z" fill="#fff"/><path d="M34 6l-8 18h7l-2 16 11-20h-7z" fill="#bff8ff"/></svg>`,
  gold: `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 4v30" stroke="#ffcc33" stroke-width="5" stroke-linecap="round"/><circle cx="24" cy="8" r="6" fill="#ffe066"/><rect x="14" y="34" width="20" height="8" rx="2" fill="#fff"/></svg>`,
  shop: `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M27 4 12 27h10l-3 17 17-25H26z" fill="#fff"/><circle cx="36" cy="12" r="6" fill="#ff3fd8"/></svg>`,
  close: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="#fff" stroke-width="3" stroke-linecap="round"/></svg>`,
};
/** A bolt skin swatch: coloured when owned, a dark silhouette while locked. */
const swatch = (fill) => `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M28 4 12 27h10l-3 17 17-25H26z" fill="${fill}"/></svg>`;
const PLATE_COLORS = { 2: "#4df3ff", 3: "#7cff7a", 5: "#ffcc33", 10: "#ff3fa4" };

export function createUI(root, { onSound, onPause, onResume, onBuy, onFree, onBoost, onShop, onShopClose, onSkin, onUnlock, onCash }) {
  root.innerHTML = `
    <div class="hud">
      <div class="hud-left"><div class="coins"><b>0</b><span class="coin">${ICON.coin}</span></div></div>
      <div class="hud-center">
        <div class="score stroke glow-cyan" style="text-align:center"><b>0%</b><span class="powered-label" style="display:block;font-size:max(12px,0.36em);letter-spacing:0.16em;margin-top:0.1em">${t("powered")}</span></div>
        <div class="meter" style="position:relative;width:9em;overflow:visible"><i></i></div>
        <div class="strike-pips" style="display:flex;gap:0.15em;margin-top:0.2em"></div>
      </div>
      <div class="hud-right">
        <div class="btns"><button class="icon-btn pause" type="button">${ICON.pause}</button><button class="icon-btn sound" type="button"></button></div>
        <div class="ranks"><p class="ranks-title"></p><ol></ol></div>
      </div>
    </div>
    <div class="charge" style="position:absolute;left:0;top:0;width:6em;height:6em;pointer-events:none;display:none;z-index:4">
      <svg viewBox="0 0 60 60" aria-hidden="true" style="width:100%;height:100%;display:block;transform:rotate(-90deg);overflow:visible">
        <circle class="charge-track" cx="30" cy="30" r="24" fill="none" stroke="rgba(8,6,32,0.6)" stroke-width="8"/>
        <circle class="charge-band" cx="30" cy="30" r="24" fill="none" stroke="#ffe066" stroke-width="8" pathLength="100" opacity="0.6"/>
        <circle class="charge-fill" cx="30" cy="30" r="24" fill="none" stroke="#fff" stroke-width="5" pathLength="100" stroke-linecap="round" stroke-dasharray="0 100"/>
      </svg>
    </div>
    <div class="floats"></div>
    <div class="home">
      <h1 class="logo stroke"></h1>
      <p class="mode stroke"></p>
      <div class="hint"><p class="stroke main"></p><p class="stroke sub"></p></div>
    </div>
    <div class="pill hidden"><span class="pill-icon"></span><span class="pill-text stroke"></span></div>
    <div class="world-card hidden"><p class="stroke small"></p><p class="stroke big"></p></div>
    <div class="upgrades hidden"></div>
    <button class="btn boost hidden" type="button" data-video="1">${ICON.video}<span class="boost-label"></span></button>
    <button class="icon-btn shop-btn hidden" type="button" aria-label="shop">${ICON.shop}</button>
    <div class="paused" hidden><div class="paused-card"><h2 class="stroke"></h2><p class="stroke sub"></p><p class="keys"></p></div></div>
    <div class="shop-modal" hidden><div class="shop">
      <button class="icon-btn close" type="button">${ICON.close}</button>
      <h2 class="stroke"></h2>
      <div class="grid"></div>
      <div class="row"></div>
      <p class="note stroke"></p>
    </div></div>
    <div class="modal" hidden><div class="dialog"><p class="dialog-mode"></p><h2 class="stroke"></h2><div class="podium plate-ladder"></div><div class="stats"></div><div class="amount stroke"><span class="coin">${ICON.coin}</span><b>0</b><span class="crate"></span></div><div class="ring" hidden><svg viewBox="0 0 40 40" aria-hidden="true"><circle class="track" cx="20" cy="20" r="17"/><circle class="fill" cx="20" cy="20" r="17" pathLength="100"/></svg><b class="stroke"></b></div><div class="row"></div><p class="note stroke"></p></div></div>
    <div class="toast"></div>
    <div class="ad-block" hidden><div class="spinner"></div></div>`;

  const $ = (sel) => root.querySelector(sel);
  const soundBtn = $(".sound");
  const pauseBtn = $(".pause");
  const coinsEl = $(".coins b");
  const coinsPill = $(".coins");
  const floats = $(".floats");
  const hint = $(".hint");
  const home = $(".home");
  const upgrades = $(".upgrades");
  const modal = $(".modal");
  const dialog = $(".dialog");
  const toastEl = $(".toast");
  const adBlock = $(".ad-block");
  const boostBtn = $(".boost");
  const shopBtn = $(".shop-btn");
  const shopModal = $(".shop-modal");
  const ring = dialog.querySelector(".ring");
  const scoreEl = $(".score b");
  const scoreBox = $(".score");
  const meter = $(".meter");
  const meterFill = $(".meter i");
  const pips = $(".strike-pips");
  const ranksTitle = $(".ranks-title");
  const ranksBox = $(".ranks");
  const portraitQuery = matchMedia("(max-aspect-ratio: 1/1)");
  const ranksList = $(".ranks ol");
  const pill = $(".pill");
  const worldCard = $(".world-card");
  const paused = $(".paused");
  const charge = $(".charge");
  const chargeBand = $(".charge-band");
  const chargeFill = $(".charge-fill");

  // Plate thresholds on the % meter (x2 60%, x3 80%, x5 95%).
  meter.insertAdjacentHTML("beforeend", [[0.6, 2], [0.8, 3], [0.95, 5]].map(([at, m]) =>
    `<span class="meter-tick" style="position:absolute;left:${at * 100}%;top:-0.2em;bottom:-0.2em;width:0.14em;margin-left:-0.07em;border-radius:0.1em;background:${PLATE_COLORS[m]}"></span>`).join(""));

  soundBtn.addEventListener("click", () => onSound?.());
  pauseBtn.addEventListener("click", () => onPause?.());
  paused.addEventListener("click", () => onResume?.());
  boostBtn.addEventListener("click", () => onBoost?.());
  shopBtn.addEventListener("click", () => onShop?.());
  shopModal.querySelector(".close").addEventListener("click", () => onShopClose?.());
  shopModal.addEventListener("click", (e) => {
    const b = e.target.closest("button[data-act]");
    if (!b) return;
    if (b.dataset.act === "skin") onSkin?.(b.dataset.id);
    else if (b.dataset.act === "unlock") onUnlock?.(b);
    else if (b.dataset.act === "cash") onCash?.(b);
  });

  // ---- coins with a counting animation
  let coinsShown = 0;
  let coinsTarget = 0;
  function setCoins(value, { animate = false } = {}) {
    coinsTarget = value;
    if (!animate) { coinsShown = value; coinsEl.textContent = String(value); }
  }

  // ---- floating numbers (pooled; the view merges "+N" so at most ~12 are on screen)
  const floatPool = Array.from({ length: 14 }, () => {
    const el = document.createElement("div");
    el.className = "float stroke";
    floats.appendChild(el);
    return el;
  });
  let floatNext = 0;
  function floatText(x, y, text, kind = "good") {
    const el = floatPool[floatNext];
    floatNext = (floatNext + 1) % floatPool.length;
    el.textContent = text;
    el.className = `float stroke ${kind}`;
    el.getAnimations().forEach((a) => a.cancel());
    el.animate([
      { transform: `translate(${x}px, ${y}px) translate(-50%, -50%) scale(.4)`, opacity: 0 },
      { transform: `translate(${x}px, ${y - 26}px) translate(-50%, -50%) scale(1.15)`, opacity: 1, offset: 0.18 },
      { transform: `translate(${x}px, ${y - 80}px) translate(-50%, -50%) scale(1)`, opacity: 0 },
    ], { duration: 900, easing: "cubic-bezier(.2,.8,.2,1)", fill: "forwards" });
  }

  // ---- coin fly-in from an element to the coin pill
  function coinsFly(fromEl, total) {
    const from = fromEl.getBoundingClientRect();
    const to = coinsPill.getBoundingClientRect();
    const rootRect = root.getBoundingClientRect();
    const n = Math.min(10, Math.max(4, Math.round(Math.log2(total + 1) * 2)));
    for (let i = 0; i < n; i++) {
      const el = document.createElement("div");
      el.className = "fly-coin";
      el.innerHTML = ICON.coin;
      root.appendChild(el);
      const sx = from.left + from.width / 2 - rootRect.left + (Math.random() - 0.5) * 60;
      const sy = from.top + from.height / 2 - rootRect.top + (Math.random() - 0.5) * 30;
      const ex = to.left - rootRect.left + to.width - 18;
      const ey = to.top + to.height / 2 - rootRect.top;
      const anim = el.animate([
        { transform: `translate(${sx}px, ${sy}px) scale(.3)`, opacity: 0 },
        { transform: `translate(${sx + (Math.random() - 0.5) * 80}px, ${sy - 40}px) scale(1.1)`, opacity: 1, offset: 0.3 },
        { transform: `translate(${ex}px, ${ey}px) scale(.7)`, opacity: 1 },
      ], { duration: 650 + i * 45, easing: "cubic-bezier(.5,0,.6,1)", fill: "forwards" });
      anim.onfinish = () => {
        el.remove();
        coinsPill.animate([{ scale: 1 }, { scale: 1.12 }, { scale: 1 }], { duration: 160 });
        if (i === n - 1) coinsShown = coinsTarget - 1;   // finish the count-up
      };
    }
  }

  // ---- upgrades
  function showUpgrades(items) {
    if (!items) { upgrades.classList.add("hidden"); return; }
    upgrades.classList.remove("hidden");
    upgrades.innerHTML = items.map((it) => `
      <div class="upgrade" data-kind="${it.kind}">
        <button class="card ${it.affordable || it.maxed ? "" : "cant"}" type="button" data-act="buy" ${it.maxed ? "disabled" : ""}>
          <span class="lvl stroke">${t("lvl", { n: it.level })}</span>
          <span class="icon">${ICON[it.kind] || ICON.bolt}</span>
          <span class="title stroke">${it.title}</span>
          <span class="cost stroke">${it.maxed ? t("max") : `<b>${it.cost}</b>${ICON.coin}`}</span>
        </button>
        ${it.free.visible ? `<button class="btn free" type="button" data-act="free" data-video="1">${ICON.video}<span>FREE</span></button>` : `<span class="free-spacer"></span>`}
      </div>`).join("");
    upgrades.querySelectorAll("button").forEach((b) => {
      b.addEventListener("click", (e) => {
        const kind = e.currentTarget.closest(".upgrade").dataset.kind;
        if (e.currentTarget.dataset.act === "buy") onBuy?.(kind); else onFree?.(kind);
      });
    });
  }
  function popUpgrade(kind, text) {
    const card = upgrades.querySelector(`[data-kind="${kind}"] .card`);
    card?.animate([{ scale: 1 }, { scale: 1.12 }, { scale: 1 }], { duration: 280, easing: "ease-out" });
    if (card && text) {
      const r = card.getBoundingClientRect(), rr = root.getBoundingClientRect();
      floatText(r.left + r.width / 2 - rr.left, r.top - rr.top, text, "gold");
    }
  }

  // ---- result dialog
  // The whole dialog (offer AND decline) scales in together: the decline is never
  // later, smaller or fainter than the offer (CG-ADS-007/008, CG-QUAL-004).
  let countdown = null;   // { left, total, id, onExpire } while a timed offer is on screen
  /**
   * @param {{ kind:string, title:string, amount:number|null, buttons:object[], note?:string, timed?:object,
   *           mode?:string, plates?:{mult:number,at:number,on:boolean}[], stats?:string[], crate?:string }} o
   */
  function showResult({ kind, title, amount, buttons, note = "", timed = null, mode = "", plates = null, stats = null, crate = "" }) {
    modal.hidden = false;
    dialog.className = `dialog ${kind}`;
    dialog.querySelector(".dialog-mode").textContent = mode;
    dialog.querySelector("h2").textContent = title;
    const ladder = dialog.querySelector(".podium");
    ladder.style.flexDirection = "row";
    ladder.innerHTML = plates ? plates.map((p) =>
      `<div class="pod${p.on ? " me" : ""}" data-mult="${p.mult}" style="flex:1;flex-direction:column;gap:0;padding:0.25em 0.2em;text-align:center${p.on ? `;background:${PLATE_COLORS[p.mult]};box-shadow:0 0 0 0.12em #fff, 0 0 0.8em ${PLATE_COLORS[p.mult]}` : ""}"><span class="r" style="width:auto;text-align:center;font-size:1.35em;color:${p.on ? "#1a1240" : PLATE_COLORS[p.mult]}">×${p.mult}</span><span class="sc" style="font-size:max(12px,0.8em)${p.on ? ";color:#1a1240" : ""}">${Math.round(p.at * 100)}%</span></div>`).join("") : "";
    dialog.querySelector(".stats").innerHTML = stats ? stats.map((s) => `<span>${escapeHtml(s)}</span>`).join("") : "";
    const amountBox = dialog.querySelector(".amount");
    amountBox.style.display = amount === null ? "none" : "";
    const amountEl = dialog.querySelector(".amount b");
    amountEl.textContent = String(amount ?? 0);
    dialog.querySelector(".crate").textContent = crate;
    const row = dialog.querySelector(".row");
    row.innerHTML = buttons.filter(Boolean).map((b) =>
      `<button class="btn" type="button" data-id="${b.id}"${b.video ? ' data-video="1"' : ""}>${b.video ? ICON.video : ""}<span>${b.label}</span></button>`).join("");
    dialog.querySelector(".note").textContent = note;
    // Timed offer: the ring counts down and, at 0, REMOVES the offer. It never accepts it.
    countdown = timed && row.querySelector(`[data-id="${timed.id}"]`) ? { left: timed.seconds, total: timed.seconds, id: timed.id, onExpire: timed.onExpire } : null;
    ring.hidden = !countdown;
    drawRing();
    dialog.getAnimations().forEach((a) => a.cancel());
    dialog.animate([{ transform: "scale(.6)", opacity: 0 }, { transform: "scale(1.04)", opacity: 1, offset: 0.7 }, { transform: "scale(1)", opacity: 1 }], { duration: 380, easing: "ease-out" });
    // The won plate slams down after the dialog lands.
    ladder.querySelector(".pod.me")?.animate([{ transform: "scale(2.2)", opacity: 0 }, { transform: "scale(2.2)", opacity: 0, offset: 0.45 }, { transform: "scale(0.92)", opacity: 1, offset: 0.8 }, { transform: "scale(1)", opacity: 1 }], { duration: 760, easing: "ease-in" });

    let handler = null;
    let locked = false;
    row.onclick = (e) => {
      const btn = e.target.closest("button[data-id]");
      if (!btn || locked) return;
      handler?.(btn.dataset.id);
    };
    const handle = {
      onChoice(fn) { handler = fn; },
      lock(on) { locked = on; dialog.classList.toggle("locked", on); },
      hideButton(id) {
        row.querySelector(`[data-id="${id}"]`)?.remove();
        if (countdown?.id === id) { countdown = null; ring.hidden = true; }
      },
      setNote(text) { dialog.querySelector(".note").textContent = text; },
      setAmount(n) { amountEl.textContent = String(n); amountEl.animate([{ scale: 1 }, { scale: 1.3 }, { scale: 1 }], { duration: 300 }); },
      get amountElement() { return dialog.querySelector(".amount"); },
      get locked() { return locked; },
      close() { modal.hidden = true; row.onclick = null; countdown = null; ring.hidden = true; },
    };
    return handle;
  }
  function drawRing() {
    if (!countdown) return;
    ring.querySelector("b").textContent = String(Math.max(0, Math.ceil(countdown.left)));
    ring.querySelector(".fill").style.strokeDashoffset = String(100 * (1 - countdown.left / countdown.total));
  }
  function tickCountdown(dt) {
    if (!countdown || modal.hidden || dialog.classList.contains("locked")) return;   // paused while an ad is in flight
    countdown.left -= dt;
    if (countdown.left > 0) { drawRing(); return; }
    const { id, onExpire } = countdown;
    countdown = null;
    ring.hidden = true;
    dialog.querySelector(`.row [data-id="${id}"]`)?.remove();
    onExpire?.();
  }

  // ---- city intro: rewarded Supercharged start
  function showBoost(model) {
    boostBtn.classList.toggle("hidden", !model);
    if (model) boostBtn.querySelector(".boost-label").textContent = model.label;
  }

  // ---- bolt shop
  // Re-rendered twice a second while open (cooldown timer): only rebuild the buttons when
  // something besides the note changed, so a press in progress is never swapped out.
  let shopKey = "";
  function renderShop(m, force = false) {
    const key = JSON.stringify({ ...m, note: null });
    shopModal.querySelector(".note").textContent = m.note || "";
    if (key === shopKey && !force) return;
    shopKey = key;
    shopModal.querySelector("h2").textContent = m.title;
    shopModal.querySelector(".grid").innerHTML = m.skins.map((s) =>
      `<button class="swatch ${s.owned ? "owned" : "locked"}${s.selected ? " selected" : ""}" type="button" data-act="skin" data-id="${s.id}" ${s.owned ? "" : "disabled"} aria-label="${s.id}">${swatch(s.owned ? s.color : "#2c2446")}</button>`).join("");
    const row = [];
    if (m.unlock) row.push(`<button class="btn${m.unlock.affordable ? "" : " cant"}" type="button" data-act="unlock"><span>${m.unlock.label}</span><b>${m.unlock.cost}</b><span class="coin">${ICON.coin}</span></button>`);
    if (m.cash) row.push(`<button class="btn" type="button" data-act="cash" data-video="1">${ICON.video}<span>+${m.cash.amount}</span><span class="coin">${ICON.coin}</span></button>`);
    shopModal.querySelector(".row").innerHTML = row.join("");
  }

  // ---- toast
  let toastTimer = 0;
  function toast(text, ms = 2400) {
    toastEl.textContent = text;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), ms);
  }

  // ---- run HUD
  let pctShown = -1;
  function setPowered(share, punch) {
    const p = Math.floor(share * 100 + 1e-6);
    if (p === pctShown) return;
    pctShown = p;
    scoreEl.textContent = `${p}%`;
    meterFill.style.width = `${Math.max(0, Math.min(100, share * 100))}%`;
    if (punch) scoreBox.animate([{ scale: 1 }, { scale: 1.18 }, { scale: 1 }], { duration: 200, easing: "ease-out" });
  }
  let pipsLeft = -1, pipsMax = -1;
  function setStrikes(left, max) {
    if (left === pipsLeft && max === pipsMax) return;
    const lost = pipsLeft > left;
    pipsLeft = left;
    pipsMax = max;
    pips.innerHTML = Array.from({ length: max }, (_, i) =>
      `<span class="pip${i < left ? "" : " used"}" style="display:block;width:1.25em;height:1.25em;opacity:${i < left ? 1 : 0.28};filter:drop-shadow(0 0.08em 0 #1a1240)">${ICON.bolt}</span>`).join("");
    if (lost) pips.animate([{ scale: 1.2 }, { scale: 1 }], { duration: 220 });
  }
  const rankRows = Array.from({ length: 3 }, () => {
    const li = document.createElement("li");
    li.innerHTML = `<span class="r"></span><span class="nm"></span><span class="sc"></span>`;
    ranksList.appendChild(li);
    return li;
  });
  /** City panel (the template's .ranks box): title + up to 3 rows [icon, label, value]. */
  function setPanel(title, rows) {
    ranksBox.style.display = portraitQuery.matches ? "none" : "";   // portrait: the pips + meter say it; the city needs the room
    if (ranksTitle.textContent !== title) ranksTitle.textContent = title;
    for (let i = 0; i < rankRows.length; i++) {
      const li = rankRows[i];
      const r = rows[i];
      if (!r) { li.style.display = "none"; continue; }
      li.style.display = "";
      const [a, b, c] = li.children;
      if (a.textContent !== r[0]) a.textContent = r[0];
      if (b.textContent !== r[1]) b.textContent = r[1];
      if (c.textContent !== r[2]) c.textContent = r[2];
    }
  }

  let pillKey = "";
  function showPill(text, icon) {
    const key = text ? `${icon}|${text}` : "";
    if (key === pillKey) return;
    pillKey = key;
    pill.classList.toggle("hidden", !text);
    if (!text) return;
    pill.querySelector(".pill-text").textContent = text;
    pill.querySelector(".pill-icon").innerHTML = ICON[icon] || "";
    pill.animate([{ transform: "translate(-50%, 0.5em) scale(.9)", opacity: 0 }, { transform: "translate(-50%, 0) scale(1)", opacity: 1 }], { duration: 260, easing: "ease-out" });
  }

  let worldLeft = 0;   // seconds the card stays up (ticks in update(), so a paused game holds it)
  function showWorld(small, big) {
    worldCard.querySelector(".small").textContent = small;
    worldCard.querySelector(".big").textContent = big;
    worldCard.classList.remove("hidden");
    worldCard.animate([{ transform: "translate(-50%, -50%) scale(.5)", opacity: 0 }, { transform: "translate(-50%, -50%) scale(1.08)", opacity: 1, offset: 0.35 }, { transform: "translate(-50%, -50%) scale(1)", opacity: 1 }], { duration: 420, easing: "ease-out" });
    worldLeft = 1.6;
  }

  // ---- charge ring around the target (screen px); null hides it
  const cLast = { on: false, x: 0, y: 0, k: -1, band: "", lo: -1, hi: -1 };
  function setCharge(c) {
    if (!c) { if (cLast.on) { charge.style.display = "none"; cLast.on = false; cLast.k = -1; } return; }
    const k = Math.min(1, c.charge);
    if (cLast.on && Math.abs(c.x - cLast.x) < 0.5 && Math.abs(c.y - cLast.y) < 0.5 && Math.abs(k - cLast.k) < 0.004 && c.band === cLast.band) return;
    const first = !cLast.on;
    cLast.on = true; cLast.x = c.x; cLast.y = c.y; cLast.k = k; cLast.band = c.band;
    charge.style.display = "";
    const sc = c.band === "super" ? 1.14 : c.band === "over" ? 1.06 + Math.random() * 0.06 : 1;
    charge.style.transform = `translate(${c.x.toFixed(1)}px, ${c.y.toFixed(1)}px) translate(-50%, -50%) scale(${sc})`;
    if (c.lo !== cLast.lo || c.hi !== cLast.hi) {
      cLast.lo = c.lo; cLast.hi = c.hi;
      chargeBand.setAttribute("stroke-dasharray", `${((c.hi - c.lo) * 100).toFixed(1)} ${(100 - (c.hi - c.lo) * 100).toFixed(1)}`);
      chargeBand.setAttribute("stroke-dashoffset", String(-c.lo * 100));
    }
    chargeFill.setAttribute("stroke-dasharray", `${(k * 100).toFixed(1)} 100`);
    chargeFill.setAttribute("stroke", c.band === "super" ? "#ffe066" : c.band === "over" ? "#ff5a6e" : "#ffffff");
    chargeBand.setAttribute("opacity", c.band === "super" ? "1" : "0.6");
    if (first) charge.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 120 });
  }

  let hintAnim = null;

  // Portrait: three upgrade cards fill the bottom row on a 390 px phone, so the shop button moves up
  // to the boost's row (left side). Inline because styles.css belongs to the look pass.
  function placeShopButton() { shopBtn.style.bottom = portraitQuery.matches ? "11.6em" : ""; }
  portraitQuery.addEventListener?.("change", placeShopButton);

  return {
    setCoins,
    coinsFly,
    setSound({ effectiveMuted, platformMute }) {
      soundBtn.innerHTML = effectiveMuted ? ICON.soundOff : ICON.soundOn;
      soundBtn.title = platformMute ? t("muted_by_platform") : effectiveMuted ? t("sound_off") : t("sound_on");
      soundBtn.setAttribute("aria-label", soundBtn.title);
    },
    /** City intro overlay: wordmark, city + theme, and the pulsing "hold" hint (no PLAY button: the city is the button). */
    showHome(on, { title = "", mode = "", main = "", sub = "", icon = "mouse" } = {}) {
      home.classList.toggle("hidden", !on);
      if (!on) { hintAnim?.cancel(); hintAnim = null; return; }
      home.querySelector(".logo").textContent = title;
      home.querySelector(".mode").textContent = mode;
      const m = hint.querySelector(".main");
      m.innerHTML = `<span class="ico">${ICON[icon] || ""}</span>${escapeHtml(main)}`;
      hint.querySelector(".sub").textContent = sub;
      if (!hintAnim) hintAnim = m.animate([{ transform: "scale(1)", opacity: 0.85 }, { transform: "scale(1.07)", opacity: 1 }, { transform: "scale(1)", opacity: 0.85 }], { duration: 1300, iterations: Infinity, easing: "ease-in-out" });
    },
    /** Run HUD on/off (% powered, strikes, city panel, pause). */
    showRoundHud(on) { root.classList.toggle("in-round", on); pips.style.display = on ? "flex" : "none"; },
    setPowered,
    setStrikes,
    setPanel,
    setCharge,
    showPill,
    showWorld,
    showPaused(on, { title = "", sub = "", keys = "" } = {}) {
      paused.hidden = !on;
      if (!on) return;
      paused.querySelector("h2").textContent = title;
      paused.querySelector(".sub").textContent = sub;
      paused.querySelector(".keys").textContent = keys;
    },
    showUpgrades,
    popUpgrade,
    showBoost,
    showShopButton(on) { shopBtn.classList.toggle("hidden", !on); placeShopButton(); },
    openShop(model) { renderShop(model, true); shopModal.hidden = false; root.classList.add("shop-open"); shopModal.querySelector(".shop").animate([{ transform: "scale(.7)", opacity: 0 }, { transform: "scale(1)", opacity: 1 }], { duration: 260, easing: "ease-out" }); },
    updateShop(model) { if (!shopModal.hidden) renderShop(model); },
    closeShop() { shopModal.hidden = true; root.classList.remove("shop-open"); },
    get shopOpen() { return !shopModal.hidden; },
    get modalOpen() { return !modal.hidden; },
    /** The unlock reveal: the new swatch pops from silhouette to colour. */
    popSwatch(id) { shopModal.querySelector(`.swatch[data-id="${id}"]`)?.animate([{ scale: 0.4, rotate: "-12deg" }, { scale: 1.25, rotate: "6deg", offset: 0.6 }, { scale: 1, rotate: "0deg" }], { duration: 520, easing: "ease-out" }); },
    shakeElement(el) { el?.animate([{ translate: "0" }, { translate: "-0.25em" }, { translate: "0.25em" }, { translate: "0" }], { duration: 220 }); },
    floatText,
    showResult,
    toast,
    adOverlay: { show() { adBlock.hidden = false; }, hide() { adBlock.hidden = true; } },
    /** Per-frame: smooth coin counter, offer countdown. */
    update(dt) {
      tickCountdown(dt);
      if (worldLeft > 0) { worldLeft -= dt; if (worldLeft <= 0) worldCard.classList.add("hidden"); }
      if (coinsShown !== coinsTarget) {
        const step = Math.max(1, Math.round(Math.abs(coinsTarget - coinsShown) * Math.min(1, dt * 6)));
        coinsShown += Math.sign(coinsTarget - coinsShown) * step;
        if (Math.abs(coinsTarget - coinsShown) < step) coinsShown = coinsTarget;
        coinsEl.textContent = String(coinsShown);
      }
    },
  };
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
