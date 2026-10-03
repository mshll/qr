# QR

Free QR code generator at [qr.mshl.me](https://qr.mshl.me). No account, no watermark, codes never expire. Everything is generated in the browser.

## Stack

React Router v8 (SPA with prerendered routes) on [Vite+](https://viteplus.dev), Tailwind v4, shadcn on Base UI, [`@liquid-js/qr-code-styling`](https://github.com/Liquid-JS/qr-code-styling) for rendering and [`zxing-wasm`](https://github.com/Sec-ant/zxing-wasm) for the live scan check. Hosted as static assets on Cloudflare Workers.

## Develop

```sh
pnpm install
pnpm dev        # vp dev
pnpm check      # format, lint, types
pnpm test       # vp test
```

## Build and deploy

```sh
pnpm build      # react-router build + scripts/postbuild.ts
pnpm deploy     # cf deploy --prebuilt
```

`scripts/postbuild.ts` writes the 404 page, `sitemap.xml`, `llms.txt`, the Workbox service worker and the Cloudflare Build Output in `.cloudflare/output` that `cf deploy --prebuilt` uploads.

`vp build` hangs after finishing with this setup, so `build` calls `react-router build` directly.
