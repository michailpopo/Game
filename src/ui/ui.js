/**
 * DOM UI layer: HUD, hints, upgrade cards, start boost, skins shop, result dialog
 * (with the revive countdown ring), toasts, floating numbers, coin fly-ins, and the
 * ad-request blocker.
 *
 * Why DOM and not in-canvas UI: crisp at every devicePixelRatio, legible at the
 * CG-GAME-002 minimum iframe sizes, accessible, and it costs no draw calls.
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
  coin: `<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="13.5" fill="#ffc83d" stroke="#e08e12" stroke-width="3"/><circle cx="16" cy="16" r="8" fill="none" stroke="#fff1b8" stroke-width="2.4"/></svg>`,
  video: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="5" width="14" height="14" rx="3"/><path d="M17 10.2 22 7v10l-5-3.2z"/></svg>`,
  soundOn: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>`,
  soundOff: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16.5 9.5l5 5m0-5-5 5" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/></svg>`,
  hand: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M26 6c3 0 5 2 5 5v17l2-1c2-1 5 0 6 2l.5 1 2-1c2-1 5 0 6 2l.5 1 1-.4c2.5-1 5 .5 5.5 3l1 10c.6 6-2 12-7 15l-2 1H31c-4 0-7-2-9-5l-9-14c-1.5-2.5-.5-5.5 2-6.5 2-.8 4 0 5.5 1.5L21 36V11c0-3 2-5 5-5z" fill="#fff" stroke="#2a1f4d" stroke-width="3" stroke-linejoin="round"/></svg>`,
  person: `<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="12" r="7.5" fill="#fff"/><path d="M12.5 44c0-11 4.5-23 11.5-23s11.5 12 11.5 23z" fill="#fff"/></svg>`,
  coins: `<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="30" cy="30" r="12" fill="#fff" opacity=".55"/><circle cx="20" cy="20" r="13" fill="#fff"/><text x="20" y="26" font-size="16" text-anchor="middle" fill="#8f96e0" font-family="Arial Black, sans-serif">$</text></svg>`,
  shirt: `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M17 7h14l10 6-4 9-5-2v21H16V20l-5 2-4-9z" fill="#fff" stroke="#2a1f4d" stroke-width="2.5" stroke-linejoin="round"/></svg>`,
  close: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="#fff" stroke-width="3" stroke-linecap="round"/></svg>`,
};
/** A crowd unit as a swatch: coloured when owned, a dark silhouette while locked. */
const bean = (fill) => `<svg viewBox="0 0 48 48" aria-hidden="true"><ellipse cx="24" cy="44" rx="11" ry="2.6" fill="rgba(20,10,40,.25)"/><path d="M13 42c0-12 3-20 11-20s11 8 11 20z" fill="${fill}"/><circle cx="24" cy="14" r="8.5" fill="${fill}"/></svg>`;

