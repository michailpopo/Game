/**
 * Localization.
 *
 * CG-GAME-005: English is mandatory. Translations must be accurate; the language
 * comes from SDK systemInfo.locale, falling back to English. Never ship a
 * machine-translated language nobody has checked - remove it instead.
 * (Storm Grid ships English only for now; DE/FR/ES/PT are a "Should" in docs/GAME_BRIEF.md.)
 */

const STRINGS = {
  en: {
    title: "Storm Grid",
    loading: "Loading…",
    city_n: "CITY {n}",
    city_mode: "CITY {n} · {theme}",
    theme_downtown: "DOWNTOWN", theme_harbour: "HARBOUR", theme_oldtown: "OLD TOWN", theme_hills: "HILL TOWERS",
    theme_neonbay: "NEON BAY", theme_snowpeak: "SNOW PEAK", theme_desert: "DESERT SPIRES", theme_skyport: "SKY PORT",
    hint_hold: "Hold to charge, release to strike",
    hint_sub_pointer: "Let go in the gold band: SUPERCHARGE",
    hint_sub_keys: "Space: charge · Arrows / {keys}: aim",
    pill_band: "Let go in the GOLD band!",
    powered: "POWERED",
    strikes: "Strikes",
    blocks: "Blocks",
    best_chain: "Best chain",
    supercharge: "SUPERCHARGE!",
    fizzle: "FIZZLE…",
    fork_x: "FORK ×{n}",
    chain_x: "CHAIN ×{n}",
    block_powered: "BLOCK POWERED",
    full_power: "FULL POWER!",
    city_cleared: "{p}% POWERED",
    city_dark: "{p}% POWERED",
    so_close: "SO CLOSE!",
    near_full_1: "{p}% - one building from FULL POWER",
    near_full_n: "{p}% - {k} buildings from FULL POWER",
    near_pass: "{p}% - {d}% short of the next city",
    near_plate_1: "{p}% - one building short of ×{m}",
    near_plate_n: "{p}% - {k} buildings short of ×{m}",
    retry_note: "Power {p}% to reach the next city",
    jackpot: "JACKPOT ×{m}",
    stat_lit: "Lit {a}/{b}",
    stat_blocks: "Blocks {a}/{b}",
    stat_chain: "Best chain {n}",
    one_more_strike: "One more strike",
    finish: "Finish",
    claim: "Claim",
    claim_x: "Claim ×{m}",
    next: "Next city",
    retry: "Retry",
    paused: "Paused",
    click_resume: "Click to resume",
    tap_resume: "Tap to resume",
    pause_keys: "P: pause · M: sound",
    up_voltage: "Voltage",
    up_fork: "Fork",
    up_capacitor: "Capacitor",
    up_strikes: "Strikes",
    up_gold: "Gold rods",
    up_fx_voltage: "+2 hops",
    up_fx_fork: "+3% forks",
    up_fx_capacitor: "Wider band",
    up_fx_strikes: "+1 strike",
    up_fx_gold: "+1 gold rod",
    lvl: "LV {n}",
    max: "MAX",
    no_video: "No video available right now. Try again later.",
    adblock_notice: "Unavailable with an ad blocker",
    sound_on: "Sound on",
    sound_off: "Sound off",
    muted_by_platform: "Muted by CrazyGames settings",
    start_boost: "+{n} strikes",
    boost_title: "SUPERCHARGED START",
    boosted: "+{n} STRIKES!",
    skins: "Bolts",
    unlock_random: "Random",
    new_skin: "New bolt!",
    all_skins: "All bolts unlocked!",
    need_coins: "Not enough coins",
    free_coins_in: "Free coins again in {t}",
    try_it: "Try it",
    try_once: "Try it free for one city",
    tried_already: "Already tried - unlock it with coins",
    trying: "Trying {name} for one city!",
    trial_over: "{name} trial over",
    locked: "Locked",
    owned_count: "{a}/{b} bolts",
    gift_title: "DAILY GIFT",
    gift_mode: "DAY {n} STREAK · ×{m}",
    gift_note: "Come back tomorrow for day {n}",
    collect: "Collect",
    collect_x: "Collect ×{m}",
    skin_cyan: "Storm Cyan", skin_magenta: "Magenta", skin_solar: "Solar Gold", skin_plasma: "Plasma Green",
    skin_ember: "Ember", skin_frost: "Frost", skin_violet: "Violet", skin_ruby: "Ruby",
    skin_rainbow: "Neon Rainbow", skin_void: "Void", skin_aurora: "Aurora", skin_legend: "Legend White-Gold",
  },
};

let lang = "en";

export function initI18n(locale) {
  const qs = new URLSearchParams(location.search).get("lang");
  const want = (qs || locale || "en").slice(0, 2).toLowerCase();
  lang = STRINGS[want] ? want : "en";
  document.documentElement.lang = lang;
  return lang;
}

export function t(key, vars = {}) {
  const s = STRINGS[lang][key] ?? STRINGS.en[key] ?? key;
  return s.replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? `{${k}}`));
}

export const languages = Object.keys(STRINGS);
