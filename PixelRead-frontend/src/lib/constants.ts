import type { Browser, Settings, Shadow, SizeId } from "./types";

// In dev, the Vite proxy forwards /api/* to the backend, so an empty string
// (same-origin) works out of the box. In production, set VITE_API_URL to
// the deployed backend host, e.g. https://pixelread-api.onrender.com.
export const API_BASE: string = import.meta.env.VITE_API_URL ?? "";

export const GRADIENTS: { id: string; css: string; label: string }[] = [
  { id: "midnight", css: "linear-gradient(135deg,#1a1c2e 0%,#0a0d14 100%)", label: "Midnight" },
  { id: "gold-dusk", css: "linear-gradient(135deg,#3a2e12 0%,#0a0d14 60%)", label: "Gold Dusk" },
  { id: "aurora", css: "linear-gradient(135deg,#0f2027 0%,#203a43 50%,#2c5364 100%)", label: "Aurora" },
  { id: "sunset", css: "linear-gradient(135deg,#ff9a56 0%,#ff6a88 50%,#845ec2 100%)", label: "Sunset" },
  { id: "forest", css: "linear-gradient(135deg,#0f3d2e 0%,#0a0d14 100%)", label: "Forest" },
  { id: "candy", css: "linear-gradient(135deg,#a18cd1 0%,#fbc2eb 100%)", label: "Candy" },
];

export const SOLID_COLORS: string[] = [
  "#0A0D14",
  "#171C27",
  "#1B1030",
  "#0F2027",
  "#2B1B0E",
  "#F5F5F0",
  "#FFFFFF",
];

export const BROWSERS: { id: Browser; label: string }[] = [
  { id: "chrome", label: "Chrome" },
  { id: "safari", label: "Safari" },
  { id: "edge", label: "Edge" },
  { id: "none", label: "None" },
];

export const SIZES: { id: SizeId; label: string; w: number; h: number }[] = [
  { id: "og", label: "Social (1200×630)", w: 1200, h: 630 },
  { id: "readme", label: "README wide (1280×800)", w: 1280, h: 800 },
  { id: "square", label: "Square (1080×1080)", w: 1080, h: 1080 },
  { id: "mobile", label: "Mobile (390×844)", w: 390, h: 844 },
];

export const SHADOWS: Record<Shadow, string> = {
  none: "none",
  sm: "0 10px 30px -12px rgba(0,0,0,0.35)",
  md: "0 25px 60px -20px rgba(0,0,0,0.55)",
  lg: "0 40px 90px -20px rgba(0,0,0,0.75)",
};

export const DEFAULT_SETTINGS: Settings = {
  url: "",
  device: "desktop",
  browser: "chrome",
  darkMode: true,
  bgMode: "gradient",
  bgGradient: "gold-dusk",
  bgSolid: "#0A0D14",
  padding: 48,
  radius: 18,
  shadow: "lg",
  showToolbar: true,
  deviceFrame: true,
  size: "readme",
};
