/**
 * The store-cover logo (marketing capture only, never in play): the game's name stacked on two lines in the UI font,
 * a cool gradient face with a thick ink outline and a 3D drop, and a jagged lightning strike behind the letters that
 * flashes through the gap between the words, glowing (in front it would hide a letter). One SVG, so it scales cleanly to every cover size.
 */

const NS = "http://www.w3.org/2000/svg";

// face gradient stops, ink (outline + drop), glow behind the letters, bolt glow
const STYLES = {
  electric: { face: [[0, "#ffffff"], [0.45, "#dcf8ff"], [1, "#4cc3ff"]], ink: "#0a1640", drop: "#050b26", glow: "#3ee8ff", bolt: "#3ee8ff" },
  chrome: { face: [[0, "#ffffff"], [0.47, "#e3e9f7"], [0.5, "#7a84aa"], [0.74, "#c6cfe8"], [1, "#ffffff"]], ink: "#1a1033", drop: "#0b0620", glow: "#b48cff", bolt: "#9fe6ff" },
  neon: { face: [[0, "#ffffff"], [1, "#ffd3ea"]], ink: "#3a0838", drop: "#1c021c", glow: "#ff2d95", bolt: "#ff7ac4" },
};

/** Seeded jagged line from a to b: segs pieces, each kink pushed up to jag sideways. */
function jagged(r, a, b, segs, jag) {
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L;
  const pts = [a];
  for (let i = 1; i < segs; i++) {
    const t = (i + (r() - 0.5) * 0.5) / segs, o = (r() - 0.5) * 2 * jag;
    pts.push([a[0] + dx * t + nx * o, a[1] + dy * t + ny * o]);
  }
  pts.push(b);
  return pts;
}

/** A polyline as a polygon whose half-width tapers from w0 to w1 (a real strike thins towards its tip). */
function taper(pts, w0, w1) {
  const left = [], right = [], n = pts.length;
  for (let i = 0; i < n; i++) {
    const p = pts[Math.max(0, i - 1)], q = pts[Math.min(n - 1, i + 1)];
    const tx = q[0] - p[0], ty = q[1] - p[1], L = Math.hypot(tx, ty) || 1;
    const w = w0 + (w1 - w0) * (i / (n - 1));
    left.push(`${(pts[i][0] - ty / L * w).toFixed(1)},${(pts[i][1] + tx / L * w).toFixed(1)}`);
    right.push(`${(pts[i][0] + ty / L * w).toFixed(1)},${(pts[i][1] - tx / L * w).toFixed(1)}`);
  }
  return left.concat(right.reverse()).join(" ");
}

/** @param {string} title e.g. "Storm Grid" @param {string} [style] @returns {SVGSVGElement} */
export function coverLogo(title, style = "electric") {
  const S = STYLES[style] ?? STYLES.electric;
  const [top, ...rest] = title.toUpperCase().split(" ");
  const bottom = rest.join(" ") || "";
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("viewBox", "0 -40 1000 640");
  svg.setAttribute("aria-label", title);
  svg.classList.add("cover-logo");

  // the strike: top right to bottom left through both words, two forks
  let seed = 7;
  const r = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const main = jagged(r, [790, -40], [290, 610], 12, 30);
  const forks = [jagged(r, main[3], [900, 250], 5, 18), jagged(r, main[8], [150, 470], 5, 18)];
  const shapes = [taper(main, 24, 6), ...forks.map((f) => taper(f, 10, 2))];
  const bolt = (fill, cls = "") => shapes.map((s) => `<polygon points="${s}" fill="${fill}" ${cls}/>`).join("");

  const face = S.face.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join("");
  const word = (text, y, size) => `
    <text x="500" y="${y}" font-size="${size}" fill="${S.glow}" stroke="${S.glow}" stroke-width="34" stroke-linejoin="round" opacity="0.55" filter="url(#cl-soft)">${text}</text>
    <text x="500" y="${y + 16}" font-size="${size}" fill="${S.drop}" stroke="${S.drop}" stroke-width="30" stroke-linejoin="round">${text}</text>
    <text x="500" y="${y}" font-size="${size}" fill="${S.ink}" stroke="${S.ink}" stroke-width="30" stroke-linejoin="round">${text}</text>
    <text x="500" y="${y}" font-size="${size}" fill="url(#cl-face)" stroke="#ffffff" stroke-opacity="0.55" stroke-width="3" paint-order="stroke">${text}</text>`;
  svg.innerHTML = `
    <defs>
      <linearGradient id="cl-face" x1="0" y1="0" x2="0" y2="1">${face}</linearGradient>
      <filter id="cl-glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="22" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="cl-soft" x="-20%" y="-40%" width="140%" height="180%"><feGaussianBlur stdDeviation="18"/></filter>
    </defs>
    <g filter="url(#cl-glow)">${bolt(S.bolt)}</g>
    ${bolt("#ffffff")}
    ${word(top, 232, 238)}
    ${bottom ? word(bottom, 520, 250) : ""}`;
  return svg;
}
