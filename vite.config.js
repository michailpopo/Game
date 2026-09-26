import { defineConfig } from "vite";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));

/**
 * Dev only: replace the real CrazyGames SDK tag with dev/mock-crazygames-sdk.js.
 *
 * `apply: "serve"` makes it structurally impossible to ship the mock - a build
 * that fakes ad completions would look to CrazyGames QA like fraud.
 * The real tag is REMOVED, not just preceded: the CDN script would otherwise
 * overwrite window.CrazyGames and you would test the real SDK while believing
 * you test the mock.
 *
 *   http://127.0.0.1:5173/?mockAd=error&mockAdCode=adsDisabledBasicLaunch
 *   http://127.0.0.1:5173/?mockAd=slow&mockAdDelay=4000
 *   http://127.0.0.1:5173/?muteAudio=true
 *   http://127.0.0.1:5173/?realsdk=1        real SDK in its "local" environment
 */
function devMockSdk() {
  return {
    name: "dev-mock-crazygames-sdk",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/__dev/mock-crazygames-sdk.js", (_req, res) => {
        res.setHeader("Content-Type", "text/javascript");
        res.end(readFileSync(resolve(root, "dev/mock-crazygames-sdk.js"), "utf8"));
      });
    },
    transformIndexHtml(html, ctx) {
      const url = new URL(ctx.originalUrl || ctx.path || "/", "http://127.0.0.1");
      if (url.searchParams.get("realsdk") === "1") return html;
      const stripped = html.replace(/<script[^>]*crazygames-sdk-v3\.js[^>]*><\/script>\s*/i, "");
      return {
        html: stripped,
        tags: [{ tag: "script", attrs: { src: "/__dev/mock-crazygames-sdk.js" }, injectTo: "head-prepend" }],
      };
    },
  };
}

export default defineConfig({
  // CG-TECH-005: relative paths only. A default Vite build emits "/assets/..."
  // which fails to load from CrazyGames' game-files host. Never change to "/".
  base: "./",
  plugins: [devMockSdk()],
  publicDir: "public",
  build: {
    target: "es2022",
    sourcemap: false,            // .map files are dead weight in the size budget
    assetsInlineLimit: 4096,
    reportCompressedSize: true,
    chunkSizeWarningLimit: 1200,
    rolldownOptions: {
      output: {
        entryFileNames: "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
      },
    },
  },
  // 127.0.0.1/localhost are the SDK's "local" environment (docs /sdk/intro).
  // PORT lets the desktop app's preview pick a free port when several games run at once.
  server: { host: "127.0.0.1", port: Number(process.env.PORT) || 5173 },
  preview: { host: "127.0.0.1", port: 4173 },
});
