import { devices } from "playwright";
import { getBrowser } from "./browser-pool.js";

/**
 * Captures a raw screenshot of a URL using the shared Chromium instance.
 *
 * A fresh browser context is created per request for full isolation, then
 * torn down immediately after the screenshot — the browser itself stays
 * alive for the next call.
 *
 * @param {Object} opts
 * @param {string} opts.url - Target URL (must be http/https).
 * @param {"desktop"|"mobile"} opts.device - Viewport preset.
 * @param {boolean} opts.darkMode - Emulate prefers-color-scheme: dark.
 * @param {number} [opts.width] - Custom viewport width (desktop only).
 * @param {number} [opts.height] - Custom viewport height (desktop only).
 * @returns {Promise<Buffer>} PNG buffer of the raw page capture.
 */
export async function captureScreenshot({
  url,
  device = "desktop",
  darkMode = true,
  width = 1440,
  height = 900,
}) {
  const browser = await getBrowser();
  const contextOptions = device === "mobile"
    ? { ...devices["iPhone 14 Pro"], colorScheme: darkMode ? "dark" : "light" }
    : {
        viewport: { width, height },
        deviceScaleFactor: 2,
        colorScheme: darkMode ? "dark" : "light",
      };

  const context = await browser.newContext(contextOptions);
  try {
    const page = await context.newPage();

    // `networkidle` never fires on sites with websockets/long-polling (e.g.
    // linear.app), so wait for the DOM, then give lazy content a settle window.
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 20_000 });

    // Prefer a bounded network-idle wait (fast on quiet sites); fall back to a
    // fixed settle so websocket-heavy sites don't hang the capture.
    try {
      await page.waitForLoadState("networkidle", { timeout: 4000 });
    } catch {
      await page.waitForTimeout(1500);
    }

    const buffer = await page.screenshot({ type: "png" });
    return buffer;
  } finally {
    await context.close();
  }
}
