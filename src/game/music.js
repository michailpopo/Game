/**
 * Background music, written in code: one 16-bar loop rendered once with an OfflineAudioContext after the first
 * gesture and looped seamlessly by AudioService (no file, nothing to download).
 *
 *   104 BPM, A minor / C major, the chords Am - F - C - G one bar each, four times. Layers:
 *   - pad: soft, slightly detuned saw chords through a low-pass filter and a small room (all 16 bars)
 *   - bass: a round, syncopated root line (all bars)
 *   - drums: soft kick, offbeat hats (all bars), kick on 1 and 3 from bar 5, claps on 2 and 4 from bar 9, a hat roll
 *     into the loop point
 *   - arpeggio: 16th notes on the chord tones with a dotted-8th echo (bars 5-16)
 *   - lead: a sparse A-minor-pentatonic tune (bars 9-16)
 * Every note sits on a chord tone or the A minor pentatonic scale, so nothing clashes. Mixed bright enough for laptop
 * and phone speakers (the bass carries an octave overtone) and normalised to about -16 dBFS RMS; AudioService plays it
 * a little under the effects. The echo and release tails past bar 16 are folded back onto bar 1, so the loop has no seam.
 * Claude cannot hear it: the owner judges it.
 */

const BPM = 104, BEAT = 60 / BPM, BAR = BEAT * 4, BARS = 16, TAIL = 3;
const hz = (m) => 440 * 2 ** ((m - 69) / 12);

// one bar each: bass root (MIDI), pad voicing, arpeggio notes
const CHORDS = [
  { root: 45, pad: [57, 60, 64], arp: [69, 72, 76, 81] },   // Am
  { root: 41, pad: [57, 60, 65], arp: [65, 69, 72, 77] },   // F
  { root: 36, pad: [55, 60, 64], arp: [67, 72, 76, 79] },   // C
  { root: 43, pad: [55, 59, 62], arp: [67, 71, 74, 79] },   // G
];
const ARP = [0, 1, 2, 3, 2, 1, 0, 1, 0, 1, 2, 3, 2, 3, 2, 1];   // arpeggio index per 16th
const BASS = [[0, 1.25, 0], [1.5, 0.5, 0], [2, 0.9, 0], [3, 0.45, 12], [3.5, 0.45, 0]];   // [beat, beats, +semitones]
// lead: per bar of a phrase [beat, MIDI, beats]; phrase A (bars 9-12), phrase B (bars 13-16)
const LEAD = [
  [[0, 76, 1.5], [1.5, 74, 0.5], [2, 72, 1], [3, 76, 1]],
  [[0, 72, 1.5], [1.5, 74, 0.5], [2, 69, 2]],
  [[0, 76, 1], [1, 79, 1], [2, 76, 1], [3, 74, 1]],
  [[0, 74, 2], [2, 67, 2]],
  [[0, 81, 1], [1, 79, 0.5], [1.5, 76, 1.5], [3, 74, 1]],
  [[0, 72, 1], [1, 69, 1], [2, 72, 1], [3, 74, 1]],
  [[0, 76, 2], [2, 79, 1], [3, 76, 1]],
  [[0, 74, 3]],
];

/**
 * Renders the loop. Resolves to an AudioBuffer of exactly 16 bars (~36.9 s), stereo.
 * @param {number} sampleRate
 * @param {{ layers?: string[], raw?: boolean }} [o]  QA only: render some layers (pad, bass, drums, arp, lead), skip
 *   the normalisation (raw), to measure the mix
 */
