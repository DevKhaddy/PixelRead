# PixelRead — frontend

Landing page + dashboard for **PixelRead**, a tool that captures framed, themed website screenshots for READMEs and social cards.

Built with React 19, Vite, Tailwind CSS v4, and TypeScript.

## Setup

```bash
npm install
npm run dev    # http://localhost:5173
```

The Vite dev server proxies `/api/*` and `/shots/*` to the backend at `localhost:8787`, so no `.env` file is needed for local development — just run the backend alongside.

## Production

Set `VITE_API_URL` to your deployed backend host:

```bash
VITE_API_URL=https://your-api.example.com npm run build
```

The output in `dist/` is a static site — deploy to Vercel, Netlify, Cloudflare Pages, or any static host.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Typecheck + production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run oxlint |
