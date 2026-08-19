import "dotenv/config";
import rateLimit from "express-rate-limit";
import express from "express";
import cors from "cors";

import screenshotRouter from "../routes/screenshot.js";
import { SHOTS_DIR } from "../services/store.js";
import { closeBrowser } from "../services/browser-pool.js";

const app = express();
const PORT = process.env.PORT || 8787;

app.use(cors({ origin: process.env.ALLOWED_ORIGIN || "*" }));
app.use(express.json({ limit: "1mb" }));

// Basic security headers.
app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

// Serve captured screenshots so markdown image links point somewhere real.
app.use("/shots", express.static(SHOTS_DIR, { maxAge: "1h", immutable: true }));

// Capture is expensive (spins up headless Chromium) — keep it modest.
const limiter = rateLimit({ windowMs: 60_000, max: 20 });
app.use("/api", limiter, screenshotRouter);

app.get("/health", (_req, res) => res.json({ ok: true }));

const server = app.listen(PORT, () => {
  console.log(`PixelRead backend listening on :${PORT}`);
});

// Gracefully shut down the shared Chromium browser on container stop.
for (const sig of ["SIGTERM", "SIGINT"]) {
  process.on(sig, async () => {
    console.log(`\n${sig} received — shutting down…`);
    server.close();
    await closeBrowser();
    process.exit(0);
  });
}
