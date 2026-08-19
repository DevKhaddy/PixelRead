import { useEffect, useMemo, useState } from "react";
import type { Device } from "../lib/types";
import { hostnameOf, normalizeUrl } from "../lib/utils";

/**
 * Renders the page content inside the browser frame.
 * - When `live` is true and a URL is provided, shows the REAL site in an iframe
 *   for a short grace period. Most sites refuse to be framed (X-Frame-Options /
 *   CSP frame-ancestors), so after a few seconds we fall back to the styled mock
 *   — the preview should never sit on a blank or "Loading…" box.
 * - Otherwise shows a pretty placeholder mock.
 * - On `mobile` the canvas is a tall portrait screen (matches the 390×844
 *   mobile capture preset) with a mobile-flavored mock layout.
 */
export default function MockPageContent({
  dark,
  url,
  live = false,
  device = "desktop",
}: {
  dark: boolean;
  url: string;
  live?: boolean;
  device?: Device;
}) {
  const host = useMemo(() => hostnameOf(url), [url]);
  const src = useMemo(() => normalizeUrl(url), [url]);
  const isMobile = device === "mobile";
  const [loaded, setLoaded] = useState(false);
  const [timedOut, setTimedOut] = useState(false);

  // Reset whenever the target URL changes; typing again restarts the window.
  useEffect(() => {
    setLoaded(false);
    setTimedOut(false);
    const t = window.setTimeout(() => setTimedOut(true), 4000);
    return () => window.clearTimeout(t);
  }, [src]);

  const showLive = live && src && !timedOut;

  if (showLive) {
    return (
      <div
        className="w-full h-full relative"
        style={{ aspectRatio: isMobile ? "390/844" : "16/10", background: dark ? "#0d1117" : "#ffffff" }}
      >
        <iframe
          key={src}
          src={src}
          title={`Live preview of ${host}`}
          className="absolute inset-0 w-full h-full"
          style={{ border: "none", background: "#fff" }}
          onLoad={() => setLoaded(true)}
        />
        {!loaded && (
          <div
            className="absolute inset-0 grid place-items-center"
            style={{ background: dark ? "#0d1117" : "#f6f6f6", color: dark ? "#8891A3" : "#666" }}
          >
            <div className="text-center px-6">
              <div className="text-[11px] uppercase tracking-[0.2em] opacity-60 rs-mono mb-2">Loading live preview…</div>
              <div className="text-sm">This is the real site at {host}</div>
            </div>
          </div>
        )}
        <div
          className="absolute bottom-0 left-0 right-0 px-3 py-1 text-[10px] rs-mono"
          style={{
            background: dark ? "rgba(13,17,23,0.85)" : "rgba(255,255,255,0.85)",
            color: dark ? "#8891A3" : "#888",
            borderTop: "1px solid rgba(128,128,128,0.15)",
          }}
        >
          🔒 Live preview — most sites block embedding; we'll show a styled preview instead.
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full h-full flex flex-col relative"
      style={{ background: dark ? "#0d1117" : "#ffffff", color: dark ? "#e6edf3" : "#1a1a1a", aspectRatio: isMobile ? "390/844" : "16/10" }}
    >
      <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: dark ? "1px solid #21262d" : "1px solid #eee" }}>
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded-md shrink-0" style={{ background: "linear-gradient(135deg,#E8B54C,#F5D896)" }} />
          <span className="text-sm font-semibold rs-mono truncate">{host}</span>
        </div>
        {isMobile ? (
          // Hamburger menu instead of a desktop nav on phones
          <div className="flex flex-col gap-[3px] p-1" aria-hidden>
            <span className="w-4 h-[2px] rounded" style={{ background: dark ? "#8891A3" : "#666" }} />
            <span className="w-4 h-[2px] rounded" style={{ background: dark ? "#8891A3" : "#666" }} />
            <span className="w-4 h-[2px] rounded" style={{ background: dark ? "#8891A3" : "#666" }} />
          </div>
        ) : (
          <div className="flex gap-4 text-xs opacity-60">
            <span>Product</span>
            <span>Docs</span>
            <span>Pricing</span>
          </div>
        )}
      </div>
      <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
        <div className="text-[11px] uppercase tracking-[0.2em] opacity-50 rs-mono">Live capture</div>
        <div className={isMobile ? "text-lg leading-snug font-semibold max-w-[200px] rs-serif italic" : "text-2xl md:text-3xl font-semibold max-w-md rs-serif italic"}>
          A pixel-perfect snapshot of {host}
        </div>
        <div className="flex flex-col gap-2 mt-1 w-full max-w-[180px]">
          <div className="px-4 py-2 rounded-lg text-xs font-medium text-center" style={{ background: "#E8B54C", color: "#1A1408" }}>Get started</div>
          <div className="px-4 py-2 rounded-lg text-xs font-medium text-center border" style={{ borderColor: dark ? "#30363d" : "#ddd" }}>Learn more</div>
        </div>
      </div>
      {live && src && (
        <div
          className="absolute bottom-0 left-0 right-0 px-3 py-1 text-[10px] rs-mono"
          style={{
            background: dark ? "rgba(13,17,23,0.85)" : "rgba(255,255,255,0.85)",
            color: dark ? "#8891A3" : "#888",
            borderTop: "1px solid rgba(128,128,128,0.15)",
          }}
        >
          🔒 Live embed unavailable — showing styled preview (Capture still works)
        </div>
      )}
    </div>
  );
}
