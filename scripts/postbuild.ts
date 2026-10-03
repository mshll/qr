import { cp, mkdir, readdir, rename, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { generateSW } from "workbox-build";

import { pages } from "../app/content/pages.ts";

const SITE_URL = "https://qr.mshl.me";
const CLIENT = "build/client";
const OUTPUT = ".cloudflare/output/v0";

const urlFor = (path: string) => `${SITE_URL}${path}`;

await rename(join(CLIENT, "__spa-fallback.html"), join(CLIENT, "404.html"));
await rm(join(CLIENT, ".vite"), { recursive: true, force: true });

const today = new Date().toISOString().slice(0, 10);
await writeFile(
  join(CLIENT, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) =>
      `  <url><loc>${urlFor(page.path)}</loc><lastmod>${today}</lastmod><priority>${page.path === "/" ? "1.0" : "0.8"}</priority></url>`,
  )
  .join("\n")}
</urlset>
`,
);

const [home, ...rest] = pages;
await writeFile(
  join(CLIENT, "llms.txt"),
  `# QR

> ${home.description}

QR codes are static and generated entirely in the browser: nothing is uploaded, codes never expire, and there is no account, watermark or scan limit. Exports: PNG (1024px), SVG, clipboard, native share.

## Generators

- [${home.h1}](${urlFor(home.path)}): ${home.lead}
${rest.map((page) => `- [${page.h1}](${urlFor(page.path)}): ${page.lead}`).join("\n")}
`,
);

const { count, size, warnings } = await generateSW({
  globDirectory: CLIENT,
  // HTML is network-first so a deploy shows up on the next visit; hashed assets are precached for offline use
  globPatterns: ["**/*.{js,css,wasm,svg,png,ico,woff2,webmanifest}"],
  globIgnores: [
    "og.png",
    "assets/inter-{cyrillic,cyrillic-ext,greek,greek-ext,latin-ext,vietnamese}-*",
  ],
  swDest: join(CLIENT, "sw.js"),
  runtimeCaching: [
    {
      urlPattern: ({ request }) => request.mode === "navigate",
      handler: "NetworkFirst",
      options: { cacheName: "pages", networkTimeoutSeconds: 3 },
    },
  ],
  dontCacheBustURLsMatching: /^assets\//,
  maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
  cleanupOutdatedCaches: true,
  clientsClaim: true,
  skipWaiting: true,
  inlineWorkboxRuntime: true,
});
for (const warning of warnings) console.warn(warning);
console.log(`Service worker precaches ${count} files (${(size / 1024).toFixed(0)} KiB)`);

// Cloudflare Build Output Specification, deployed with `cf deploy --prebuilt`
await rm(".cloudflare/output", { recursive: true, force: true });
await mkdir(join(OUTPUT, "workers/default"), { recursive: true });
await cp(CLIENT, join(OUTPUT, "workers/default/assets"), { recursive: true });
await writeFile(
  join(OUTPUT, "config.json"),
  JSON.stringify({ buildContext: { isPreview: false, mode: "production" } }),
);
await writeFile(
  join(OUTPUT, "workers/default/worker.config.json"),
  JSON.stringify({
    name: "qr",
    compatibilityDate: "2026-09-25",
    domains: ["qr.mshl.me"],
    assets: { htmlHandling: "drop-trailing-slash", notFoundHandling: "404-page" },
  }),
);
console.log(
  `Build output: ${(await readdir(join(OUTPUT, "workers/default/assets"))).length} top-level assets`,
);
