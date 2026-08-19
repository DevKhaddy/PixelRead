import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Sparkles,
  ArrowRight,
  MousePointerClick,
  Link2,
  Camera,
  Loader2,
  Moon,
  Sun,
  Monitor,
  Globe,
  Palette,
  ImageIcon,
  Command,
  ChevronDown,
} from "lucide-react";
import { BROWSERS } from "../lib/constants";
import { classNames } from "../lib/utils";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import PreviewStage from "../components/PreviewStage";

const FEATURES: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: Monitor, title: "Desktop & mobile", desc: "Capture both viewports in one pass, sized exactly for a README or social card." },
  { icon: Globe, title: "Browser frames", desc: "Wrap captures in Chrome, Safari or Edge chrome — or ship them bare." },
  { icon: Palette, title: "Backgrounds & gradients", desc: "Solid colors, curated gradients, padding, corner radius and shadow depth." },
  { icon: Sun, title: "Light & dark", desc: "Render the target site in either theme, independent of its own default." },
  { icon: ImageIcon, title: "Sized for the job", desc: "Social card, README banner, square, or mobile — pick a preset or go custom." },
  { icon: Command, title: "Built for keyboards", desc: "Capture, download and copy markdown without leaving the home row." },
];

const FAQS: { q: string; a: string }[] = [
  { q: "Do I need to install anything?", a: "No. Paste a URL, customize the frame, and download the PNG. The capture runs on our backend using a headless browser." },
  { q: "Can I use this for private or local URLs?", a: "Public URLs only for now — the capture service needs to reach the page over the internet." },
  { q: "What size should I use for a README?", a: "The README wide preset (1280×800) reads well at GitHub's default content width. Social (1200×630) is tuned for Open Graph cards." },
  { q: "Is there a markdown copy option?", a: "Yes — every capture generates ready-to-paste ![alt](url) markdown sized to match your image." },
  { q: "Can I keep past captures?", a: "Recent captures are kept in your dashboard automatically, and you can star any of them to keep as a favorite." },
];

export default function Landing({ onLaunch }: { onLaunch: () => void }) {
  const [demoUrl, setDemoUrl] = useState("stripe.com");
  const [demoDark, setDemoDark] = useState(true);
  const [demoBrowser, setDemoBrowser] = useState("chrome");
  const [capturing, setCapturing] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const runDemo = () => {
    setCapturing(true);
    window.setTimeout(() => setCapturing(false), 1400);
  };

  const demoSettings = {
    url: demoUrl,
    device: "desktop" as const,
    browser: demoBrowser as "chrome" | "safari" | "edge",
    darkMode: demoDark,
    bgMode: "gradient" as const,
    bgGradient: "gold-dusk",
    bgSolid: "#0A0D14",
    padding: 48,
    radius: 18,
    shadow: "lg" as const,
    showToolbar: true,
    deviceFrame: true,
    size: "readme" as const,
  };

  return (
    <div className="min-h-screen relative">
      <div className="rs-noise" />
      <Nav onLaunch={onLaunch} />

      {/* HERO */}
      <section className="relative px-6 pt-28 pb-24 md:pt-36 md:pb-32">
        <div className="rs-grid-bg absolute inset-x-0 top-0 h-[640px]" />
        <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[900px] h-[500px] rs-glow" />
        <div className="max-w-5xl mx-auto text-center relative rs-fade-up">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs rs-mono mb-7"
            style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--dim)" }}
          >
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
            <a
              href="#demo"
              className="rs-focus-ring px-6 py-3 rounded-xl text-sm inline-flex items-center gap-2"
              style={{ border: "1px solid var(--border)", color: "var(--text)" }}
            >
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
              <button
                onClick={() => setDemoDark((d) => !d)}
                className="rs-focus-ring w-8 h-8 rounded-lg grid place-items-center"
                style={{ background: "var(--surface2)", border: "1px solid var(--border)" }}
              >
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
            {FEATURES.map((f, i) => (
              <div key={f.title} className="rs-card rs-card-hover p-6 rs-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                <div
                  className="w-9 h-9 rounded-lg grid place-items-center mb-4"
                  style={{ background: "var(--surface2)", border: "1px solid var(--border)" }}
                >
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
      <section id="faq" className="px-6 pb-28">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10">
            <div className="text-xs uppercase tracking-[0.2em] mb-2 rs-mono" style={{ color: "var(--gold)" }}>Questions</div>
            <h2 className="text-3xl font-semibold">Frequently asked</h2>
          </div>
          <div className="flex flex-col gap-2">
            {FAQS.map((f, i) => (
              <div key={f.q} className="rs-card overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                  className="rs-focus-ring w-full flex items-center justify-between px-5 py-4 text-left text-sm font-medium"
                >
                  {f.q}
                  <ChevronDown
                    size={16}
                    className="transition-transform duration-200"
                    style={{ color: "var(--dim)", transform: openFaq === i ? "rotate(180deg)" : "none" }}
                  />
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
