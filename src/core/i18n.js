/**
 * Localization.
 *
 * CG-GAME-005: English is mandatory. Translations must be accurate; the language
 * comes from SDK systemInfo.locale, falling back to English. Never ship a
 * machine-translated language nobody has checked - remove it instead.
 */

const STRINGS = {
  en: {
    loading: "Loading…",
    hold_to_run: "Hold & drag to run",
    keys_hint: "or use {keys} / arrow keys",
    level: "Level {n}",
    level_complete: "Level complete!",
    level_failed: "Out of runners!",
    claim: "Claim",
    claim_x: "Claim ×{m}",
    next: "Next level",
    retry: "Retry",
    revive: "Revive",
    start_units: "Start units",
    income: "Income",
    lvl: "LVL {n}",
    max: "MAX",
    no_video: "No video available right now. Try again later.",
    adblock_notice: "Unavailable with an ad blocker",
    sound_on: "Sound on",
    sound_off: "Sound off",
    muted_by_platform: "Muted by CrazyGames settings",
    best: "Best: level {n}",
    reward: "Reward",
    start_boost: "Start ×{m}",
    boosted: "×{m} start!",
    skins: "Skins",
    unlock_random: "Random",
    new_skin: "New skin!",
    all_skins: "All skins unlocked!",
    need_coins: "Not enough coins",
    free_coins_in: "Free coins again in {t}",
  },
  de: {
    loading: "Lädt…",
    hold_to_run: "Halten & ziehen zum Laufen",
    keys_hint: "oder {keys} / Pfeiltasten",
    level: "Level {n}",
    level_complete: "Level geschafft!",
    level_failed: "Keine Läufer mehr!",
    claim: "Einsammeln",
    claim_x: "×{m} einsammeln",
    next: "Nächstes Level",
    retry: "Nochmal",
    revive: "Wiederbeleben",
    start_units: "Start-Einheiten",
    income: "Einkommen",
    lvl: "LVL {n}",
    max: "MAX",
    no_video: "Gerade ist kein Video verfügbar. Versuch es später nochmal.",
    adblock_notice: "Mit Werbeblocker nicht verfügbar",
    sound_on: "Ton an",
    sound_off: "Ton aus",
    muted_by_platform: "Von den CrazyGames-Einstellungen stummgeschaltet",
    best: "Bestes: Level {n}",
    reward: "Belohnung",
    start_boost: "Start ×{m}",
    boosted: "×{m}-Start!",
    skins: "Skins",
    unlock_random: "Zufall",
    new_skin: "Neuer Skin!",
    all_skins: "Alle Skins freigeschaltet!",
    need_coins: "Nicht genug Münzen",
    free_coins_in: "Gratis-Münzen wieder in {t}",
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
