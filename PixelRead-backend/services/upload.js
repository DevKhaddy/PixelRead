const IMGBB_URL = "https://api.imgbb.com/1/upload";

/**
 * Uploads a PNG buffer to ImgBB and returns its permanent public URL.
 *
 * Requires the `IMGBB_API_KEY` env var (free key from https://api.imgbb.com/).
 * Uses Node's built-in fetch/FormData/Blob — no extra dependencies.
 * Throws on failure so callers can fall back to local serving.
 *
 * @param {Buffer} buffer - PNG buffer to upload.
 * @returns {Promise<string>} Permanent public image URL.
 */
export async function uploadToImgbb(buffer) {
  const key = process.env.IMGBB_API_KEY;
  if (!key) throw new Error("IMGBB_API_KEY is not set");

  const form = new FormData();
  form.append("key", key);
  form.append("image", new Blob([buffer], { type: "image/png" }), "pixelread.png");

  const res = await fetch(IMGBB_URL, {
    method: "POST",
    body: form,
    signal: AbortSignal.timeout(30_000),
  });

  let json;
  try {
    json = await res.json();
  } catch {
    throw new Error(`imgbb returned non-JSON response (HTTP ${res.status})`);
  }

  if (!res.ok || !json?.success || !json?.data?.url) {
    throw new Error(`imgbb upload failed (HTTP ${res.status}): ${json?.error?.message || res.statusText || "unknown error"}`);
  }

  return json.data.url;
}
