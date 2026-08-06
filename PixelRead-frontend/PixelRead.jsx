import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  Camera, Monitor, Smartphone, Chrome, Download, Copy, Check, ChevronDown,
  Sun, Moon, Sparkles, Github, ArrowRight, Star, StarOff, Clock, Command,
  Loader2, X, Menu, Settings2, Palette, Square, CornerDownRight, Layers,
  Zap, RefreshCw, Link2, ImageIcon, MousePointerClick, Plus, ArrowUpRight,
} from "lucide-react";

/* ============================================================
   READMEShot — design tokens
   bg #0A0D14 · surface #10141D · surface2 #171C27 · border #262C3A
   text #F1F3F7 · dim #8891A3 · gold #E8B54C · gold soft #F5D896
   teal accent #4FD1C5 (success / links)
   Display: Instrument Serif · Body: Inter · Mono: JetBrains Mono
   ============================================================ */

const FONT_IMPORT = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

:root{
  --bg:#0A0D14; --surface:#10141D; --surface2:#171C27; --surface3:#1D2330;
  --border:#242A38; --border-soft:#1A1F2B;
  --text:#F1F3F7; --dim:#8891A3; --dim2:#5B6376;
  --gold:#E8B54C; --gold-soft:#F5D896; --gold-dim:#8A6E33;
  --teal:#4FD1C5;
  --danger:#F1707A;
  --radius:14px;
}
.rs-root{
  background:var(--bg); color:var(--text);
  font-family:'Inter',ui-sans-serif,system-ui,sans-serif;
  -webkit-font-smoothing:antialiased;
}
.rs-serif{ font-family:'Instrument Serif', Georgia, serif; }
.rs-mono{ font-family:'JetBrains Mono', ui-monospace, monospace; }

.rs-noise{
  position:absolute; inset:0; pointer-events:none; opacity:0.035; mix-blend-mode:overlay;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

.rs-grid-bg{
  background-image:
    linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255,255,255,0.035) 1px, transparent 1px);
  background-size: 44px 44px;
  -webkit-mask-image: radial-gradient(ellipse 70% 55% at 50% 0%, black 40%, transparent 100%);
  mask-image: radial-gradient(ellipse 70% 55% at 50% 0%, black 40%, transparent 100%);
}

.rs-glow{
  background: radial-gradient(circle, rgba(232,181,76,0.16) 0%, rgba(232,181,76,0) 65%);
}

.rs-btn-gold{
  background: linear-gradient(180deg, var(--gold-soft), var(--gold));
  color:#1A1408; font-weight:600;
  box-shadow: 0 1px 0 rgba(255,255,255,0.4) inset, 0 8px 24px -8px rgba(232,181,76,0.55);
  transition: transform .15s ease, box-shadow .15s ease, filter .15s ease;
}
.rs-btn-gold:hover{ filter:brightness(1.05); transform:translateY(-1px); box-shadow:0 1px 0 rgba(255,255,255,0.4) inset, 0 12px 28px -8px rgba(232,181,76,0.65); }
.rs-btn-gold:active{ transform:translateY(0); }

