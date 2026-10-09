/**
 * The store-cover logo (marketing capture only, never in play), styled like the top covers on the portal: the game's
 * name stacked on two lines in the UI font, two-tone (a white first word, an electric-cyan second word), a thick navy
 * outline, a solid 3D extrusion and a soft top highlight. It sits in the free sky beside the hero shot, never on it.
 * One SVG, so it scales cleanly to every cover size.
 */

const NS = "http://www.w3.org/2000/svg";
const INK = "#0b1446";            // outline (the bolts' deep-blue band, LOOK.boltOutline)
const DEPTH = "#050a2e";          // extrusion
const FACES = [
  [[0, "#ffffff"], [0.55, "#ffffff"], [1, "#cfe9ff"]],          // first word: white
  [[0, "#c8fdff"], [0.35, "#5ef0ff"], [1, "#1c8dff"]],          // second word: electric cyan
];

/**
 * @param {string} title e.g. "Storm Grid"
 * @param {"landscape"|"portrait"|"square"} [kind] picks the placement (styles.css)
 * @returns {SVGSVGElement}
 */
export function coverLogo(title, kind = "landscape") {
  const [top, ...rest] = title.toUpperCase().split(" ");
  const lines = [top, rest.join(" ")].filter(Boolean);
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("viewBox", "0 0 1000 600");
  svg.setAttribute("aria-label", title);
  svg.classList.add("cover-logo", kind);
  const anchor = kind === "landscape" ? "start" : "middle";
  const x = anchor === "start" ? 40 : 500;
  const rows = [[lines[0], 250, 262], [lines[1], 530, 292]];
  const word = ([text, y, size], i) => {
    if (!text) return "";
    const t = (extra) => `<text x="${x}" y="${y}" font-size="${size}" text-anchor="${anchor}" ${extra}>${text}</text>`;
    let depth = "";
    for (let k = 22; k > 0; k -= 2) depth += t(`transform="translate(${k * 0.35} ${k})" fill="${DEPTH}" stroke="${DEPTH}" stroke-width="26" stroke-linejoin="round"`);
    return `<g>${depth}
      ${t(`fill="${INK}" stroke="${INK}" stroke-width="26" stroke-linejoin="round"`)}
      ${t(`fill="url(#cl-face${i})"`)}
      ${t(`fill="url(#cl-shine)" opacity="0.55" clip-path="url(#cl-upper${i})"`)}</g>`;
  };
  const grad = (stops, i) => `<linearGradient id="cl-face${i}" x1="0" y1="0" x2="0" y2="1">${stops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join("")}</linearGradient>`;
  svg.innerHTML = `
    <defs>
      ${FACES.map(grad).join("")}
      <linearGradient id="cl-shine" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity="1"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient>
      ${rows.map(([, y, size], i) => `<clipPath id="cl-upper${i}"><rect x="-100" y="${y - size * 0.72}" width="1200" height="${size * 0.3}"/></clipPath>`).join("")}
    </defs>
    ${rows.map(word).join("")}`;
  return svg;
}
