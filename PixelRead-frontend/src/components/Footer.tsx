import Logo from "./Logo";

export default function Footer({ onLaunch }: { onLaunch: () => void }) {
  return (
    <footer className="px-6 py-12" style={{ borderTop: "1px solid var(--border-soft)" }}>
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Logo />
            <span className="font-semibold text-sm rs-mono">PixelRead</span>
          </div>
          <p className="text-xs" style={{ color: "var(--dim2)" }}>
            Screenshots, framed for open source. Built by{" "}
            <a href="https://github.com/Devkhaddy" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
              devKhaddy
            </a>
            .
          </p>
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