.rs-card{
  background: var(--surface);
  border:1px solid var(--border-soft);
  border-radius: var(--radius);
}
.rs-card-hover{ transition: border-color .2s ease, transform .2s ease, box-shadow .2s ease; }
.rs-card-hover:hover{ border-color:#3A3320; transform:translateY(-2px); box-shadow:0 20px 40px -24px rgba(0,0,0,0.6); }

.rs-input{
  background: var(--surface2); border:1px solid var(--border); color:var(--text);
  border-radius:10px; transition: border-color .15s ease, box-shadow .15s ease;
}
.rs-input:focus{ outline:none; border-color:var(--gold-dim); box-shadow:0 0 0 3px rgba(232,181,76,0.14); }

.rs-scan::after{
  content:''; position:absolute; left:0; right:0; height:40%; top:-40%;
  background:linear-gradient(180deg, rgba(232,181,76,0) 0%, rgba(232,181,76,0.22) 50%, rgba(232,181,76,0) 100%);
  animation: rs-scan-move 1.6s ease-in-out infinite;
}
@keyframes rs-scan-move{
  0%{ top:-40%; } 100%{ top:100%; }
}

.rs-blink{ animation: rs-blink 1.1s steps(2,start) infinite; }
@keyframes rs-blink{ to{ visibility:hidden; } }

.rs-fade-up{ animation: rs-fade-up .6s cubic-bezier(.16,1,.3,1) both; }
@keyframes rs-fade-up{ from{ opacity:0; transform:translateY(14px); } to{ opacity:1; transform:translateY(0); } }

.rs-pop{ animation: rs-pop .35s cubic-bezier(.34,1.56,.64,1) both; }
@keyframes rs-pop{ from{ opacity:0; transform:scale(.92); } to{ opacity:1; transform:scale(1); } }

.rs-toast-in{ animation: rs-toast-in .3s cubic-bezier(.16,1,.3,1) both; }
@keyframes rs-toast-in{ from{ opacity:0; transform:translateY(10px) scale(.98); } to{ opacity:1; transform:translateY(0) scale(1); } }

.rs-spin-slow{ animation: spin 6s linear infinite; }

.rs-focus-ring:focus-visible{ outline:2px solid var(--gold); outline-offset:2px; border-radius:8px; }

.rs-scrollbar::-webkit-scrollbar{ width:8px; height:8px; }
.rs-scrollbar::-webkit-scrollbar-track{ background:transparent; }
.rs-scrollbar::-webkit-scrollbar-thumb{ background:#242A38; border-radius:8px; }
.rs-scrollbar::-webkit-scrollbar-thumb:hover{ background:#333B4F; }

.rs-kbd{
  font-family:'JetBrains Mono',monospace; font-size:11px; padding:2px 6px;
  background:var(--surface3); border:1px solid var(--border); border-radius:6px; color:var(--dim);
}

@media (prefers-reduced-motion: reduce){
  .rs-scan::after, .rs-blink, .rs-fade-up, .rs-pop, .rs-toast-in, .rs-spin-slow{ animation:none !important; }
}
`;

/* ---------------- helpers ---------------- */

const GRADIENTS = [
  { id: "midnight", css: "linear-gradient(135deg,#1a1c2e 0%,#0a0d14 100%)", label: "Midnight" },
  { id: "gold-dusk", css: "linear-gradient(135deg,#3a2e12 0%,#0a0d14 60%)", label: "Gold Dusk" },
  { id: "aurora", css: "linear-gradient(135deg,#0f2027 0%,#203a43 50%,#2c5364 100%)", label: "Aurora" },
  { id: "sunset", css: "linear-gradient(135deg,#ff9a56 0%,#ff6a88 50%,#845ec2 100%)", label: "Sunset" },
  { id: "forest", css: "linear-gradient(135deg,#0f3d2e 0%,#0a0d14 100%)", label: "Forest" },
  { id: "candy", css: "linear-gradient(135deg,#a18cd1 0%,#fbc2eb 100%)", label: "Candy" },
];

const SOLID_COLORS = ["#0A0D14", "#171C27", "#1B1030", "#0F2027", "#2B1B0E", "#F5F5F0", "#FFFFFF"];

const BROWSERS = [
  { id: "chrome", label: "Chrome" },
  { id: "safari", label: "Safari" },
  { id: "edge", label: "Edge" },
  { id: "none", label: "None" },
];

const SIZES = [
  { id: "og", label: "Social (1200×630)", w: 1200, h: 630 },
  { id: "readme", label: "README wide (1280×800)", w: 1280, h: 800 },
  { id: "square", label: "Square (1080×1080)", w: 1080, h: 1080 },
  { id: "mobile", label: "Mobile (390×844)", w: 390, h: 844 },
];

const uid = () => Math.random().toString(36).slice(2, 10);

function classNames(...xs) { return xs.filter(Boolean).join(" "); }

function normalizeUrl(raw) {
  if (!raw) return "";
  let v = raw.trim();
  if (!/^https?:\/\//i.test(v)) v = "https://" + v;
  return v;
}

/* ---------------- Browser chrome preview ---------------- */

function BrowserFrame({ browser, device, dark, url, showToolbar, children, scanning }) {
  const isMobile = device === "mobile";
  const radius = browser === "none" ? 0 : isMobile ? 26 : 10;

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
          className={classNames(
            "flex items-center gap-2 px-3",
            isMobile ? "h-9" : "h-9"
          )}
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

/* ---------------- Mock captured "screenshot" content ---------------- */

function MockPageContent({ dark, url }) {
  const host = useMemo(() => {
    try { return new URL(normalizeUrl(url || "example.com")).hostname; } catch { return "example.com"; }
  }, [url]);

  return (
    <div
      className="w-full h-full flex flex-col"
      style={{ background: dark ? "#0d1117" : "#ffffff", color: dark ? "#e6edf3" : "#1a1a1a", aspectRatio: "16/10" }}
    >
      <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: dark ? "1px solid #21262d" : "1px solid #eee" }}>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md" style={{ background: "linear-gradient(135deg,#E8B54C,#F5D896)" }} />
          <span className="text-sm font-semibold rs-mono">{host}</span>
        </div>
        <div className="flex gap-4 text-xs opacity-60">
          <span>Product</span><span>Docs</span><span>Pricing</span>
        </div>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center gap-4 px-8 text-center">
        <div className="text-[11px] uppercase tracking-[0.2em] opacity-50 rs-mono">Live capture</div>
        <div className="text-2xl md:text-3xl font-semibold max-w-md rs-serif italic">
          A pixel-perfect snapshot of {host}
        </div>
        <div className="flex gap-3 mt-2">
          <div className="px-4 py-2 rounded-lg text-xs font-medium" style={{ background: "#E8B54C", color: "#1A1408" }}>Get started</div>
          <div className="px-4 py-2 rounded-lg text-xs font-medium border" style={{ borderColor: dark ? "#30363d" : "#ddd" }}>Learn more</div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Preview canvas (applies all customization) ---------------- */

function PreviewStage({ settings, capturing, showFrame = true }) {
  const {
    url, device, browser, darkMode, bgMode, bgSolid, bgGradient,
    padding, radius, shadow, showToolbar, deviceFrame,
  } = settings;

  const bg =
    bgMode === "gradient"
      ? GRADIENTS.find((g) => g.id === bgGradient)?.css
      : bgSolid;

  const shadowMap = { none: "none", sm: "0 10px 30px -12px rgba(0,0,0,0.35)", md: "0 25px 60px -20px rgba(0,0,0,0.55)", lg: "0 40px 90px -20px rgba(0,0,0,0.75)" };

  return (
    <div
      className="w-full rounded-2xl flex items-center justify-center relative overflow-hidden transition-all duration-300"
      style={{ background: bg, padding: `${padding}px` }}
    >
      <div
        className="relative transition-all duration-300"
        style={{
          width: device === "mobile" ? "38%" : "100%",
          maxWidth: device === "mobile" ? 260 : "100%",
          borderRadius: radius,
          boxShadow: shadowMap[shadow],
          overflow: "hidden",
        }}
      >
        {deviceFrame && device === "mobile" ? (
          <div className="rounded-[36px] p-3" style={{ background: "#0b0b0e", boxShadow: shadowMap[shadow] }}>
            <div className="rounded-[26px] overflow-hidden relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-4 bg-black rounded-b-xl z-10" />
              <BrowserFrame browser={browser} device={device} dark={darkMode} url={url} showToolbar={showToolbar} scanning={capturing}>
                <MockPageContent dark={darkMode} url={url} />
              </BrowserFrame>
            </div>
          </div>
        ) : (
          <BrowserFrame browser={browser} device={device} dark={darkMode} url={url} showToolbar={showToolbar} scanning={capturing}>
            <MockPageContent dark={darkMode} url={url} />
          </BrowserFrame>
        )}
      </div>
    </div>
  );
}

/* ---------------- Toasts ---------------- */

function useToasts() {
  const [toasts, setToasts] = useState([]);
  const push = useCallback((msg, kind = "default") => {
    const id = uid();
    setToasts((t) => [...t, { id, msg, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);
  return { toasts, push };
}

function ToastStack({ toasts }) {
  return (
    <div className="fixed bottom-5 right-5 z-[999] flex flex-col gap-2 items-end">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="rs-toast-in rs-card flex items-center gap-2 px-4 py-3 text-sm shadow-2xl"
          style={{ borderColor: t.kind === "success" ? "#2f4a35" : "var(--border-soft)" }}
        >
          {t.kind === "success" ? <Check size={15} style={{ color: "var(--teal)" }} /> : <Sparkles size={15} style={{ color: "var(--gold)" }} />}
          <span>{t.msg}</span>
        </div>
      ))}
    </div>
  );
}

/* ================================================================
   LANDING PAGE
   ================================================================ */

function Landing({ onLaunch }) {
  const [demoUrl, setDemoUrl] = useState("stripe.com");
  const [demoDark, setDemoDark] = useState(true);
  const [demoBrowser, setDemoBrowser] = useState("chrome");
  const [capturing, setCapturing] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const runDemo = () => {
    setCapturing(true);
    setTimeout(() => setCapturing(false), 1400);
  };

  const demoSettings = {
    url: demoUrl, device: "desktop", browser: demoBrowser, darkMode: demoDark,
    bgMode: "gradient", bgGradient: "gold-dusk", bgSolid: "#0A0D14",
    padding: 48, radius: 18, shadow: "lg", showToolbar: true, deviceFrame: true,
  };

  const features = [
    { icon: Monitor, title: "Desktop & mobile", desc: "Capture both viewports in one pass, sized exactly for a README or social card." },
    { icon: Chrome, title: "Browser frames", desc: "Wrap captures in Chrome, Safari or Edge chrome — or ship them bare." },
    { icon: Palette, title: "Backgrounds & gradients", desc: "Solid colors, curated gradients, padding, corner radius and shadow depth." },
    { icon: Sun, title: "Light & dark", desc: "Render the target site in either theme, independent of its own default." },
    { icon: ImageIcon, title: "Sized for the job", desc: "Social card, README banner, square, or mobile — pick a preset or go custom." },
    { icon: Command, title: "Built for keyboards", desc: "Capture, download and copy markdown without leaving the home row." },
  ];

  const faqs = [
    { q: "Do I need to install anything?", a: "No. Paste a URL, customize the frame, and download the PNG. The capture runs on our backend using a headless browser." },
    { q: "Can I use this for private or local URLs?", a: "Public URLs only for now — the capture service needs to reach the page over the internet." },
    { q: "What size should I use for a README?", a: "The README wide preset (1280×800) reads well at GitHub's default content width. Social (1200×630) is tuned for Open Graph cards." },
    { q: "Is there a markdown copy option?", a: "Yes — every capture generates ready-to-paste ![alt](url) markdown sized to match your image." },
    { q: "Can I keep past captures?", a: "Recent captures are kept in your dashboard automatically, and you can star any of them to keep as a favorite." },
  ];

  return (
    <div className="rs-root min-h-screen relative">
      <div className="rs-noise" />
      <Nav onLaunch={onLaunch} />

      {/* HERO */}
      <section className="relative px-6 pt-28 pb-24 md:pt-36 md:pb-32">
        <div className="rs-grid-bg absolute inset-x-0 top-0 h-[640px]" />
        <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[900px] h-[500px] rs-glow" />
        <div className="max-w-5xl mx-auto text-center relative rs-fade-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs rs-mono mb-7" style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--dim)" }}>
            <Sparkles size={13} style={{ color: "var(--gold)" }} />
            for developers shipping READMEs
          </div>
          <h1 className="rs-serif italic text-5xl md:text-7xl leading-[1.05] mb-6">
            Screenshots that make your <span style={{ color: "var(--gold)" }}>README</span> look shipped.
          </h1>
          <p className="text-lg max-w-xl mx-auto mb-9" style={{ color: "var(--dim)" }}>
            Paste a URL. Get a framed, themed, perfectly sized capture — ready to drop straight into markdown.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <button onClick={onLaunch} className="rs-btn-gold rs-focus-ring px-6 py-3 rounded-xl text-sm inline-flex items-center gap-2">
              Open the dashboard <ArrowRight size={16} />
            </button>
            <a href="#demo" className="rs-focus-ring px-6 py-3 rounded-xl text-sm inline-flex items-center gap-2" style={{ border: "1px solid var(--border)", color: "var(--text)" }}>
              See it work <MousePointerClick size={15} />
            </a>
          </div>
        </div>
      </section>

      {/* LIVE DEMO */}
      <section id="demo" className="px-6 pb-28">
        <div className="max-w-5xl mx-auto rs-card p-5 md:p-8 rs-fade-up" style={{ animationDelay: "80ms" }}>
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] mb-1 rs-mono" style={{ color: "var(--gold)" }}>Live demo</div>
              <h3 className="text-xl font-semibold">Try a real capture, right here</h3>
            </div>
            <div className="flex items-center gap-2">
              {BROWSERS.filter((b) => b.id !== "none").map((b) => (
                <button
                  key={b.id}
                  onClick={() => setDemoBrowser(b.id)}
                  className={classNames("rs-focus-ring px-3 py-1.5 rounded-lg text-xs transition-colors", demoBrowser === b.id ? "text-black" : "")}
                  style={demoBrowser === b.id ? { background: "var(--gold)" } : { background: "var(--surface2)", color: "var(--dim)", border: "1px solid var(--border)" }}
                >
                  {b.label}
                </button>
              ))}
              <button onClick={() => setDemoDark((d) => !d)} className="rs-focus-ring w-8 h-8 rounded-lg grid place-items-center" style={{ background: "var(--surface2)", border: "1px solid var(--border)" }}>
                {demoDark ? <Moon size={14} /> : <Sun size={14} />}
              </button>
            </div>
          </div>

          <div className="flex gap-2 mb-6">
            <div className="flex-1 flex items-center gap-2 rs-input px-3 py-2.5">
              <Link2 size={15} style={{ color: "var(--dim)" }} />
              <input
                value={demoUrl}
                onChange={(e) => setDemoUrl(e.target.value)}
                placeholder="paste a url…"
                className="bg-transparent outline-none flex-1 text-sm rs-mono"
              />
            </div>
            <button onClick={runDemo} className="rs-btn-gold rs-focus-ring px-5 rounded-lg text-sm inline-flex items-center gap-2">
              {capturing ? <Loader2 size={15} className="animate-spin" /> : <Camera size={15} />}
              Capture
            </button>
          </div>

          <PreviewStage settings={demoSettings} capturing={capturing} />
        </div>
      </section>

      {/* FEATURE CARDS */}
      <section className="px-6 pb-28">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10 max-w-lg">
            <div className="text-xs uppercase tracking-[0.2em] mb-2 rs-mono" style={{ color: "var(--gold)" }}>Everything included</div>
            <h2 className="text-3xl font-semibold">Not just a screenshot tool</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <div key={f.title} className="rs-card rs-card-hover p-6 rs-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="w-9 h-9 rounded-lg grid place-items-center mb-4" style={{ background: "var(--surface2)", border: "1px solid var(--border)" }}>
                  <f.icon size={16} style={{ color: "var(--gold)" }} />
                </div>
                <h4 className="font-semibold mb-1.5">{f.title}</h4>
                <p className="text-sm leading-relaxed" style={{ color: "var(--dim)" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 pb-28">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10">
            <div className="text-xs uppercase tracking-[0.2em] mb-2 rs-mono" style={{ color: "var(--gold)" }}>Questions</div>
            <h2 className="text-3xl font-semibold">Frequently asked</h2>
          </div>
          <div className="flex flex-col gap-2">
            {faqs.map((f, i) => (
              <div key={f.q} className="rs-card overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                  className="rs-focus-ring w-full flex items-center justify-between px-5 py-4 text-left text-sm font-medium"
                >
                  {f.q}
                  <ChevronDown size={16} className="transition-transform duration-200" style={{ color: "var(--dim)", transform: openFaq === i ? "rotate(180deg)" : "none" }} />
                </button>
                <div className="grid transition-all duration-300" style={{ gridTemplateRows: openFaq === i ? "1fr" : "0fr" }}>
                  <div className="overflow-hidden">
                    <p className="px-5 pb-4 text-sm leading-relaxed" style={{ color: "var(--dim)" }}>{f.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer onLaunch={onLaunch} />
    </div>
  );
}

function Nav({ onLaunch }) {
  return (
    <nav className="sticky top-0 z-40 backdrop-blur-md" style={{ background: "rgba(10,13,20,0.7)", borderBottom: "1px solid var(--border-soft)" }}>
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md grid place-items-center" style={{ background: "linear-gradient(135deg,#F5D896,#E8B54C)" }}>
            <Camera size={14} color="#1A1408" />
          </div>
          <span className="font-semibold text-sm rs-mono">READMEShot</span>
        </div>
        <div className="hidden md:flex items-center gap-7 text-sm" style={{ color: "var(--dim)" }}>
          <a href="#demo" className="hover:text-white transition-colors">Demo</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          <a href="#" className="hover:text-white transition-colors inline-flex items-center gap-1"><Github size={14} /> GitHub</a>
        </div>
        <button onClick={onLaunch} className="rs-btn-gold rs-focus-ring px-4 py-2 rounded-lg text-xs">
          Open dashboard
        </button>
      </div>
    </nav>
  );
}

function Footer({ onLaunch }) {
  return (
    <footer className="px-6 py-12" style={{ borderTop: "1px solid var(--border-soft)" }}>
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-md grid place-items-center" style={{ background: "linear-gradient(135deg,#F5D896,#E8B54C)" }}>
              <Camera size={12} color="#1A1408" />
            </div>
            <span className="font-semibold text-sm rs-mono">READMEShot</span>
          </div>
          <p className="text-xs" style={{ color: "var(--dim2)" }}>Screenshots, framed for open source. Built by devKhaddy.</p>
        </div>
        <div className="flex gap-8 text-xs" style={{ color: "var(--dim)" }}>
          <a href="#demo" className="hover:text-white transition-colors">Demo</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          <button onClick={onLaunch} className="hover:text-white transition-colors">Dashboard</button>
        </div>
      </div>
    </footer>
  );
}

/* ================================================================
   DASHBOARD
   ================================================================ */

const DEFAULT_SETTINGS = {
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

function SectionLabel({ icon: Icon, children }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <Icon size={13} style={{ color: "var(--gold)" }} />
      <span className="text-[11px] uppercase tracking-[0.14em] font-medium" style={{ color: "var(--dim)" }}>{children}</span>
    </div>
  );
}

function SegButton({ active, onClick, children, className }) {
  return (
    <button
      onClick={onClick}
      className={classNames("rs-focus-ring flex-1 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors inline-flex items-center justify-center gap-1.5", className)}
      style={active ? { background: "var(--gold)", color: "#1A1408" } : { background: "var(--surface2)", color: "var(--dim)", border: "1px solid var(--border)" }}
    >
      {children}
    </button>
  );
}

function Slider({ value, min, max, onChange, suffix = "px" }) {
  return (
    <div className="flex items-center gap-3">
      <input
        type="range" min={min} max={max} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 accent-[#E8B54C]"
        style={{ accentColor: "var(--gold)" }}
      />
      <span className="rs-mono text-xs w-12 text-right" style={{ color: "var(--dim)" }}>{value}{suffix}</span>
    </div>
  );
}

function Dashboard({ onBack, toasts, pushToast }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [capturing, setCapturing] = useState(false);
  const [hasCapture, setHasCapture] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [recents, setRecents] = useState([
    { id: uid(), url: "vercel.com", fav: true },
    { id: uid(), url: "linear.app", fav: false },
    { id: uid(), url: "raycast.com", fav: true },
  ]);
  const [dragOver, setDragOver] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const urlInputRef = useRef(null);
  const autoTimer = useRef(null);

  const update = (patch) => setSettings((s) => ({ ...s, ...patch }));

  const capture = useCallback(() => {
    if (!settings.url.trim()) {
      pushToast("Paste a URL first");
      urlInputRef.current?.focus();
      return;
    }
    setCapturing(true);
    setTimeout(() => {
      setCapturing(false);
      setHasCapture(true);
      setRecents((r) => {
        const clean = normalizeUrl(settings.url).replace(/^https?:\/\//, "");
        const exists = r.find((x) => x.url === clean);
        if (exists) return r;
        return [{ id: uid(), url: clean, fav: false }, ...r].slice(0, 6);
      });
      pushToast("Screenshot captured", "success");
    }, 1200);
  }, [settings.url, pushToast]);

  const downloadPng = () => {
    if (!hasCapture) { pushToast("Capture a screenshot first"); return; }
    pushToast("PNG download started", "success");
  };

  const copyMarkdown = () => {
    if (!hasCapture) { pushToast("Capture a screenshot first"); return; }
    const alt = (() => { try { return new URL(normalizeUrl(settings.url)).hostname; } catch { return "screenshot"; } })();
    const md = `![${alt}](https://readmeshot.dev/s/${uid()}.png)`;
    navigator.clipboard?.writeText?.(md).catch(() => {});
    pushToast("Markdown copied to clipboard", "success");
  };

  const toggleFav = (id) => setRecents((r) => r.map((x) => (x.id === id ? { ...x, fav: !x.fav } : x)));

  // keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.key === "Enter") { e.preventDefault(); capture(); }
      else if (meta && e.key.toLowerCase() === "d") { e.preventDefault(); downloadPng(); }
      else if (meta && e.key.toLowerCase() === "c" && document.activeElement !== urlInputRef.current) { /* let native copy work in inputs */ }
      else if (meta && e.key.toLowerCase() === "k") { e.preventDefault(); urlInputRef.current?.focus(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [capture]);

  // auto-refresh
  useEffect(() => {
    if (autoRefresh && settings.url.trim()) {
      autoTimer.current = setInterval(() => capture(), 6000);
    }
    return () => clearInterval(autoTimer.current);
  }, [autoRefresh, settings.url, capture]);

  // drag and drop URL
  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const text = e.dataTransfer.getData("text/uri-list") || e.dataTransfer.getData("text/plain");
    if (text) {
      update({ url: text });
      pushToast("URL dropped in");
    }
  };

  const sizePreset = SIZES.find((s) => s.id === settings.size);

  return (
    <div className="rs-root min-h-screen flex flex-col" onDragOver={(e) => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={onDrop}>
      <div className="rs-noise" />
      {/* top bar */}
      <div className="h-14 flex items-center justify-between px-4 md:px-6 shrink-0" style={{ borderBottom: "1px solid var(--border-soft)" }}>
        <div className="flex items-center gap-3">
          <button className="md:hidden rs-focus-ring w-8 h-8 grid place-items-center rounded-lg" style={{ background: "var(--surface2)" }} onClick={() => setSidebarOpen((s) => !s)}>
            <Menu size={16} />
          </button>
          <button onClick={onBack} className="flex items-center gap-2 rs-focus-ring">
            <div className="w-6 h-6 rounded-md grid place-items-center" style={{ background: "linear-gradient(135deg,#F5D896,#E8B54C)" }}>
              <Camera size={12} color="#1A1408" />
            </div>
            <span className="font-semibold text-sm rs-mono hidden sm:inline">READMEShot</span>
          </button>
        </div>
        <div className="flex items-center gap-2 text-xs" style={{ color: "var(--dim2)" }}>
          <span className="rs-kbd">⌘K</span> focus
          <span className="rs-kbd ml-2">⌘↵</span> capture
          <span className="rs-kbd ml-2">⌘D</span> download
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        {dragOver && (
          <div className="absolute inset-0 z-30 grid place-items-center" style={{ background: "rgba(232,181,76,0.08)", border: "2px dashed var(--gold)" }}>
            <div className="rs-card px-6 py-4 text-sm flex items-center gap-2"><Link2 size={16} style={{ color: "var(--gold)" }} /> Drop URL to capture</div>
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
            <button onClick={capture} disabled={capturing} className="rs-btn-gold rs-focus-ring w-full py-2.5 rounded-lg text-sm inline-flex items-center justify-center gap-2">
              {capturing ? <Loader2 size={15} className="animate-spin" /> : <Camera size={15} />}
              {capturing ? "Capturing…" : "Capture screenshot"}
            </button>
            <label className="flex items-center gap-2 mt-3 text-xs cursor-pointer select-none" style={{ color: "var(--dim)" }}>
              <input type="checkbox" checked={autoRefresh} onChange={(e) => setAutoRefresh(e.target.checked)} className="accent-[#E8B54C]" />
              <RefreshCw size={12} /> Auto-refresh every 6s
            </label>
          </div>

          {/* Device / Browser */}
          <div>
            <SectionLabel icon={Monitor}>Device</SectionLabel>
            <div className="flex gap-2 mb-4">
              <SegButton active={settings.device === "desktop"} onClick={() => update({ device: "desktop" })}><Monitor size={13} /> Desktop</SegButton>
              <SegButton active={settings.device === "mobile"} onClick={() => update({ device: "mobile" })}><Smartphone size={13} /> Mobile</SegButton>
            </div>
            <SectionLabel icon={Chrome}>Browser frame</SectionLabel>
            <div className="grid grid-cols-2 gap-2">
              {BROWSERS.map((b) => (
                <SegButton key={b.id} active={settings.browser === b.id} onClick={() => update({ browser: b.id })}>{b.label}</SegButton>
              ))}
            </div>
          </div>

          {/* Theme */}
          <div>
            <SectionLabel icon={Sun}>Page theme</SectionLabel>
            <div className="flex gap-2">
              <SegButton active={!settings.darkMode} onClick={() => update({ darkMode: false })}><Sun size={13} /> Light</SegButton>
              <SegButton active={settings.darkMode} onClick={() => update({ darkMode: true })}><Moon size={13} /> Dark</SegButton>
            </div>
          </div>

          {/* Size */}
          <div>
            <SectionLabel icon={Square}>Image size</SectionLabel>
            <div className="relative">
              <select
                value={settings.size}
                onChange={(e) => update({ size: e.target.value })}
                className="rs-input rs-focus-ring w-full px-3 py-2.5 text-xs rs-mono appearance-none cursor-pointer"
              >
                {SIZES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
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
                <div className="flex items-center gap-1.5 text-xs mb-1.5" style={{ color: "var(--dim)" }}><CornerDownRight size={11} /> Corner radius</div>
                <Slider value={settings.radius} min={0} max={40} onChange={(v) => update({ radius: v })} />
              </div>
              <div>
                <div className="text-xs mb-1.5" style={{ color: "var(--dim)" }}>Shadow intensity</div>
                <div className="grid grid-cols-4 gap-2">
                  {["none", "sm", "md", "lg"].map((s) => (
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
                {autoRefresh && <span className="text-[10px] rs-mono px-2 py-0.5 rounded-full" style={{ background: "var(--surface2)", color: "var(--teal)", border: "1px solid var(--border)" }}>AUTO</span>}
              </h2>
              <p className="text-xs mt-0.5" style={{ color: "var(--dim2)" }}>{sizePreset.label} · updates as you customize</p>
            </div>
            <div className="flex gap-2">
              <button onClick={copyMarkdown} className="rs-focus-ring px-4 py-2 rounded-lg text-xs inline-flex items-center gap-2" style={{ background: "var(--surface2)", border: "1px solid var(--border)" }}>
                <Copy size={13} /> Copy markdown
              </button>
              <button onClick={downloadPng} className="rs-btn-gold rs-focus-ring px-4 py-2 rounded-lg text-xs inline-flex items-center gap-2">
                <Download size={13} /> Download PNG
              </button>
            </div>
          </div>

          <div className="rs-card p-4 md:p-8 rs-pop" key={JSON.stringify(settings)}>
            <PreviewStage settings={settings} capturing={capturing} />
          </div>

          {/* Recents / favorites */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="rs-card p-5">
              <SectionLabel icon={Clock}>Recent screenshots</SectionLabel>
              <div className="flex flex-col divide-y" style={{ borderColor: "var(--border-soft)" }}>
                {recents.length === 0 && <p className="text-xs py-3" style={{ color: "var(--dim2)" }}>Nothing captured yet.</p>}
                {recents.map((r) => (
                  <div key={r.id} className="flex items-center justify-between py-2.5" style={{ borderTop: "1px solid var(--border-soft)" }}>
                    <button onClick={() => update({ url: r.url })} className="text-sm rs-mono hover:text-[var(--gold)] transition-colors text-left truncate max-w-[180px]">{r.url}</button>
                    <button onClick={() => toggleFav(r.id)} className="rs-focus-ring w-7 h-7 grid place-items-center rounded-md hover:bg-white/5">
                      {r.fav ? <Star size={14} style={{ color: "var(--gold)" }} fill="var(--gold)" /> : <StarOff size={14} style={{ color: "var(--dim2)" }} />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="rs-card p-5">
              <SectionLabel icon={Star}>Favorites</SectionLabel>
              <div className="flex flex-col divide-y" style={{ borderColor: "var(--border-soft)" }}>
                {recents.filter((r) => r.fav).length === 0 && <p className="text-xs py-3" style={{ color: "var(--dim2)" }}>Star a screenshot to keep it here.</p>}
                {recents.filter((r) => r.fav).map((r) => (
                  <div key={r.id} className="flex items-center justify-between py-2.5" style={{ borderTop: "1px solid var(--border-soft)" }}>
                    <button onClick={() => update({ url: r.url })} className="text-sm rs-mono hover:text-[var(--gold)] transition-colors text-left truncate max-w-[180px]">{r.url}</button>
                    <Star size={14} style={{ color: "var(--gold)" }} fill="var(--gold)" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function ToggleRow({ label, checked, onChange }) {
  return (
    <label className="flex items-center justify-between cursor-pointer select-none">
      <span className="text-xs" style={{ color: "var(--dim)" }}>{label}</span>
      <button
        onClick={() => onChange(!checked)}
        className="rs-focus-ring w-9 h-5 rounded-full relative transition-colors"
        style={{ background: checked ? "var(--gold)" : "var(--surface3)" }}
      >
        <span className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all" style={{ left: checked ? 18 : 2 }} />
      </button>
    </label>
  );
}

/* ================================================================
   ROOT
   ================================================================ */

export default function App() {
  const [route, setRoute] = useState("landing");
  const { toasts, push } = useToasts();

  return (
    <div>
      <style>{FONT_IMPORT}</style>
      {route === "landing" ? (
        <Landing onLaunch={() => setRoute("dashboard")} />
      ) : (
        <Dashboard onBack={() => setRoute("landing")} toasts={toasts} pushToast={push} />
      )}
      <ToastStack toasts={toasts} />
    </div>
  );
}
