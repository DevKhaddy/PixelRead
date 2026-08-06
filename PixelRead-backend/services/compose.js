import sharp from "sharp";

const GRADIENTS = {
  midnight: ["#1a1c2e", "#0a0d14"],
  "gold-dusk": ["#3a2e12", "#0a0d14"],
  aurora: ["#0f2027", "#2c5364"],
  sunset: ["#ff9a56", "#845ec2"],
  forest: ["#0f3d2e", "#0a0d14"],
  candy: ["#a18cd1", "#fbc2eb"],
};

const SHADOW_BLUR = { none: 0, sm: 30, md: 55, lg: 85 };

/**
 * Wraps a raw page screenshot with rounded corners + a browser toolbar SVG.
 */
async function applyFrame(rawBuffer, { browser, showToolbar, radius, srcUrl }) {
  const img = sharp(rawBuffer);
  const meta = await img.metadata();
  const toolbarHeight = showToolbar && browser !== "none" ? 46 : 0;

  const toolbarSvg =
    toolbarHeight > 0
      ? `<rect width="${meta.width}" height="${toolbarHeight}" fill="#161b22"/>
         <circle cx="26" cy="${toolbarHeight / 2}" r="6" fill="#ff5f57"/>
         <circle cx="46" cy="${toolbarHeight / 2}" r="6" fill="#febc2e"/>
         <circle cx="66" cy="${toolbarHeight / 2}" r="6" fill="#28c840"/>
         <rect x="90" y="${toolbarHeight / 2 - 12}" width="${Math.min(meta.width - 180, 500)}" height="24" rx="6" fill="#0d1117"/>
         <text x="102" y="${toolbarHeight / 2 + 5}" font-family="monospace" font-size="13" fill="#8891A3">${srcUrl}</text>`
      : "";

  const framed = sharp({
    create: {
      width: meta.width,
      height: meta.height + toolbarHeight,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      { input: Buffer.from(`<svg width="${meta.width}" height="${toolbarHeight}">${toolbarSvg}</svg>`), top: 0, left: 0 },
      { input: rawBuffer, top: toolbarHeight, left: 0 },
    ])
    .png();

  // Rounded-corner mask
  const { width: fw, height: fh } = await framed.metadata();
  const mask = Buffer.from(
    `<svg width="${fw}" height="${fh}"><rect x="0" y="0" width="${fw}" height="${fh}" rx="${radius}" ry="${radius}" fill="#fff"/></svg>`
  );

  return framed.composite([{ input: mask, blend: "dest-in" }]).png().toBuffer();
}

/**
 * Composites the framed screenshot onto a background canvas with padding + shadow.
 */
export async function composeImage(rawBuffer, settings) {
  const {
    browser = "chrome",
    showToolbar = true,
    radius = 18,
    padding = 48,
    shadow = "lg",
    bgMode = "gradient",
    bgSolid = "#0A0D14",
    bgGradient = "gold-dusk",
    outWidth = 1280,
    outHeight = 800,
    srcUrl = "",
  } = settings;

  const framed = await applyFrame(rawBuffer, { browser, showToolbar, radius, srcUrl });
  const meta = await sharp(framed).metadata();

  // Scale the framed screenshot to fit within the canvas minus padding.
  const targetW = outWidth - padding * 2;
  const targetH = outHeight - padding * 2;
  const scale = Math.min(targetW / meta.width, targetH / meta.height, 1);
  const resized = await sharp(framed)
    .resize(Math.round(meta.width * scale), Math.round(meta.height * scale))
    .toBuffer();
  const rMeta = await sharp(resized).metadata();

  // Background
  let bgSvg;
  if (bgMode === "gradient") {
    const [c1, c2] = GRADIENTS[bgGradient] || GRADIENTS["gold-dusk"];
    bgSvg = `<svg width="${outWidth}" height="${outHeight}">
      <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${c1}"/><stop offset="100%" stop-color="${c2}"/>
      </linearGradient></defs>
      <rect width="100%" height="100%" fill="url(#g)"/>
    </svg>`;
  } else {
    bgSvg = `<svg width="${outWidth}" height="${outHeight}"><rect width="100%" height="100%" fill="${bgSolid}"/></svg>`;
  }

  const left = Math.round((outWidth - rMeta.width) / 2);
  const top = Math.round((outHeight - rMeta.height) / 2);

  const blur = SHADOW_BLUR[shadow] ?? 55;
  const shadowSvg =
    blur > 0
      ? `<svg width="${outWidth}" height="${outHeight}">
          <defs><filter id="s" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="${blur * 0.3}" stdDeviation="${blur / 2}" flood-color="#000" flood-opacity="0.55"/>
          </filter></defs>
          <rect x="${left}" y="${top}" width="${rMeta.width}" height="${rMeta.height}" rx="${radius}" fill="#000" filter="url(#s)"/>
        </svg>`
      : null;

  const layers = [{ input: Buffer.from(bgSvg), top: 0, left: 0 }];
  if (shadowSvg) layers.push({ input: Buffer.from(shadowSvg), top: 0, left: 0 });
  layers.push({ input: resized, top, left });

  return sharp({
    create: { width: outWidth, height: outHeight, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite(layers)
    .png()
    .toBuffer();
}
