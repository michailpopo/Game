/**
 * Save service.
 *
 * Provider choice (docs.crazygames.com/sdk/data, read 2026-09-11):
 *   - SDK present (crazygames or local environment): the Data module ONLY.
 *     The docs: "You need to fully rely on the Data Module save (for both guest
 *     and logged-in users on CrazyGames) and avoid relying on local saves".
 *     Guests are stored locally by the SDK and migrate on login automatically.
 *   - No SDK, or Data module disabled (Progress Save not enabled in the
 *     submission): localStorage.
 *   - Storage blocked (private mode, quota): memory, and the game says so in
 *     the console.
 *
 * Handled explicitly because each has bitten shipped games:
 *   missing data -> defaults | corrupted JSON -> quarantined under `.broken`,
 *   never deleted | save from a NEWER build -> run on defaults, leave the file
 *   untouched | schema drift -> numbered migrations | 1 MB Data module cap
 *   (CG-DATA-002) -> refused before the SDK throws | burst writes -> debounced,
 *   with flush() on level end and pagehide.
 */

const CAP_BYTES = 1024 * 1024;

class MemoryProvider {
  name = "memory"; #m = new Map();
  get(k) { return this.#m.has(k) ? this.#m.get(k) : null; }
  set(k, v) { this.#m.set(k, v); return true; }
  remove(k) { this.#m.delete(k); return true; }
}

class LocalStorageProvider {
  name = "localStorage";
  static available() {
    try { localStorage.setItem("__probe__", "1"); localStorage.removeItem("__probe__"); return true; } catch { return false; }
  }
  get(k) { try { return localStorage.getItem(k); } catch { return null; } }
  set(k, v) { try { localStorage.setItem(k, v); return true; } catch (e) { console.warn("[save] localStorage write failed", e); return false; } }
  remove(k) { try { localStorage.removeItem(k); return true; } catch { return false; } }
}

class DataModuleProvider {
  name = "crazygames-data"; #p;
  constructor(platform) { this.#p = platform; }
  get(k) { return this.#p.dataGet(k); }
  set(k, v) { return this.#p.dataSet(k, v); }
  remove(k) { return this.#p.dataRemove(k); }
}

export class SaveService {
  #key; #version; #defaults; #migrations; #debounceMs;
  #provider = new MemoryProvider(); #platform = null;
  #data; #dirty = false; #timer = 0;
  status = { provider: "memory", loadedFrom: null, lastWriteOk: null, lastError: null, bytes: 0, recovered: false };

  /**
   * @param {{ key:string, version:number, defaults:object,
   *           migrations?:Record<number,(d:object)=>object>, debounceMs?:number }} opts
   */
  constructor({ key, version, defaults, migrations = {}, debounceMs = 1000 }) {
    if (!key || !Number.isInteger(version)) throw new Error("SaveService needs a key and an integer version");
    this.#key = key;
    this.#version = version;
    this.#defaults = defaults;
    this.#migrations = migrations;
    this.#debounceMs = debounceMs;
    this.#data = structuredClone(defaults);
  }

  get data() { return this.#data; }

  init(platform) {
    this.#platform = platform;
    this.#pickProvider();
    this.load();
    // The first read can reveal that the Data module is disabled for this game ("Progress Save" off): then the
    // progress lives in localStorage (flush() falls back there), so read it from there instead of starting fresh.
    if (this.#provider instanceof DataModuleProvider && !platform.dataAvailable) { this.#pickProvider(); this.load(); }
    return this;
  }

  #pickProvider() {
    if (this.#platform?.dataAvailable) this.#provider = new DataModuleProvider(this.#platform);
    else if (LocalStorageProvider.available()) this.#provider = new LocalStorageProvider();
    else { this.#provider = new MemoryProvider(); console.warn("[save] no persistent storage - progress will not survive a reload"); }
    this.status.provider = this.#provider.name;
  }

  load() {
    let raw = null;
    try { raw = this.#provider.get(this.#key); } catch (e) { console.warn("[save] read failed", e); }
    if (raw == null) {
      this.#data = structuredClone(this.#defaults);
      this.status.loadedFrom = "defaults";
      return this.#data;
    }

    let parsed;
    try {
      parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") throw new Error("not an object");
    } catch (e) {
      console.error("[save] corrupted save quarantined", e);
      this.#provider.set(`${this.#key}.broken`, raw);
      this.#data = structuredClone(this.#defaults);
      this.status.loadedFrom = "defaults (corrupted save quarantined)";
      this.status.recovered = true;
      return this.#data;
    }

    const found = Number(parsed.__v ?? 0);
    if (found > this.#version) {
      console.warn(`[save] save is v${found}; this build understands v${this.#version}. Not downgrading.`);
      this.#data = structuredClone(this.#defaults);
      this.#readOnly = true;
      this.status.loadedFrom = `defaults (save from newer build v${found}, left untouched)`;
      this.status.recovered = true;
      return this.#data;
    }

    let d = parsed;
    for (let v = found; v < this.#version; v++) {
      const migrate = this.#migrations[v + 1];
      if (!migrate) { console.warn(`[save] no migration to v${v + 1}; using defaults`); d = structuredClone(this.#defaults); break; }
      try { d = migrate(d); } catch (e) { console.error(`[save] migration to v${v + 1} failed`, e); d = structuredClone(this.#defaults); break; }
    }
    delete d.__v;
    this.#data = { ...structuredClone(this.#defaults), ...d };
    this.status.loadedFrom = this.#provider.name + (found < this.#version ? ` (migrated v${found}->v${this.#version})` : "");
    return this.#data;
  }

  #readOnly = false;

  /** Mutate via callback; the write is debounced. */
  update(fn) {
    const r = fn(this.#data);
    if (r && typeof r === "object") this.#data = r;
    this.#dirty = true;
    clearTimeout(this.#timer);
    this.#timer = setTimeout(() => this.flush(), this.#debounceMs);
    return this.#data;
  }

  /** Write now. Call on level end, before ads, and on pagehide. */
  flush() {
    clearTimeout(this.#timer);
    if (!this.#dirty || this.#readOnly) return true;
    const payload = JSON.stringify({ ...this.#data, __v: this.#version });
    this.status.bytes = payload.length;
    if (payload.length > CAP_BYTES) {
      this.status.lastWriteOk = false;
      this.status.lastError = `payload ${payload.length} B exceeds the 1 MB Data module cap`;
      console.error("[save]", this.status.lastError);
      return false;
    }
    let ok = this.#provider.set(this.#key, payload);
    if (!ok && this.#provider instanceof DataModuleProvider && !this.#platform.dataAvailable) {
      // Data module turned out to be disabled for this game: keep the session's progress locally.
      this.#pickProvider();
      ok = this.#provider.set(this.#key, payload);
    }
    this.#dirty = !ok;
    this.status.lastWriteOk = ok;
    if (!ok) this.status.lastError = `write to ${this.#provider.name} failed`;
    return ok;
  }

  reset() {
    this.#data = structuredClone(this.#defaults);
    this.#readOnly = false;
    this.#dirty = true;
    return this.flush();
  }
}
