import { GitFork } from "lucide-react";
import Logo from "./Logo";

export default function Nav({ onLaunch }: { onLaunch: () => void }) {
  return (
    <nav
      className="sticky top-0 z-40 backdrop-blur-md"
      style={{ background: "rgba(10,13,20,0.7)", borderBottom: "1px solid var(--border-soft)" }}
    >
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Logo />
          <span className="font-semibold text-sm rs-mono">PixelRead</span>
        </div>
        <div className="hidden md:flex items-center gap-7 text-sm" style={{ color: "var(--dim)" }}>
          <a href="#demo" className="hover:text-white transition-colors">Demo</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          <a href="https://github.com/Devkhaddy" target="_blank" rel="noreferrer" className="hover:text-white transition-colors inline-flex items-center gap-1">
            <GitFork size={14} /> GitHub
          </a>
        </div>
        <button onClick={onLaunch} className="rs-btn-gold rs-focus-ring px-4 py-2 rounded-lg text-xs">
          Open dashboard
        </button>
      </div>
    </nav>
  );
}
