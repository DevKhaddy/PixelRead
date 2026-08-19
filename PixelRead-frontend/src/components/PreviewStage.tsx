import { useMemo } from "react";
import type { Settings } from "../lib/types";
import { GRADIENTS, SHADOWS } from "../lib/constants";
import BrowserFrame from "./BrowserFrame";
import MockPageContent from "./MockPageContent";

interface PreviewStageProps {
  settings: Settings;
  capturing?: boolean;
  live?: boolean;
}

export default function PreviewStage({ settings, capturing = false, live = false }: PreviewStageProps) {
  const {
    url,
    device,
    browser,
    darkMode,
    bgMode,
    bgSolid,
    bgGradient,
    padding,
    radius,
    shadow,
    showToolbar,
    deviceFrame,
  } = settings;

  const bg = useMemo(
    () => (bgMode === "gradient" ? GRADIENTS.find((g) => g.id === bgGradient)?.css : bgSolid),
    [bgMode, bgGradient, bgSolid]
  );

  const isMobile = device === "mobile";

  return (
    <div
      className="w-full rounded-2xl flex items-center justify-center relative overflow-hidden transition-all duration-300"
      style={{ background: bg, padding: `${padding}px` }}
    >
      <div
        className="relative transition-all duration-300"
        style={{
          width: isMobile ? "36%" : "100%",
          maxWidth: isMobile ? 280 : "100%",
          // The phone frame defines its own corners + shadow; the desktop case
          // clips the stage to the configured corner radius. Keep the shadow on
          // the wrapper when mobile is shown without the phone bezel.
          ...(isMobile
            ? deviceFrame
              ? {}
              : { boxShadow: SHADOWS[shadow] }
            : { borderRadius: radius, boxShadow: SHADOWS[shadow], overflow: "hidden" }),
        }}
      >
        {deviceFrame && isMobile ? (
          <div className="rounded-[44px] p-[10px]" style={{ background: "#0b0b0e", boxShadow: SHADOWS[shadow] }}>
            <div
              className="rounded-[32px] overflow-hidden relative"
              style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.08) inset, 0 0 0 2px rgba(0,0,0,0.6)" }}
            >
              {/* Dynamic island */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-[18px] rounded-full bg-black z-20" />
              <BrowserFrame browser={browser} device={device} dark={darkMode} url={url} showToolbar={showToolbar} scanning={capturing}>
                <MockPageContent dark={darkMode} url={url} live={live} device={device} />
              </BrowserFrame>
              {/* Home indicator */}
              <div
                className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-20 h-1 rounded-full z-20"
                style={{ background: "rgba(0,0,0,0.35)" }}
              />
            </div>
          </div>
        ) : (
          <BrowserFrame browser={browser} device={device} dark={darkMode} url={url} showToolbar={showToolbar} scanning={capturing}>
            <MockPageContent dark={darkMode} url={url} live={live} device={device} />
          </BrowserFrame>
        )}
      </div>
    </div>
  );
}