export async function renderMusic(sampleRate = 44100, { layers = ["pad", "bass", "drums", "arp", "lead"], raw = false } = {}) {
  const on = (name) => layers.includes(name);
  const rate = Math.min(44100, sampleRate);
  const len = Math.round(BAR * BARS * rate), total = len + Math.round(TAIL * rate);
  const ctx = new OfflineAudioContext(2, total, rate);
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

  // master: glue compressor -> out
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -16; comp.knee.value = 8; comp.ratio.value = 3; comp.attack.value = 0.01; comp.release.value = 0.25;
  comp.connect(ctx.destination);
  const bus = ctx.createGain(); bus.gain.value = 0.8; bus.connect(comp);

  // room: a generated, softly decaying stereo noise impulse
  const irLen = Math.round(1.6 * rate), ir = ctx.createBuffer(2, irLen, rate);
  for (let ch = 0; ch < 2; ch++) { const d = ir.getChannelData(ch); for (let i = 0; i < irLen; i++) d[i] = (rnd() * 2 - 1) * (1 - i / irLen) ** 3; }
  const room = ctx.createConvolver(); room.buffer = ir;
  const roomOut = ctx.createGain(); roomOut.gain.value = 0.22; room.connect(roomOut).connect(bus);

  // echo: dotted 8th, darkening feedback
  const echo = ctx.createDelay(2); echo.delayTime.value = BEAT * 0.75;
  const echoFb = ctx.createGain(); echoFb.gain.value = 0.32;
  const echoTone = ctx.createBiquadFilter(); echoTone.type = "lowpass"; echoTone.frequency.value = 2600;
  echo.connect(echoTone).connect(echoFb).connect(echo);
  const echoOut = ctx.createGain(); echoOut.gain.value = 0.3; echoTone.connect(echoOut).connect(bus);

  const noise = ctx.createBuffer(1, Math.round(0.5 * rate), rate);
  { const d = noise.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = rnd() * 2 - 1; }

  // an envelope on a gain node: attack to peak, decay to sustain, release at `end`
  const env = (g, t, end, { a = 0.01, d = 0.1, s = 0.7, r = 0.2, peak = 1 } = {}) => {
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(peak, t + a);
    g.gain.setTargetAtTime(peak * s, t + a, d / 3);
    g.gain.setTargetAtTime(0, Math.max(t + a, end), r / 4);
  };

  // ---------------------------------------------------------------- pad
  const padFilter = ctx.createBiquadFilter(); padFilter.type = "lowpass"; padFilter.frequency.value = 1900; padFilter.Q.value = 0.5;
  const padOut = ctx.createGain(); padOut.gain.value = 0.17;
  padFilter.connect(padOut); padOut.connect(bus); padOut.connect(room);
  for (let bar = 0; bar < BARS && on("pad"); bar++) {
    const t = bar * BAR, ch = CHORDS[bar % 4];
    for (const m of ch.pad) {
      for (const cents of [-6, 6]) {
        const o = ctx.createOscillator(); o.type = "sawtooth"; o.frequency.value = hz(m); o.detune.value = cents;
        const g = ctx.createGain(); env(g, t, t + BAR - 0.05, { a: 0.35, d: 0.6, s: 0.8, r: 0.7, peak: 0.5 });
        const p = ctx.createStereoPanner(); p.pan.value = cents < 0 ? -0.35 : 0.35;
        o.connect(g).connect(p).connect(padFilter);
        o.start(t); o.stop(t + BAR + 1);
      }
    }
  }

  // ---------------------------------------------------------------- bass
  const bassFilter = ctx.createBiquadFilter(); bassFilter.type = "lowpass"; bassFilter.frequency.value = 1200;
  const bassOut = ctx.createGain(); bassOut.gain.value = 0.2; bassFilter.connect(bassOut).connect(bus);
  for (let bar = 0; bar < BARS && on("bass"); bar++) {
    const ch = CHORDS[bar % 4];
    for (const [b, dur, up] of BASS) {
      const t = bar * BAR + b * BEAT;
      const o = ctx.createOscillator(); o.type = "triangle"; o.frequency.value = hz(ch.root + up);
      const o8 = ctx.createOscillator(); o8.type = "sawtooth"; o8.frequency.value = hz(ch.root + up + 12);   // small speakers hear this
      const g8 = ctx.createGain(); g8.gain.value = 0.22;
      const g = ctx.createGain(); env(g, t, t + dur * BEAT, { a: 0.008, d: 0.18, s: 0.65, r: 0.12 });
      o.connect(g); o8.connect(g8).connect(g); g.connect(bassFilter);
      for (const x of [o, o8]) { x.start(t); x.stop(t + dur * BEAT + 0.3); }
    }
  }

  // ---------------------------------------------------------------- drums
  const drums = ctx.createGain(); drums.gain.value = 0.65; drums.connect(bus);
  const kick = (t, v = 1) => {
    const o = ctx.createOscillator(); o.type = "sine";
    o.frequency.setValueAtTime(130, t); o.frequency.exponentialRampToValueAtTime(48, t + 0.12);
    const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.9 * v, t + 0.004); g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
    o.connect(g).connect(drums); o.start(t); o.stop(t + 0.32);
  };
  const hatHp = ctx.createBiquadFilter(); hatHp.type = "highpass"; hatHp.frequency.value = 7500;
  const hatOut = ctx.createGain(); hatOut.gain.value = 0.22; hatHp.connect(hatOut).connect(drums);
  const hat = (t, v = 1, pan = 0.2) => {
    const s = ctx.createBufferSource(); s.buffer = noise; s.playbackRate.value = 1;
    const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + 0.002); g.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
    const p = ctx.createStereoPanner(); p.pan.value = pan;
    s.connect(g).connect(p).connect(hatHp); s.start(t, rnd() * 0.4); s.stop(t + 0.06);
  };
  const clapBp = ctx.createBiquadFilter(); clapBp.type = "bandpass"; clapBp.frequency.value = 1500; clapBp.Q.value = 0.8;
  const clapOut = ctx.createGain(); clapOut.gain.value = 0.35; clapBp.connect(clapOut); clapOut.connect(drums); clapOut.connect(room);
  const clap = (t) => {
    for (const [dt, v] of [[0, 0.7], [0.012, 0.5], [0.024, 1]]) {
      const s = ctx.createBufferSource(); s.buffer = noise;
      const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t + dt); g.gain.exponentialRampToValueAtTime(v, t + dt + 0.002); g.gain.exponentialRampToValueAtTime(0.001, t + dt + (dt > 0.02 ? 0.14 : 0.03));
      s.connect(g).connect(clapBp); s.start(t + dt, rnd() * 0.3); s.stop(t + dt + 0.16);
    }
  };
  const step = BEAT / 4;
  for (let bar = 0; bar < BARS && on("drums"); bar++) {
    const t0 = bar * BAR;
    kick(t0, bar < 4 ? 0.7 : 1);
    if (bar >= 4) kick(t0 + 8 * step);
    if (bar >= 4 && bar % 4 === 3) kick(t0 + 14 * step, 0.6);
    for (const s of [2, 6, 10, 14]) hat(t0 + s * step, 0.55 + rnd() * 0.15, 0.25);
    if (bar >= 8) for (const s of [0, 4, 8, 12]) hat(t0 + s * step, 0.22, -0.2);
    if (bar >= 8) { clap(t0 + 4 * step); clap(t0 + 12 * step); }
    if (bar === BARS - 1) for (const s of [13, 15]) hat(t0 + s * step, 0.45, -0.25);
  }

  // ---------------------------------------------------------------- arpeggio (bars 5-16)
  const arpFilter = ctx.createBiquadFilter(); arpFilter.type = "lowpass"; arpFilter.frequency.value = 3400;
  const arpOut = ctx.createGain(); arpOut.gain.value = 0.15;
  arpFilter.connect(arpOut); arpOut.connect(bus); arpOut.connect(echo);
  for (let bar = 4; bar < BARS && on("arp"); bar++) {
    const ch = CHORDS[bar % 4];
    for (let s = 0; s < 16; s++) {
      const t = bar * BAR + s * step;
      const o = ctx.createOscillator(); o.type = "square"; o.frequency.value = hz(ch.arp[ARP[s]]);
      const g = ctx.createGain(); env(g, t, t + step * 0.6, { a: 0.004, d: 0.08, s: 0.35, r: 0.08, peak: s % 4 === 0 ? 1 : 0.7 });
      const p = ctx.createStereoPanner(); p.pan.value = s % 2 ? 0.3 : -0.3;
      o.connect(g).connect(p).connect(arpFilter);
      o.start(t); o.stop(t + step + 0.2);
    }
  }

  // ---------------------------------------------------------------- lead (bars 9-16)
  const leadFilter = ctx.createBiquadFilter(); leadFilter.type = "lowpass"; leadFilter.frequency.value = 3200;
  const leadOut = ctx.createGain(); leadOut.gain.value = 0.14;
  leadFilter.connect(leadOut); leadOut.connect(bus); leadOut.connect(echo); leadOut.connect(room);
  for (let i = 0; i < 8 && on("lead"); i++) {
    const bar = 8 + i;
    for (const [b, m, dur] of LEAD[i]) {
      const t = bar * BAR + b * BEAT, end = t + dur * BEAT - 0.04;
      const o = ctx.createOscillator(); o.type = "triangle"; o.frequency.value = hz(m);
      const o2 = ctx.createOscillator(); o2.type = "sine"; o2.frequency.value = hz(m + 12);
      const g2 = ctx.createGain(); g2.gain.value = 0.25;
      const vib = ctx.createOscillator(); vib.frequency.value = 5.2;
      const vibDepth = ctx.createGain(); vibDepth.gain.setValueAtTime(0, t); vibDepth.gain.linearRampToValueAtTime(5, t + 0.25);   // cents
      vib.connect(vibDepth); vibDepth.connect(o.detune); vibDepth.connect(o2.detune);
      const g = ctx.createGain(); env(g, t, end, { a: 0.02, d: 0.25, s: 0.75, r: 0.3 });
      o.connect(g); o2.connect(g2).connect(g); g.connect(leadFilter);
      for (const x of [o, o2, vib]) { x.start(t); x.stop(end + 0.4); }
    }
  }

  const out = await ctx.startRendering();
  // fold the tail past bar 16 onto bar 1, then normalise: about -16 dBFS RMS, peaks under -1 dBFS
  const res = new AudioBuffer({ numberOfChannels: 2, length: len, sampleRate: rate });
  let sum = 0, peak = 0;
  const chans = [0, 1].map((c) => {
    const src = out.getChannelData(c), d = new Float32Array(len);
    d.set(src.subarray(0, len));
    for (let i = 0; i < total - len; i++) d[i] += src[len + i];
    for (let i = 0; i < len; i++) { sum += d[i] * d[i]; peak = Math.max(peak, Math.abs(d[i])); }
    return d;
  });
  const rms = Math.sqrt(sum / (2 * len)) || 1;
  const k = raw ? 1 : Math.min(0.158 / rms, 0.89 / (peak || 1));
  chans.forEach((d, c) => { for (let i = 0; i < len; i++) d[i] *= k; res.copyToChannel(d, c); });
  return res;
}
