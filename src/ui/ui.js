/**
 * DOM UI layer: round HUD (clock ring, chain total, leaderboard slice, kill feed, boost meter),
 * the home overlay (wordmark, "Offline Arena", PLAY), onboarding pills, the death/respawn
 * message, the pause overlay, touch joystick + boost button, upgrade cards, start boost, skins
 * shop, result dialog (with the podium and the revive countdown ring), toasts, floating
 * numbers, coin fly-ins, name tags, and the ad-request blocker.
 *
 * Why DOM and not in-canvas UI: crisp at every devicePixelRatio, legible at the CG-GAME-002
 * minimum iframe sizes, accessible, and it costs no draw calls.
 *
 * Honesty (GAME_BRIEF "Round rules"): bots are never called players. "OFFLINE ARENA" is shown
 * on the home, the round HUD, the leaderboard header, the kill feed and the podium.
 *
 * Rewarded-ad UI rules baked in (CG-ADS-007/008, CG-QUAL-004): an offer and its
 * decline/alternative use the SAME button class - same size, font and colour -
 * and appear in the same frame; the offer carries a video icon (`data-video`).
 * The revive countdown only ever removes the offer. Do not "improve" any of that
 * by styling, sizing, delaying or animating one of the two differently:
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
  person: `<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="12" fill="#ffc27a"/><circle cx="24" cy="24" r="18" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="4 5"/></svg>`,
  coins: `<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="30" cy="30" r="12" fill="#fff" opacity=".55"/><circle cx="20" cy="20" r="13" fill="#fff"/><text x="20" y="26" font-size="16" text-anchor="middle" fill="#8f96e0" font-family="Arial Black, sans-serif">$</text></svg>`,
  shirt: `<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="30" cy="18" r="8" fill="#fff"/><path d="M26 24 8 40" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".7"/><path d="M30 26 16 42" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".45"/></svg>`,
  close: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="#fff" stroke-width="3" stroke-linecap="round"/></svg>`,
  boost: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13 2 4 14h6l-1 8 9-12h-6z" fill="#fff"/></svg>`,
};
/** A comet trail swatch: coloured when owned, a dark silhouette while locked. */
const swatch = (fill) => `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M8 40 30 18" stroke="${fill}" stroke-width="7" stroke-linecap="round" opacity=".55"/><circle cx="32" cy="16" r="9" fill="${fill}"/></svg>`;

