# READMEShot — capture backend

Real screenshot capture service for the READMEShot frontend. Uses **Playwright** (headless Chromium) to load a page and **sharp** to composite it into a framed, backgrounded, sized PNG.

## Setup

```bash
npm install          # also runs `playwright install --with-deps chromium`
npm run dev           # http://localhost:8787
```

## API

`POST /api/screenshot`

```json
{
  "url": "https://stripe.com",
  "device": "desktop",
  "browser": "chrome",
  "darkMode": true,
  "bgMode": "gradient",
  "bgGradient": "gold-dusk",
  "padding": 48,
  "radius": 18,
  "shadow": "lg",
  "showToolbar": true,
  "size": "readme"
}
```

Response:

```json
{
  "pngBase64": "...",
  "width": 1280,
  "height": 800,
  "markdown": "![stripe.com](https://your-cdn.example.com/shots/....png)"
}
```

The frontend (`READMEShot.jsx`) currently mocks this call for the in-browser demo. To wire up real captures, replace the `capture()` function in the dashboard with a `fetch("/api/screenshot", { method: "POST", body: JSON.stringify(settings) })` call, decode `pngBase64` into a data URL for the `<img>` preview, and upload the PNG to storage (S3, R2, etc.) before generating a permanent markdown link — the sample response above returns a placeholder CDN URL.

## Notes

- `services/capture.js` — launches Chromium, sets viewport/device/color-scheme, screenshots the raw page.
- `services/compose.js` — draws the browser toolbar, rounds corners, and composites onto the background canvas with padding + drop shadow, entirely with `sharp` + inline SVG (no native canvas dependency).
- Rate limited to 20 captures/minute per instance by default — tune in `src/server.js`.
- Deploy target needs Chromium's system deps (`playwright install --with-deps`); Docker or a platform like Fly.io/Render works well. Serverless (Lambda/Vercel) needs `@sparticuz/chromium` instead of the full Playwright browser download.
