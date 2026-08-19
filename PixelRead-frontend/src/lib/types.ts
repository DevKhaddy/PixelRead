export type Device = "desktop" | "mobile";
export type Browser = "chrome" | "safari" | "edge" | "none";
export type BgMode = "solid" | "gradient";
export type Shadow = "none" | "sm" | "md" | "lg";
export type SizeId = "og" | "readme" | "square" | "mobile";

export interface Settings {
  url: string;
  device: Device;
  browser: Browser;
  darkMode: boolean;
  bgMode: BgMode;
  bgGradient: string;
  bgSolid: string;
  padding: number;
  radius: number;
  shadow: Shadow;
  showToolbar: boolean;
  deviceFrame: boolean;
  size: SizeId;
}

export interface SavedCapture {
  id: string;
  url: string;
  size: SizeId;
  width: number;
  height: number;
  /** Public URL of the stored PNG — used for thumbnails, previews, and downloads. */
  imageUrl: string;
  fav: boolean;
  createdAt: number;
}

export type ToastKind = "default" | "success";

export interface Toast {
  id: string;
  msg: string;
  kind: ToastKind;
}

export interface CaptureResult {
  width: number;
  height: number;
  url: string;
  markdown: string;
}