export function createUI(root, { onSound, onBuy, onFree, onBoost, onShop, onShopClose, onSkin, onUnlock, onCash }) {
  root.innerHTML = `
    <div class="hud">
      <button class="icon-btn sound" type="button"></button>
      <div class="progress"><span class="lv lv-a">1</span><div class="bar"><i></i></div><span class="lv lv-b">2</span></div>
      <div class="coins"><b>0</b><span class="coin">${ICON.coin}</span></div>
    </div>
    <div class="bubbles"></div>
    <div class="floats"></div>
    <div class="hint hidden"><div class="hand">${ICON.hand}</div><p class="stroke main"></p><p class="stroke sub"></p></div>
    <div class="upgrades hidden"></div>
    <button class="btn boost hidden" type="button" data-video="1">${ICON.video}<span class="boost-label"></span></button>
    <button class="icon-btn shop-btn hidden" type="button">${ICON.shirt}</button>
    <div class="shop-modal" hidden><div class="shop">
      <button class="icon-btn close" type="button">${ICON.close}</button>
      <h2 class="stroke"></h2>
      <div class="grid"></div>
      <div class="row"></div>
      <p class="note stroke"></p>
    </div></div>
    <div class="modal" hidden><div class="dialog"><h2 class="stroke"></h2><div class="amount stroke"><span class="coin">${ICON.coin}</span><b>0</b></div><div class="ring" hidden><svg viewBox="0 0 40 40" aria-hidden="true"><circle class="track" cx="20" cy="20" r="17"/><circle class="fill" cx="20" cy="20" r="17" pathLength="100"/></svg><b class="stroke"></b></div><div class="row"></div><p class="note stroke"></p></div></div>
    <div class="toast"></div>
    <div class="ad-block" hidden><div class="spinner"></div></div>`;

  const $ = (sel) => root.querySelector(sel);
  const soundBtn = $(".sound");
  const barFill = $(".bar i");
  const coinsEl = $(".coins b");
  const coinsPill = $(".coins");
  const bubbles = $(".bubbles");
  const floats = $(".floats");
  const hint = $(".hint");
  const upgrades = $(".upgrades");
  const modal = $(".modal");
  const dialog = $(".dialog");
  const toastEl = $(".toast");
  const adBlock = $(".ad-block");
  const boostBtn = $(".boost");
  const shopBtn = $(".shop-btn");
  const shopModal = $(".shop-modal");
  const ring = dialog.querySelector(".ring");

  soundBtn.addEventListener("click", () => onSound?.());
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

  // ---- bubbles above crowds, pooled by id
  const bubbleEls = new Map();
  function setBubble(id, x, y, value, visible, kind) {
    let el = bubbleEls.get(id);
    if (!el) {
      el = document.createElement("div");
      el.className = `bubble stroke ${kind}`;
      bubbles.appendChild(el);
      bubbleEls.set(id, el);
    }
    if (!visible) { if (el.style.display !== "none") el.style.display = "none"; return; }
    if (el.style.display === "none") el.style.display = "";
    const txt = String(value);
    if (el.textContent !== txt) el.textContent = txt;
    el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -100%)`;
  }
  function pulseBubble(id) {
    bubbleEls.get(id)?.animate([{ scale: 1 }, { scale: 1.35 }, { scale: 1 }], { duration: 260, easing: "ease-out", composite: "add" });
  }

  // ---- floating numbers
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
      { transform: `translate(${x}px, ${y - 30}px) translate(-50%, -50%) scale(1.15)`, opacity: 1, offset: 0.18 },
      { transform: `translate(${x}px, ${y - 90}px) translate(-50%, -50%) scale(1)`, opacity: 0 },
    ], { duration: 950, easing: "cubic-bezier(.2,.8,.2,1)", fill: "forwards" });
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
      const ex = to.right - rootRect.left - 18;
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
  function showResult({ kind, title, amount, buttons, note = "", timed = null }) {
    modal.hidden = false;
    dialog.className = `dialog ${kind}`;
    dialog.querySelector("h2").textContent = title;
    const amountEl = dialog.querySelector(".amount b");
    amountEl.textContent = String(amount);
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
      `<button class="swatch ${s.owned ? "owned" : "locked"}${s.selected ? " selected" : ""}" type="button" data-act="skin" data-id="${s.id}" ${s.owned ? "" : "disabled"} aria-label="${s.id}">${bean(s.owned ? s.color : "#2c2446")}</button>`).join("");
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

  return {
    setLevel(n) { $(".lv-a").textContent = String(n); $(".lv-b").textContent = String(n + 1); },
    setProgress(p) { barFill.style.width = `${(p * 100).toFixed(1)}%`; },
    setCoins,
    coinsFly,
    setSound({ effectiveMuted, platformMute }) {
      soundBtn.innerHTML = effectiveMuted ? ICON.soundOff : ICON.soundOn;
      soundBtn.title = platformMute ? t("muted_by_platform") : effectiveMuted ? t("sound_off") : t("sound_on");
      soundBtn.setAttribute("aria-label", soundBtn.title);
    },
    showHint(on, keysLabel = "A/D") {
      if (on) {
        hint.querySelector(".main").textContent = t("hold_to_run");
        hint.querySelector(".sub").textContent = t("keys_hint", { keys: keysLabel });
      }
      hint.classList.toggle("hidden", !on);
    },
    showUpgrades,
    popUpgrade,
    showBoost,
    showShopButton(on) { shopBtn.classList.toggle("hidden", !on); },
    openShop(model) { renderShop(model, true); shopModal.hidden = false; shopModal.querySelector(".shop").animate([{ transform: "scale(.7)", opacity: 0 }, { transform: "scale(1)", opacity: 1 }], { duration: 260, easing: "ease-out" }); },
    updateShop(model) { if (!shopModal.hidden) renderShop(model); },
    closeShop() { shopModal.hidden = true; },
    get shopOpen() { return !shopModal.hidden; },
    /** The unlock reveal: the new swatch pops from silhouette to colour. */
    popSwatch(id) { shopModal.querySelector(`.swatch[data-id="${id}"]`)?.animate([{ scale: 0.4, rotate: "-12deg" }, { scale: 1.25, rotate: "6deg", offset: 0.6 }, { scale: 1, rotate: "0deg" }], { duration: 520, easing: "ease-out" }); },
    shakeElement(el) { el?.animate([{ translate: "0" }, { translate: "-0.25em" }, { translate: "0.25em" }, { translate: "0" }], { duration: 220 }); },
    setBubble,
    pulseBubble,
    floatText,
    showResult,
    toast,
    adOverlay: { show() { adBlock.hidden = false; }, hide() { adBlock.hidden = true; } },
    /** Per-frame: smooth coin counter, revive countdown. */
    update(dt) {
      tickCountdown(dt);
      if (coinsShown !== coinsTarget) {
        const step = Math.max(1, Math.round(Math.abs(coinsTarget - coinsShown) * Math.min(1, dt * 6)));
        coinsShown += Math.sign(coinsTarget - coinsShown) * step;
        if (Math.abs(coinsTarget - coinsShown) < step) coinsShown = coinsTarget;
        coinsEl.textContent = String(coinsShown);
      }
    },
  };
}
