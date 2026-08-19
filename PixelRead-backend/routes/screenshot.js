import { Router } from "express";
import { z } from "zod";
import { captureScreenshot } from "../services/capture.js";
import { composeImage } from "../services/compose.js";
import { saveShot } from "../services/store.js";
import { uploadToImgbb } from "../services/upload.js";

const router = Router();

const RequestSchema = z.object({
  url: z.string().url(),
  device: z.enum(["desktop", "mobile"]).default("desktop"),
  browser: z.enum(["chrome", "safari", "edge", "none"]).default("chrome"),
  darkMode: z.boolean().default(true),
  bgMode: z.enum(["solid", "gradient"]).default("gradient"),
  bgSolid: z.string().default("#0A0D14"),
  bgGradient: z.string().default("gold-dusk"),
  padding: z.number().min(0).max(160).default(48),
  radius: z.number().min(0).max(60).default(18),
  shadow: z.enum(["none", "sm", "md", "lg"]).default("lg"),
  showToolbar: z.boolean().default(true),
  size: z.enum(["og", "readme", "square", "mobile"]).default("readme"),
});

// Where the public image URLs are rooted. Override in production with
// PUBLIC_BASE_URL=https://shots.example.com (or your deployed API host).
const PUBLIC_BASE = (process.env.PUBLIC_BASE_URL || "http://localhost:8787").replace(/\/$/, "");

const SIZE_MAP = {
  og: { w: 1200, h: 630 },
  readme: { w: 1280, h: 800 },
  square: { w: 1080, h: 1080 },
  mobile: { w: 390, h: 844 },
};

// POST /api/screenshot -> { width, height, url, markdown }
router.post("/screenshot", async (req, res) => {
  const parsed = RequestSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "invalid_request", details: parsed.error.flatten() });
  }
  const input = parsed.data;

  try {
    const raw = await captureScreenshot({
      url: input.url,
      device: input.device,
      darkMode: input.darkMode,
    });

    const { w, h } = SIZE_MAP[input.size];
    const composed = await composeImage(raw, {
      ...input,
      outWidth: w,
      outHeight: h,
      srcUrl: new URL(input.url).hostname,
    });

    const hostname = new URL(input.url).hostname;
    const fileName = await saveShot(composed);

    // Prefer a permanent public URL (ImgBB) when an API key is configured;
    // otherwise fall back to the locally served /shots/<file>.png link.
    let url = `${PUBLIC_BASE}/shots/${fileName}`;
    if (process.env.IMGBB_API_KEY) {
      try {
        url = await uploadToImgbb(composed);
      } catch (err) {
        console.error("imgbb upload failed, falling back to local link:", err.message);
      }
    }

    res.json({
      width: w,
      height: h,
      url,
      markdown: `![${hostname}](${url})`,
    });
  } catch (err) {
    console.error("capture failed:", err.message);
    res.status(502).json({ error: "capture_failed", message: "Could not load or capture that URL." });
  }
});

export default router;
