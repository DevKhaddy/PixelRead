import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import screenshotRouter from "../routes/screenshot.js";

const app = express();
const PORT = process.env.PORT || 8787;

app.use(cors({ origin: process.env.ALLOWED_ORIGIN || "*" }));
app.use(express.json({ limit: "1mb" }));

// Capture is expensive (spins up headless Chromium) — keep it modest.
const limiter = rateLimit({ windowMs: 60_000, max: 20 });
app.use("/api", limiter, screenshotRouter);

app.get("/health", (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`readmeshot-backend listening on :${PORT}`);
});
