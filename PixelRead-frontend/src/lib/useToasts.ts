import { useCallback, useState } from "react";
import type { Toast, ToastKind } from "./types";
import { uid } from "./utils";

export function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((msg: string, kind: ToastKind = "default") => {
    const id = uid();
    setToasts((t) => [...t, { id, msg, kind }]);
    window.setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 3200);
  }, []);

  return { toasts, push };
}
