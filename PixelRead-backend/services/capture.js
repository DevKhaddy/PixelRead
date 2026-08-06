import { chromium, devices } from "playwright";

/**
 * Captures a raw screenshot of a URL using headless Chromium.
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
  const browser = await chromium.launch({ headless: true });

  try {
    const contextOptions = device === "mobile"
      ? { ...devices["iPhone 14 Pro"], colorScheme: darkMode ? "dark" : "light" }
      : {
          viewport: { width, height },
          deviceScaleFactor: 2,
          colorScheme: darkMode ? "dark" : "light",
        };

    const context = await browser.newContext(contextOptions);
    const page = await context.newPage();

    // Reasonable timeout + wait for network to settle so SPA content renders.
    await page.goto(url, { waitUntil: "networkidle", timeout: 20_000 });

    // Give lazy-loaded content / fonts a brief moment to settle.
    await page.waitForTimeout(400);

    const buffer = await page.screenshot({ type: "png" });
    await context.close();
    return buffer;
  } finally {
    await browser.close();
  }
}
