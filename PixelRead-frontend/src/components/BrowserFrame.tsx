import type { ReactNode } from "react";
import type { Browser, Device } from "../lib/types";

interface BrowserFrameProps {
  browser: Browser;
  device: Device;
  dark: boolean;
  url: string;
  showToolbar: boolean;
  children: ReactNode;
  scanning?: boolean;
}

export default function BrowserFrame({
  browser,
  device,
  dark,
  url,
  showToolbar,
  children,
  scanning = false,
}: BrowserFrameProps) {
  const radius = browser === "none" ? 0 : device === "mobile" ? 26 : 10;

  return (
    <div
      className="relative overflow-hidden"
      style={{
        borderRadius: radius,
        border: browser === "none" ? "none" : "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 1px 0 rgba(255,255,255,0.06) inset",
        width: "100%",
        background: dark ? "#0d1117" : "#ffffff",
      }}
    >
      {showToolbar && browser !== "none" && (
        <div
          className="flex items-center gap-2 px-3 h-9"
          style={{
            background: dark ? "#161b22" : "#f2f2f2",
            borderBottom: dark ? "1px solid #262c38" : "1px solid #e2e2e2",
          }}
        >
          {browser === "chrome" && (
            <>
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#ff5f57" }} />
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#febc2e" }} />
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#28c840" }} />
              </div>
              <div
                className="flex-1 mx-3 rounded-md px-3 py-1 text-[11px] truncate rs-mono"
                style={{ background: dark ? "#0d1117" : "#fff", color: dark ? "#8891A3" : "#666", border: dark ? "1px solid #262c38" : "1px solid #ddd" }}
              >
                {url || "example.com"}
              </div>
            </>
          )}
          {browser === "safari" && (
            <>
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#ff5f57" }} />
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#febc2e" }} />
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#28c840" }} />
              </div>
              <div className="flex-1 flex justify-center">
                <div
                  className="rounded-md px-4 py-1 text-[11px] truncate rs-mono max-w-[220px]"
                  style={{ background: dark ? "#0d1117" : "#eee", color: dark ? "#8891A3" : "#666" }}
                >
                  🔒 {url || "example.com"}
                </div>
              </div>
              <div className="w-8" />
            </>
          )}
          {browser === "edge" && (
            <>
              <div className="w-4 h-4 rounded-full" style={{ background: "linear-gradient(135deg,#0ea5e9,#22c55e)" }} />
              <div
                className="flex-1 mx-3 rounded-full px-3 py-1 text-[11px] truncate rs-mono"
                style={{ background: dark ? "#0d1117" : "#fff", color: dark ? "#8891A3" : "#666", border: dark ? "1px solid #262c38" : "1px solid #ddd" }}
              >
                {url || "example.com"}
              </div>
              <div className="flex gap-2 text-[10px]" style={{ color: dark ? "#8891A3" : "#888" }}>●●●</div>
            </>
          )}
        </div>
      )}
      <div className="relative">
        {children}
        {scanning && <div className="rs-scan absolute inset-0" />}
      </div>
    </div>
  );
}
