import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { classNames } from "../lib/utils";

export function SectionLabel({ icon: Icon, children }: { icon: LucideIcon; children: ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <Icon size={13} style={{ color: "var(--gold)" }} />
      <span className="text-[11px] uppercase tracking-[0.14em] font-medium" style={{ color: "var(--dim)" }}>
        {children}
      </span>
    </div>
  );
}

export function SegButton({
  active,
  onClick,
  children,
  className,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={classNames(
        "rs-focus-ring flex-1 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors inline-flex items-center justify-center gap-1.5",
        className
      )}
      style={active ? { background: "var(--gold)", color: "#1A1408" } : { background: "var(--surface2)", color: "var(--dim)", border: "1px solid var(--border)" }}
    >
      {children}
    </button>
  );
}

export function Slider({
  value,
  min,
  max,
  onChange,
  suffix = "px",
}: {
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  suffix?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 accent-[#E8B54C]"
        style={{ accentColor: "var(--gold)" }}
      />
      <span className="rs-mono text-xs w-12 text-right" style={{ color: "var(--dim)" }}>
        {value}
        {suffix}
      </span>
    </div>
  );
}

export function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
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
