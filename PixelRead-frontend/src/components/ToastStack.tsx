import { Check, Sparkles } from "lucide-react";
import type { Toast } from "../lib/types";

export default function ToastStack({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="fixed bottom-5 right-5 z-[999] flex flex-col gap-2 items-end">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="rs-toast-in rs-card flex items-center gap-2 px-4 py-3 text-sm shadow-2xl"
          style={{ borderColor: t.kind === "success" ? "#2f4a35" : "var(--border-soft)" }}
        >
          {t.kind === "success" ? (
            <Check size={15} style={{ color: "var(--teal)" }} />
          ) : (
            <Sparkles size={15} style={{ color: "var(--gold)" }} />
          )}
          <span>{t.msg}</span>
        </div>
      ))}
    </div>
  );
}