export function createUI(root, { onSound, onPause, onResume, onBuy, onFree, onBoost, onShop, onShopClose, onSkin, onUnlock, onCash, onTouchBoost, onPlay }) {
  root.innerHTML = `
    <div class="hud">
      <div class="hud-left"><div class="coins"><b>0</b><span class="coin">${ICON.coin}</span></div></div>
      <div class="hud-center">
        <div class="clock"><svg viewBox="0 0 44 44" aria-hidden="true"><circle class="track" cx="22" cy="22" r="19"/><circle class="fill" cx="22" cy="22" r="19" pathLength="100"/></svg><b class="stroke">1:30</b></div>
        <div class="score stroke"><b>0</b></div>
        <div class="meter"><i></i></div>
      </div>
      <div class="hud-right">
        <div class="btns"><button class="icon-btn pause" type="button">${ICON.pause}</button><button class="icon-btn sound" type="button"></button></div>
        <div class="ranks"><p class="ranks-title"></p><ol></ol></div>
      </div>
    </div>
    <div class="feed"><p class="feed-title"></p><div class="feed-lines"></div></div>
    <div class="bubbles"></div>
    <div class="floats"></div>
    <div class="home">
      <h1 class="logo stroke"></h1>
      <p class="mode stroke"></p>
      <button class="btn play" type="button"></button>
      <div class="hint"><p class="stroke main"></p><p class="stroke sub"></p></div>
    </div>
    <div class="pill hidden"><span class="pill-icon"></span><span class="pill-text stroke"></span></div>
    <div class="death hidden"><p class="stroke"></p><div class="respawn-ring"><svg viewBox="0 0 40 40" aria-hidden="true"><circle class="track" cx="20" cy="20" r="17"/><circle class="fill" cx="20" cy="20" r="17" pathLength="100"/></svg></div></div>
    <div class="world-card hidden"><p class="stroke small"></p><p class="stroke big"></p></div>
    <div class="stick hidden"><i></i></div>
    <button class="boost-touch hidden" type="button" aria-label="boost">${ICON.boost}</button>
    <div class="upgrades hidden"></div>
    <button class="btn boost hidden" type="button" data-video="1">${ICON.video}<span class="boost-label"></span></button>
    <button class="icon-btn shop-btn hidden" type="button">${ICON.shirt}</button>
    <div class="paused" hidden><div class="paused-card"><h2 class="stroke"></h2><p class="stroke sub"></p><p class="keys"></p></div></div>
    <div class="shop-modal" hidden><div class="shop">
      <button class="icon-btn close" type="button">${ICON.close}</button>
      <h2 class="stroke"></h2>
      <div class="grid"></div>
      <div class="row"></div>
      <p class="note stroke"></p>
    </div></div>
    <div class="modal" hidden><div class="dialog"><p class="dialog-mode"></p><h2 class="stroke"></h2><div class="podium"></div><div class="stats"></div><div class="amount stroke"><span class="coin">${ICON.coin}</span><b>0</b><span class="crate"></span></div><div class="ring" hidden><svg viewBox="0 0 40 40" aria-hidden="true"><circle class="track" cx="20" cy="20" r="17"/><circle class="fill" cx="20" cy="20" r="17" pathLength="100"/></svg><b class="stroke"></b></div><div class="row"></div><p class="note stroke"></p></div></div>
    <div class="toast"></div>
    <div class="ad-block" hidden><div class="spinner"></div></div>`;

  const $ = (sel) => root.querySelector(sel);
  const soundBtn = $(".sound");
  const pauseBtn = $(".pause");
  const coinsEl = $(".coins b");
  const coinsPill = $(".coins");
  const bubbles = $(".bubbles");
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
  const clockEl = $(".clock");
  const clockText = $(".clock b");
  const clockFill = $(".clock .fill");
  const scoreEl = $(".score b");
  const scoreBox = $(".score");
  const meter = $(".meter");
  const meterFill = $(".meter i");
  const ranksList = $(".ranks ol");
  const feedLines = $(".feed-lines");
  const feedBox = $(".feed");
  const pill = $(".pill");
  const death = $(".death");
  const deathFill = $(".death .fill");
  const worldCard = $(".world-card");
  const stick = $(".stick");
  const stickKnob = $(".stick i");
  const boostTouch = $(".boost-touch");
  const paused = $(".paused");

  $(".ranks-title").textContent = t("offline_arena");
  $(".feed-title").textContent = t("offline_arena");

  soundBtn.addEventListener("click", () => onSound?.());
  pauseBtn.addEventListener("click", () => onPause?.());
  paused.addEventListener("click", () => onResume?.());
  $(".play").addEventListener("click", (e) => onPlay?.(e));
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
  const tb = (on) => (e) => { e.preventDefault(); onTouchBoost?.(on); boostTouch.classList.toggle("on", on); };
  boostTouch.addEventListener("pointerdown", tb(true));
  for (const ev of ["pointerup", "pointercancel", "pointerleave"]) boostTouch.addEventListener(ev, tb(false));

  // ---- coins with a counting animation
  let coinsShown = 0;
  let coinsTarget = 0;
  function setCoins(value, { animate = false } = {}) {
    coinsTarget = value;
    if (!animate) { coinsShown = value; coinsEl.textContent = String(value); }
  }

  // ---- name tags over comets, pooled by id
  const bubbleEls = new Map();
  function setBubble(id, x, y, value, visible, kind) {
    let el = bubbleEls.get(id);
    if (!el) {
      el = document.createElement("div");
      el.style.display = "none";
      bubbles.appendChild(el);
      bubbleEls.set(id, el);
    }
    if (!visible) { if (el.style.display !== "none") el.style.display = "none"; return; }
    if (el.style.display === "none") el.style.display = "";
    const cls = `bubble stroke ${kind}`;
    if (el.className !== cls) el.className = cls;
    const txt = String(value);
    if (el.textContent !== txt) el.textContent = txt;
    el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -100%)`;
  }

  // ---- floating numbers
  const floatPool = Array.from({ length: 16 }, () => {
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
          <span class="icon">${it.kind === "start" ? ICON.person : ICON.coins}</span>
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
  function popUpgrade(kind) {
    upgrades.querySelector(`[data-kind="${kind}"] .card`)?.animate([{ scale: 1 }, { scale: 1.12 }, { scale: 1 }], { duration: 280, easing: "ease-out" });
  }

  // ---- result dialog
  // The whole dialog (offer AND decline) scales in together: the decline is never
  // later, smaller or fainter than the offer (CG-ADS-007/008, CG-QUAL-004).
  let countdown = null;   // { left, total, id, onExpire } while a timed offer is on screen
  /**
   * @param {{ kind:string, title:string, amount:number|null, buttons:object[], note?:string, timed?:object,
   *           mode?:string, podium?:{rank:number,name:string,score:number,you:boolean}[], stats?:string[], crate?:string }} o
   */
  function showResult({ kind, title, amount, buttons, note = "", timed = null, mode = "", podium = null, stats = null, crate = "" }) {
    modal.hidden = false;
    dialog.className = `dialog ${kind}`;
    dialog.querySelector(".dialog-mode").textContent = mode;
    dialog.querySelector("h2").textContent = title;
    dialog.querySelector(".podium").innerHTML = podium ? podium.map((r) =>
      `<div class="pod${r.you ? " me" : ""}${r.rank <= 3 ? ` p${r.rank}` : ""}"><span class="r">#${r.rank}</span><span class="nm">${escapeHtml(r.name)}</span><span class="sc">${r.score}</span></div>`).join("") : "";
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

  // ---- ready screen: rewarded start boost
  function showBoost(model) {
    boostBtn.classList.toggle("hidden", !model);
    if (model) boostBtn.querySelector(".boost-label").textContent = model.label;
  }

  // ---- skins shop
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

  // ---- round HUD
  let scoreShown = -1;
  function setScore(n, punch) {
    if (n === scoreShown) return;
    scoreShown = n;
    scoreEl.textContent = n.toLocaleString("en-US");
    if (punch) scoreBox.animate([{ scale: 1 }, { scale: 1.22 }, { scale: 1 }], { duration: 220, easing: "ease-out" });
  }
  let clockShown = "";
  function setClock(secLeft, total, gold) {
    const s = Math.max(0, Math.ceil(secLeft));
    const txt = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
    if (txt !== clockShown) {
      clockShown = txt;
      clockText.textContent = txt;
      if (s <= 10 && s > 0) clockEl.animate([{ scale: 1 }, { scale: 1.15 }, { scale: 1 }], { duration: 240 });
    }
    clockFill.style.strokeDashoffset = String(100 * (1 - Math.max(0, secLeft) / total));
    clockEl.classList.toggle("gold", !!gold);
  }
  const rankRows = Array.from({ length: 5 }, () => {
    const li = document.createElement("li");
    li.innerHTML = `<span class="r"></span><span class="nm"></span><span class="sc"></span>`;
    ranksList.appendChild(li);
    return li;
  });
  function setRanks(rows) {
    for (let i = 0; i < rankRows.length; i++) {
      const li = rankRows[i];
      const r = rows[i];
      if (!r) { li.style.display = "none"; continue; }
      li.style.display = "";
      const [a, b, c] = li.children;
      const rt = `#${r.rank}`, sc = String(r.score);
      if (a.textContent !== rt) a.textContent = rt;
      if (b.textContent !== r.name) b.textContent = r.name;
      if (c.textContent !== sc) c.textContent = sc;
      li.className = r.you ? "me" : r.danger ? "danger" : "";
    }
  }
  const feedPool = Array.from({ length: 3 }, () => {
    const el = document.createElement("p");
    el.className = "stroke";
    feedLines.appendChild(el);
    return el;
  });
  let feedAt = -99;
  let feedClock = 0;
  function feed(text, kind = "") {
    const el = feedPool.pop();
    feedPool.unshift(el);
    feedLines.prepend(el);
    el.textContent = text;
    el.className = `stroke ${kind}`;
    el.getAnimations().forEach((a) => a.cancel());
    el.animate([{ opacity: 0, transform: "translateY(-0.4em)" }, { opacity: 1, transform: "none", offset: 0.08 }, { opacity: 1, offset: 0.8 }, { opacity: 0 }], { duration: 4200, fill: "forwards" });
    feedAt = feedClock;
    feedBox.classList.add("on");
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

  let worldTimer = 0;
  function showWorld(small, big) {
    worldCard.querySelector(".small").textContent = small;
    worldCard.querySelector(".big").textContent = big;
    worldCard.classList.remove("hidden");
    worldCard.animate([{ transform: "translate(-50%, -50%) scale(.5)", opacity: 0 }, { transform: "translate(-50%, -50%) scale(1.08)", opacity: 1, offset: 0.35 }, { transform: "translate(-50%, -50%) scale(1)", opacity: 1 }], { duration: 420, easing: "ease-out" });
    clearTimeout(worldTimer);
    worldTimer = setTimeout(() => worldCard.classList.add("hidden"), 1900);
  }

  return {
    setCoins,
    coinsFly,
    setSound({ effectiveMuted, platformMute }) {
      soundBtn.innerHTML = effectiveMuted ? ICON.soundOff : ICON.soundOn;
      soundBtn.title = platformMute ? t("muted_by_platform") : effectiveMuted ? t("sound_off") : t("sound_on");
      soundBtn.setAttribute("aria-label", soundBtn.title);
    },
    /** Home overlay: wordmark, "Offline Arena", PLAY and a device hint under it. */
    showHome(on, { title = "", mode = "", play = "", main = "", sub = "", icon = "mouse" } = {}) {
      home.classList.toggle("hidden", !on);
      if (!on) return;
      home.querySelector(".logo").textContent = title;
      home.querySelector(".mode").textContent = mode;
      home.querySelector(".play").innerHTML = `<span>${play}</span>`;
      hint.querySelector(".main").innerHTML = `<span class="ico">${ICON[icon] || ""}</span>${escapeHtml(main)}`;
      hint.querySelector(".sub").textContent = sub;
    },
    /** Round HUD on/off (clock, score, meter, pause). The leaderboard slice and feed stay live on the home. */
    showRoundHud(on) { root.classList.toggle("in-round", on); },
    setScore,
    pulseScore() { scoreBox.animate([{ scale: 1 }, { scale: 1.25 }, { scale: 1 }], { duration: 220, easing: "ease-out" }); },
    setClock,
    setMeter(k, visible = true) {
      meter.classList.toggle("hidden", !visible);
      meterFill.style.width = `${Math.round(Math.max(0, Math.min(1, k)) * 100)}%`;
    },
    setRanks,
    feed,
    showPill,
    showWorld,
    /** Death message with the respawn ring (k: 0..1 of the respawn wait). */
    showDeath(text, k) {
      if (text === null) { death.classList.add("hidden"); return; }
      death.classList.remove("hidden");
      worldCard.classList.add("hidden");
      const p = death.querySelector("p");
      if (p.textContent !== text) p.textContent = text;
      deathFill.style.strokeDashoffset = String(100 * Math.max(0, Math.min(1, k)));
    },
    showStick(v) {
      stick.classList.toggle("hidden", !v);
      if (!v) return;
      stick.style.transform = `translate(${v.x.toFixed(0)}px, ${v.y.toFixed(0)}px) translate(-50%, -50%)`;
      stickKnob.style.transform = `translate(${v.kx.toFixed(0)}px, ${v.ky.toFixed(0)}px)`;
    },
    showTouchBoost(on) { boostTouch.classList.toggle("hidden", !on); },
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
    showShopButton(on) { shopBtn.classList.toggle("hidden", !on); },
    openShop(model) { renderShop(model, true); shopModal.hidden = false; root.classList.add("shop-open"); shopModal.querySelector(".shop").animate([{ transform: "scale(.7)", opacity: 0 }, { transform: "scale(1)", opacity: 1 }], { duration: 260, easing: "ease-out" }); },
    updateShop(model) { if (!shopModal.hidden) renderShop(model); },
    closeShop() { shopModal.hidden = true; root.classList.remove("shop-open"); },
    get shopOpen() { return !shopModal.hidden; },
    get modalOpen() { return !modal.hidden; },
    /** The unlock reveal: the new swatch pops from silhouette to colour. */
    popSwatch(id) { shopModal.querySelector(`.swatch[data-id="${id}"]`)?.animate([{ scale: 0.4, rotate: "-12deg" }, { scale: 1.25, rotate: "6deg", offset: 0.6 }, { scale: 1, rotate: "0deg" }], { duration: 520, easing: "ease-out" }); },
    shakeElement(el) { el?.animate([{ translate: "0" }, { translate: "-0.25em" }, { translate: "0.25em" }, { translate: "0" }], { duration: 220 }); },
    setBubble,
    floatText,
    showResult,
    toast,
    adOverlay: { show() { adBlock.hidden = false; }, hide() { adBlock.hidden = true; } },
    /** Per-frame: smooth coin counter, revive countdown, kill-feed box fade. */
    update(dt) {
      tickCountdown(dt);
      feedClock += dt;
      if (feedBox.classList.contains("on") && feedClock - feedAt > 4.3) feedBox.classList.remove("on");
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
