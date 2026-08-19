import {
  Camera, Monitor, Smartphone, Download, Copy, Check, ChevronDown, Sun, Moon, Star, StarOff, Clock,
  Loader2, Menu, Settings2, Palette, Square, CornerDownRight, Layers, RefreshCw, Link2, Globe, Trash2,
  ArrowUpRight, Zap,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { BROWSERS, DEFAULT_SETTINGS, GRADIENTS, SIZES, SOLID_COLORS } from "../lib/constants";
import { SectionLabel, SegButton, Slider, ToggleRow } from "../components/controls";
import { classNames, hostnameOf, normalizeUrl, timeAgo } from "../lib/utils";
import type { CaptureResult, SavedCapture, Settings } from "../lib/types";
import { fetchScreenshot } from "../lib/api";
import { deleteCapture, loadCaptures, saveCapture, toggleFavorite } from "../lib/storage";
import PreviewStage from "../components/PreviewStage";
import Logo from "../components/Logo";

interface DashboardProps {
  onBack: () => void;
  pushToast: (msg: string, kind?: "default" | "success") => void;
}

/**
 * Canonical settings snapshot used to detect a stale preview. Both the capture
 * flow and the dirty check MUST build the key through here so they can never
 * drift apart (key order matters for JSON.stringify).
 */
function snapshotOf(s: Settings, u: string): string {
  return JSON.stringify({ ...s, url: normalizeUrl(u) });
}

interface ViewImage {
  url: string;
  imageUrl: string;
  width: number;
  height: number;
  markdown: string;
  /** Snapshot of the settings this image was captured with (used to detect stale previews). */
  settingsKey?: string;
}

function SavedRow({
  c,
  onView,
  onFav,
  onRemove,
}: {
  c: SavedCapture;
  onView: (c: SavedCapture) => void;
  onFav: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="flex items-center gap-3 py-2.5">
      <button onClick={() => onView(c)} className="flex items-center gap-3 flex-1 min-w-0 text-left group">
        <img
          src={c.imageUrl}
          alt=""
          className="w-12 h-8 object-cover rounded shrink-0"
          style={{ border: "1px solid var(--border)" }}
        />
        <div className="min-w-0">
          <div className="text-sm rs-mono truncate group-hover:text-[var(--gold)] transition-colors">{c.url}</div>
          <div className="text-[10px] mt-0.5" style={{ color: "var(--dim2)" }}>
            {c.width}×{c.height} · {timeAgo(c.createdAt)}
          </div>
        </div>
      </button>
      <button onClick={() => onFav(c.id)} className="rs-focus-ring w-7 h-7 grid place-items-center rounded-md hover:bg-white/5 shrink-0">
        {c.fav ? <Star size={14} style={{ color: "var(--gold)" }} fill="var(--gold)" /> : <StarOff size={14} style={{ color: "var(--dim2)" }} />}
      </button>
      <button onClick={() => onRemove(c.id)} className="rs-focus-ring w-7 h-7 grid place-items-center rounded-md hover:bg-white/5 shrink-0" title="Delete">
        <Trash2 size={13} style={{ color: "var(--dim2)" }} />
      </button>
    </div>
  );
}

export default function Dashboard({ onBack, pushToast }: DashboardProps) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [capturing, setCapturing] = useState(false);
  const [image, setImage] = useState<ViewImage | null>(null);
  const [saved, setSaved] = useState<SavedCapture[]>(() => loadCaptures());
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const urlInputRef = useRef<HTMLInputElement>(null);
  const autoTimer = useRef<number | null>(null);

  const update = (patch: Partial<Settings>) => setSettings((s) => ({ ...s, ...patch }));

  const capture = useCallback(async () => {
    const url = settings.url.trim();
    if (!url) {
      pushToast("Paste a URL first");
      urlInputRef.current?.focus();
      return;
    }
    setCapturing(true);
    try {
      const captured = { ...settings, url: normalizeUrl(url) };
      const result: CaptureResult = await fetchScreenshot(captured);
      setImage({
        url: normalizeUrl(url),
        imageUrl: result.url,
        width: result.width,
        height: result.height,
        markdown: result.markdown,
        settingsKey: snapshotOf(captured, url),
      });
      const clean = hostnameOf(url);
      const savedRes = saveCapture({
        url: clean,
        size: settings.size,
        width: result.width,
        height: result.height,
        imageUrl: result.url,
      });
      setSaved(savedRes.list);
      pushToast(savedRes.ok ? "Screenshot captured & saved" : "Captured, but couldn't save locally", "success");
    } catch (err) {
      pushToast(err instanceof Error ? err.message : "Capture failed");
    } finally {
      setCapturing(false);
    }
  }, [settings, pushToast]);

  const viewCapture = useCallback(
    (c: SavedCapture) => {
      // The snapshot must mirror exactly what update() patches below (url, size),
      // or the viewed capture would show up as falsely stale.
      const patched = { ...settings, url: c.url, size: c.size };
      setImage({
        url: c.url,
        imageUrl: c.imageUrl,
        width: c.width,
        height: c.height,
        markdown: `![${c.url}](${c.imageUrl})`,
        settingsKey: snapshotOf(patched, c.url),
      });
      update({ url: c.url, size: c.size });
    },
    [settings]
  );

  const removeCapture = useCallback((id: string) => {
    const removed = loadCaptures().find((c) => c.id === id);
    setSaved(deleteCapture(id));
    // Clear the preview only if the deleted capture is the one on screen.
    setImage((img) => (img && removed && removed.imageUrl === img.imageUrl ? null : img));
  }, []);

  const favCapture = useCallback((id: string) => {
    setSaved(toggleFavorite(id));
  }, []);

  const downloadPng = useCallback(async () => {
    if (!image) {
      pushToast("Capture a screenshot first");
      return;
    }
    try {
      const res = await fetch(image.imageUrl);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `${hostnameOf(settings.url) || "pixelread"}-${settings.size}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);
      pushToast("PNG download started", "success");
    } catch {
      pushToast("Download failed — try opening the image link");
    }
  }, [image, settings.url, settings.size, pushToast]);

  const copyMarkdown = useCallback(() => {
    if (!image) {
      pushToast("Capture a screenshot first");
      return;
    }
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(image.markdown).then(
        () => pushToast("Markdown copied to clipboard", "success"),
        () => pushToast("Could not copy markdown")
      );
    } else {
      pushToast("Clipboard not available");
    }
  }, [image, pushToast]);

  const copyLink = useCallback(() => {
    if (!image) {
      pushToast("Capture a screenshot first");
      return;
    }
    if (!image.imageUrl) {
      pushToast("No public link for this capture");
      return;
    }
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(image.imageUrl).then(
        () => pushToast("Image link copied", "success"),
        () => pushToast("Could not copy link")
      );
    } else {
      pushToast("Clipboard not available");
    }
  }, [image, pushToast]);

  // keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.key === "Enter") {
        e.preventDefault();
        void capture();
      } else if (meta && e.key.toLowerCase() === "d") {
        e.preventDefault();
        downloadPng();
      } else if (meta && e.key.toLowerCase() === "k") {
        e.preventDefault();
        urlInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [capture, downloadPng]);

  // auto-refresh
  useEffect(() => {
    if (autoRefresh && settings.url.trim()) {
      autoTimer.current = window.setInterval(() => void capture(), 6000);
    }
    return () => {
      if (autoTimer.current) window.clearInterval(autoTimer.current);
    };
  }, [autoRefresh, capture, settings.url]);

  // drag and drop URL
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const text = e.dataTransfer.getData("text/uri-list") || e.dataTransfer.getData("text/plain");
    if (text) {
      update({ url: text });
      pushToast("URL dropped in");
    }
  };

  const sizePreset = SIZES.find((s) => s.id === settings.size);
  const favorites = saved.filter((s) => s.fav);

  // A captured image goes stale as soon as any setting (or the URL) no longer
  // matches what produced it — so the side controls always have a visible effect.
  const currentKey = image ? snapshotOf(settings, settings.url) : "";
  const dirty = Boolean(image && image.settingsKey && image.settingsKey !== currentKey);

  return (
    <div
      className="min-h-screen flex flex-col relative"
      onDragOver={(e) => {
        e.preventDefault();
        // Only treat this as a URL/text drag (not e.g. image or file drags),
        // and never let the overlay get stuck over the whole app.
        const types = e.dataTransfer.types ?? [];
        if (types.includes("text/uri-list") || types.includes("text/plain")) {
          setDragOver(true);
        }
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setDragOver(false);
      }}
      onDrop={onDrop}
    >
      <div className="rs-noise" />

      {/* top bar */}
      <div
        className="h-14 flex items-center justify-between px-4 md:px-6 shrink-0"
        style={{ borderBottom: "1px solid var(--border-soft)" }}
      >
        <div className="flex items-center gap-3">
          <button
            className="md:hidden rs-focus-ring w-8 h-8 grid place-items-center rounded-lg"
            style={{ background: "var(--surface2)" }}
            onClick={() => setSidebarOpen((s) => !s)}
          >
            <Menu size={16} />
          </button>
          <button onClick={onBack} className="flex items-center gap-2 rs-focus-ring">
            <Logo />
            <span className="font-semibold text-sm rs-mono hidden sm:inline">PixelRead</span>
          </button>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-xs" style={{ color: "var(--dim2)" }}>
          <span className="flex items-center gap-1.5">
            <span className="rs-kbd">Ctrl</span>
            <span className="opacity-60">/</span>
            <span className="rs-kbd">⌘</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="rs-kbd">🔍 K</span> focus
          </span>
          <span className="flex items-center gap-1.5">
            <span className="rs-kbd">📸 ↵</span> capture
          </span>
          <span className="flex items-center gap-1.5">
            <span className="rs-kbd">⬇️ D</span> download
          </span>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        {dragOver && (
          <div
            className="absolute inset-0 z-30 grid place-items-center"
            style={{ background: "rgba(232,181,76,0.08)", border: "2px dashed var(--gold)" }}
          >
            <div className="rs-card px-6 py-4 text-sm flex items-center gap-2">
              <Link2 size={16} style={{ color: "var(--gold)" }} /> Drop URL to capture
            </div>
          </div>
        )}

        {/* SIDEBAR */}
        <aside
          className={classNames(
            "w-[320px] shrink-0 overflow-y-auto rs-scrollbar p-5 flex flex-col gap-7 absolute md:static inset-y-0 left-0 z-20 transition-transform duration-300",
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          )}
          style={{ background: "var(--surface)", borderRight: "1px solid var(--border-soft)" }}
        >
          {/* URL */}
          <div>
            <SectionLabel icon={Link2}>Target URL</SectionLabel>
            <div className="flex items-center gap-2 rs-input px-3 py-2.5 mb-2">
              <Link2 size={14} style={{ color: "var(--dim)" }} />
              <input
                ref={urlInputRef}
                value={settings.url}
                onChange={(e) => update({ url: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && capture()}
                placeholder="yourproject.dev"
                className="bg-transparent outline-none flex-1 text-sm rs-mono"
              />
            </div>
            <button
              onClick={() => void capture()}
              disabled={capturing}
              className="rs-btn-gold rs-focus-ring w-full py-2.5 rounded-lg text-sm inline-flex items-center justify-center gap-2"
            >
              {capturing ? <Loader2 size={15} className="animate-spin" /> : <Camera size={15} />}
              {capturing ? "Capturing…" : "Capture screenshot"}
            </button>
            <p className="text-[11px] mt-2 leading-relaxed" style={{ color: "var(--dim2)" }}>
              Tip: <span className="rs-kbd">Ctrl ↵</span> or <span className="rs-kbd">⌘ ↵</span> to capture instantly.
            </p>
            <label className="flex items-center gap-2 mt-2 text-xs cursor-pointer select-none" style={{ color: "var(--dim)" }}>
              <input type="checkbox" checked={autoRefresh} onChange={(e) => setAutoRefresh(e.target.checked)} className="accent-[#E8B54C]" />
              <RefreshCw size={12} /> Auto-refresh every 6s
            </label>
          </div>

          {/* Device / Browser */}
          <div>
            <SectionLabel icon={Monitor}>Device</SectionLabel>
            <div className="flex gap-2 mb-4">
              <SegButton active={settings.device === "desktop"} onClick={() => update({ device: "desktop" })}>
                <Monitor size={13} /> Desktop
              </SegButton>
              <SegButton active={settings.device === "mobile"} onClick={() => update({ device: "mobile" })}>
                <Smartphone size={13} /> Mobile
              </SegButton>
            </div>
            <SectionLabel icon={Globe}>Browser frame</SectionLabel>
            <div className="grid grid-cols-2 gap-2">
              {BROWSERS.map((b) => (
                <SegButton key={b.id} active={settings.browser === b.id} onClick={() => update({ browser: b.id })}>
                  {b.label}
                </SegButton>
              ))}
            </div>
          </div>

          {/* Theme */}
          <div>
            <SectionLabel icon={Sun}>Page theme</SectionLabel>
            <div className="flex gap-2">
              <SegButton active={!settings.darkMode} onClick={() => update({ darkMode: false })}>
                <Sun size={13} /> Light
              </SegButton>
              <SegButton active={settings.darkMode} onClick={() => update({ darkMode: true })}>
                <Moon size={13} /> Dark
              </SegButton>
            </div>
          </div>

          {/* Size */}
          <div>
            <SectionLabel icon={Square}>Image size</SectionLabel>
            <div className="relative">
              <select
                value={settings.size}
                onChange={(e) => update({ size: e.target.value as Settings["size"] })}
                className="rs-input rs-focus-ring w-full px-3 py-2.5 text-xs rs-mono appearance-none cursor-pointer"
              >
                {SIZES.map((s) => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--dim)" }} />
            </div>
          </div>

          {/* Background */}
          <div>
            <SectionLabel icon={Palette}>Background</SectionLabel>
            <div className="flex gap-2 mb-3">
              <SegButton active={settings.bgMode === "solid"} onClick={() => update({ bgMode: "solid" })}>Solid</SegButton>
              <SegButton active={settings.bgMode === "gradient"} onClick={() => update({ bgMode: "gradient" })}>Gradient</SegButton>
            </div>
            {settings.bgMode === "solid" ? (
              <div className="flex flex-wrap gap-2">
                {SOLID_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => update({ bgSolid: c })}
                    className="w-7 h-7 rounded-full rs-focus-ring"
                    style={{ background: c, border: settings.bgSolid === c ? "2px solid var(--gold)" : "1px solid var(--border)" }}
                    aria-label={c}
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {GRADIENTS.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => update({ bgGradient: g.id })}
                    className="h-10 rounded-lg rs-focus-ring relative overflow-hidden"
                    style={{ background: g.css, border: settings.bgGradient === g.id ? "2px solid var(--gold)" : "1px solid var(--border)" }}
                    title={g.label}
                  >
                    {settings.bgGradient === g.id && <Check size={13} className="absolute inset-0 m-auto" color="#fff" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Layout */}
          <div>
            <SectionLabel icon={Layers}>Layout</SectionLabel>
            <div className="flex flex-col gap-4">
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5" style={{ color: "var(--dim)" }}>Padding</div>
                <Slider value={settings.padding} min={0} max={120} onChange={(v) => update({ padding: v })} />
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-xs mb-1.5" style={{ color: "var(--dim)" }}>
                  <CornerDownRight size={11} /> Corner radius
                </div>
                <Slider value={settings.radius} min={0} max={40} onChange={(v) => update({ radius: v })} />
              </div>
              <div>
                <div className="text-xs mb-1.5" style={{ color: "var(--dim)" }}>Shadow intensity</div>
                <div className="grid grid-cols-4 gap-2">
                  {(["none", "sm", "md", "lg"] as const).map((s) => (
                    <SegButton key={s} active={settings.shadow === s} onClick={() => update({ shadow: s })}>{s}</SegButton>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Toggles */}
          <div>
            <SectionLabel icon={Settings2}>Frame options</SectionLabel>
            <div className="flex flex-col gap-2.5">
              <ToggleRow label="Device frame" checked={settings.deviceFrame} onChange={(v) => update({ deviceFrame: v })} />
              <ToggleRow label="Browser toolbar" checked={settings.showToolbar} onChange={(v) => update({ showToolbar: v })} />
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <main className="flex-1 overflow-y-auto rs-scrollbar p-5 md:p-8 flex flex-col gap-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="text-lg font-semibold flex items-center gap-2">
                Live preview
                {autoRefresh && (
                  <span className="text-[10px] rs-mono px-2 py-0.5 rounded-full" style={{ background: "var(--surface2)", color: "var(--teal)", border: "1px solid var(--border)" }}>
                    AUTO
                  </span>
                )}
              </h2>
              <p className="text-xs mt-0.5" style={{ color: "var(--dim2)" }}>
                {sizePreset?.label}
                {image
                  ? dirty
                    ? " · settings changed — capture again to apply"
                    : ` · captured ${image.width}×${image.height}`
                  : " · shows the real site as you type"}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={copyMarkdown}
                className="rs-focus-ring px-4 py-2 rounded-lg text-xs inline-flex items-center gap-2"
                style={{ background: "var(--surface2)", border: "1px solid var(--border)" }}
              >
                <Copy size={13} /> Copy markdown
              </button>
              <button onClick={downloadPng} className="rs-btn-gold rs-focus-ring px-4 py-2 rounded-lg text-xs inline-flex items-center gap-2">
                <Download size={13} /> Download PNG
              </button>
            </div>
          </div>

          {image ? (
            <div className="rs-card p-3 md:p-4 rs-pop">
              {dirty && (
                <div
                  className="flex items-center justify-between gap-3 mb-3 px-3 py-2 rounded-lg rs-pop"
                  style={{ background: "rgba(232,181,76,0.09)", border: "1px solid rgba(232,181,76,0.35)" }}
                >
                  <span className="text-xs flex items-center gap-2" style={{ color: "var(--gold-soft)" }}>
                    <Zap size={13} /> Settings changed — capture again to apply
                  </span>
                  <button
                    onClick={() => void capture()}
                    disabled={capturing}
                    className="rs-focus-ring px-3 py-1.5 rounded-lg text-[11px] font-medium shrink-0 inline-flex items-center gap-1.5"
                    style={{ background: "var(--gold)", color: "#1A1408" }}
                  >
                    {capturing ? <Loader2 size={11} className="animate-spin" /> : <Zap size={11} />}
                    {capturing ? "Capturing…" : "Re-capture"}
                  </button>
                </div>
              )}
              <img
                src={image.imageUrl}
                alt={`${hostnameOf(image.url)} screenshot`}
                className="w-full h-auto rounded-lg block transition-all duration-300"
                style={dirty ? { opacity: 0.45, filter: "grayscale(0.7)" } : undefined}
              />
              {image.imageUrl && (
                <div className="flex flex-col gap-3 mt-3 pt-3" style={{ borderTop: "1px solid var(--border-soft)" }}>
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-[10px] uppercase tracking-[0.14em] rs-mono" style={{ color: "var(--gold)" }}>
                      Public image link
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={copyLink}
                        className="rs-focus-ring px-3 py-1.5 rounded-lg text-[11px] inline-flex items-center gap-1.5"
                        style={{ background: "var(--surface2)", border: "1px solid var(--border)" }}
                      >
                        <Copy size={11} /> Copy link
                      </button>
                      <a
                        href={image.imageUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rs-focus-ring px-3 py-1.5 rounded-lg text-[11px] inline-flex items-center gap-1.5 hover:text-white transition-colors"
                        style={{ background: "var(--surface2)", border: "1px solid var(--border)", color: "var(--dim)" }}
                      >
                        Open <ArrowUpRight size={11} />
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 rs-input px-3 py-2">
                    <Link2 size={13} style={{ color: "var(--dim)" }} />
                    <span className="flex-1 text-xs rs-mono truncate" title={image.imageUrl}>
                      {image.imageUrl}
                    </span>
                  </div>
                  <div
                    className="flex items-center gap-2 rounded-lg px-3 py-2"
                    style={{ background: "var(--surface2)", border: "1px solid var(--border)" }}
                  >
                    <span className="flex-1 text-xs rs-mono truncate" style={{ color: "var(--dim2)" }} title={image.markdown}>
                      {image.markdown}
                    </span>
                    <button
                      onClick={copyMarkdown}
                      className="rs-focus-ring shrink-0 text-[11px] inline-flex items-center gap-1 hover:text-white transition-colors"
                      style={{ color: "var(--dim)" }}
                    >
                      <Copy size={11} /> Copy
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="rs-card p-4 md:p-8 rs-pop">
              <PreviewStage settings={settings} capturing={capturing} live />
            </div>
          )}

          {/* Saved captures / favorites */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="rs-card p-5">
              <SectionLabel icon={Clock}>Saved screenshots</SectionLabel>
              <div className="flex flex-col divide-y divide-[#242A38]">
                {saved.length === 0 && (
                  <p className="text-xs py-3" style={{ color: "var(--dim2)" }}>
                    Nothing saved yet — capture a URL and it lands here automatically.
                  </p>
                )}
                {saved.map((r) => (
                  <SavedRow key={r.id} c={r} onView={viewCapture} onFav={favCapture} onRemove={removeCapture} />
                ))}
              </div>
            </div>
            <div className="rs-card p-5">
              <SectionLabel icon={Star}>Favorites</SectionLabel>
              <div className="flex flex-col divide-y divide-[#242A38]">
                {favorites.length === 0 && (
                  <p className="text-xs py-3" style={{ color: "var(--dim2)" }}>Star a screenshot to keep it here.</p>
                )}
                {favorites.map((r) => (
                  <SavedRow key={r.id} c={r} onView={viewCapture} onFav={favCapture} onRemove={removeCapture} />
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
