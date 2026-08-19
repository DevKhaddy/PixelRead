import { API_BASE } from "./constants";
import type { CaptureResult, Settings } from "./types";

export async function fetchScreenshot(settings: Settings): Promise<CaptureResult> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), 60_000);

  try {
    const res = await fetch(`${API_BASE}/api/screenshot`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
      signal: controller.signal,
    });

    if (!res.ok) {
      let message = `Capture failed (${res.status})`;
      try {
        const body = (await res.json()) as { message?: string };
        if (body?.message) message = body.message;
      } catch {
        // Non-JSON error body — keep the generic message.
      }
      throw new Error(message);
    }

    return (await res.json()) as CaptureResult;
  } finally {
    window.clearTimeout(timer);
  }
}
