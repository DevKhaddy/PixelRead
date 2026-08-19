import { mkdir, readdir, stat, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const SHOTS_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "shots");

/** Keep screenshots on disk for this long before sweeping them. */
const TTL_MS = Number(process.env.SHOT_TTL_MS || 24 * 60 * 60 * 1000);

/**
 * Writes a composed screenshot PNG to the shots directory.
 * @param {Buffer} buffer - PNG buffer.
 * @returns {Promise<string>} The file name (e.g. "1723...-a1b2c3.png").
 */
export async function saveShot(buffer) {
  await mkdir(SHOTS_DIR, { recursive: true });
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  await writeFile(path.join(SHOTS_DIR, `${id}.png`), buffer);
  void cleanupOldShots(); // fire-and-forget sweep
  return `${id}.png`;
}

/** Deletes screenshot files older than TTL_MS. Safe to call on every save. */
export async function cleanupOldShots() {
  try {
    const files = await readdir(SHOTS_DIR);
    const now = Date.now();
    for (const f of files) {
      if (!f.endsWith(".png")) continue;
      const p = path.join(SHOTS_DIR, f);
      try {
        const { mtimeMs } = await stat(p);
        if (now - mtimeMs > TTL_MS) await unlink(p);
      } catch {
        // File vanished or is locked — skip.
      }
    }
  } catch {
    // Directory doesn't exist yet — nothing to clean.
  }
}
