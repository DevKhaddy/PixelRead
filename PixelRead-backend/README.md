# PixelRead — capture backend

Real screenshot capture service for the PixelRead frontend. Uses **Playwright** (headless Chromium) to load a page and **sharp** to composite it into a framed, backgrounded, sized PNG. Captured PNGs are saved to `shots/` and served over HTTP so markdown image links point somewhere real.

## Setup

```bash
npm install          # also runs `playwright install --with-deps chromium`
npm run dev          # http://localhost:8787
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
  "width": 1280,
  "height": 800,
  "url": "http://localhost:8787/shots/1723...-a1b2c3.png",
  "markdown": "![stripe.com](http://localhost:8787/shots/1723...-a1b2c3.png)"
}
```

- `GET /shots/<file>.png` — serves the saved screenshot (the `url`/`markdown` links above).
- `GET /health` — liveness check.

## Configuration (env vars)

| Variable | Default | Purpose |
| --- | --- | --- |
| `PORT` | `8787` | HTTP port |
| `PUBLIC_BASE_URL` | `http://localhost:8787` | Public root used in `url`/`markdown` links — **must be set in production** to your deployed host |
| `ALLOWED_ORIGIN` | `*` | CORS origin for the frontend |
| `SHOT_TTL_MS` | `86400000` (24h) | How long captured PNGs stay on disk before cleanup |
| `IMGBB_API_KEY` | *(unset)* | Free key from [ImgBB](https://api.imgbb.com/) — when set, captures are uploaded and the markdown link is a **permanent public URL** (`i.ibb.co`), no server needed 24/7 |

## Deployment

Playwright needs Chromium's system libraries, so deploy the provided **Dockerfile** (based on the official `mcr.microsoft.com/playwright:v1.62.1-noble` image) rather than a bare Node runtime. Platforms like **Railway**, **Fly.io**, or **Render** (paid) all work; serverless (Vercel/Lambda) is **not** supported without swapping to `@sparticuz/chromium`.

1. Build/push the Docker image, or connect the repo to a container platform using the `Dockerfile`.
2. Set env vars on the platform:
   - `PUBLIC_BASE_URL=https://your-api.example.com` — required so markdown links are public
   - `ALLOWED_ORIGIN=https://your-frontend.example.com` (optional)
3. Point the frontend at it: `VITE_API_URL=https://your-api.example.com` (see `PixelRead-frontend/.env.example`).

Example Railway quick deploy:

```bash
railway init
railway add  # Dockerfile is auto-detected
railway variables set PUBLIC_BASE_URL=https://<your-service>.up.railway.app
railway up
```

## Notes

- `services/browser-pool.js` — lazily launches a shared Chromium instance and reuses it across requests. The browser is relaunched automatically if it crashes.
- `services/capture.js` — creates a fresh browser context per request for isolation, navigates to the URL, and takes a screenshot.
- `services/compose.js` — draws the browser toolbar, rounds corners, and composites onto the background canvas with padding + drop shadow, entirely with `sharp` + inline SVG.
- `services/store.js` — writes composed PNGs to `shots/` and sweeps files older than `SHOT_TTL_MS`.
- `services/upload.js` — optional ImgBB upload for permanent public image URLs.
- Rate limited to 20 captures/minute per instance by default — tune in `src/server.js`.
- Security headers (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`) are set on all responses.
- If the Playwright version in `package.json` changes, update the `FROM` image tag in `Dockerfile` to match, or the preinstalled browser won't be found.
