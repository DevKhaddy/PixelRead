# 📸 PixelRead

> Generate beautiful screenshots for your GitHub README in seconds.

PixelRead is a developer tool that captures any public website and composites it into polished, presentation-ready screenshots with customizable browser frames, gradient backgrounds, shadows, and export options.

Built for developers who want beautiful documentation without opening a design tool.

---

## ✨ Features

- 🌐 Capture screenshots from any public website
- 🖥️ Desktop and mobile viewports
- 🌙 Light & Dark mode
- 🪟 Browser frames (Chrome, Safari, Edge)
- 🎨 Gradient backgrounds
- 📐 Adjustable padding and spacing
- 🔲 Rounded corners
- 🌫️ Drop shadow controls
- 📥 Download as PNG
- 📋 Copy Markdown image syntax
- ⚡ Fast, responsive interface
- 📱 Mobile-friendly

---

## 🚀 Live Demo

👉 **https://pixelread.vercel.app**

---

## 🛠 Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS v4 |
| Backend | Node.js, Express, Playwright, sharp |
| Deployment | Vercel (frontend), Docker (backend) |

---

## 📂 Project Structure

```
├── PixelRead-frontend/   # React SPA — landing page + dashboard
│   └── src/
│       ├── components/   # UI components (controls, preview, nav, etc.)
│       ├── views/        # Landing and Dashboard pages
│       └── lib/          # API client, types, constants, utils
├── PixelRead-backend/    # Screenshot capture API
│   ├── src/server.js     # Express entry point
│   ├── routes/           # API route handlers
│   ├── services/         # Browser pool, capture, compose, store, upload
│   └── Dockerfile        # Production container (Playwright + Chromium)
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js 18+
- npm

### Backend

```bash
cd PixelRead-backend
cp .env.example .env
npm install       # also installs Playwright + Chromium
npm run dev       # http://localhost:8787
```

### Frontend

```bash
cd PixelRead-frontend
npm install
npm run dev       # http://localhost:5173
```

The Vite dev server proxies `/api/*` and `/shots/*` to the backend at `localhost:8787`, so both servers need to be running locally.

### Environment Variables

**Backend** (`.env`):

| Variable | Default | Purpose |
|---|---|---|
| `PORT` | `8787` | HTTP port |
| `PUBLIC_BASE_URL` | `http://localhost:8787` | Public root for screenshot URLs — **required in production** |
| `ALLOWED_ORIGIN` | `*` | CORS origin for the frontend |
| `SHOT_TTL_MS` | `86400000` (24h) | How long PNGs stay on disk |
| `IMGBB_API_KEY` | *(unset)* | Optional — uploads captures to ImgBB for permanent URLs |

**Frontend** (`.env`, production only):

| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Deployed backend host (e.g. `https://pixelread-api.onrender.com`) |

---

## 🚢 Deployment

### Frontend

The frontend builds to a static `dist/` directory. Deploy to Vercel, Netlify, Cloudflare Pages, or any static host.

### Backend

Playwright requires Chromium's system libraries, so deploy via the provided **Dockerfile** (based on `mcr.microsoft.com/playwright:v1.62.1-noble`). Works on Railway, Fly.io, or Render. Serverless platforms (Vercel/Lambda) are **not** supported.

```bash
docker build -t pixelread-api .
docker run -p 8787:8787 -e PUBLIC_BASE_URL=https://your-api.example.com pixelread-api
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome.

If you'd like to improve PixelRead, feel free to open an issue or submit a pull request.

---

## 📄 License

MIT License

---

## 👩‍💻 Built by

**Khaddy (devKhaddy)**

🌐 Portfolio: https://devkhaddy.com

GitHub: https://github.com/devKhaddy

Building tiny tools developers love. 💜
