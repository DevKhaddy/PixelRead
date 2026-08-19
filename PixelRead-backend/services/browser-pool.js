import { chromium } from "playwright";

let browserPromise = null;

/**
 * Returns a shared Chromium browser instance, launching one lazily on first
 * call.  Subsequent calls return the same (already-running) instance.
 *
 * If the browser crashes or is otherwise disconnected, the next call will
 * transparently relaunch it.
 */
export async function getBrowser() {
  // If we already have a live browser, return it immediately.
  if (browserPromise) {
    const b = await browserPromise;
    if (b.isConnected()) return b;
    // Stale — fall through and relaunch.
    browserPromise = null;
  }

  browserPromise = chromium.launch({ headless: true });
  return browserPromise;
}

/**
 * Gracefully close the shared browser.  Safe to call multiple times.
 */
export async function closeBrowser() {
  if (!browserPromise) return;
  const p = browserPromise;
  browserPromise = null;
  try {
    const b = await p;
    if (b.isConnected()) await b.close();
  } catch {
    // Already dead — nothing to do.
  }
}
