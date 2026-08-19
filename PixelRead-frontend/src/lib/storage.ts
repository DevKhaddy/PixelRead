import type { SavedCapture } from "./types";
import { uid } from "./utils";

const KEY = "pixelread.captures.v1";
const MAX = 12;

export function loadCaptures(): SavedCapture[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as SavedCapture[]) : [];
  } catch {
    return [];
  }
}

function persist(list: SavedCapture[]): boolean {
  try {
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX)));
    return true;
  } catch {
    // Quota exceeded or storage unavailable — keep going, just don't persist.
    return false;
  }
}

/** Adds a capture to the top of the list (dedupes by url+size). Returns the new list + whether it was persisted. */
export function saveCapture(capture: Omit<SavedCapture, "id" | "fav" | "createdAt">): {
  list: SavedCapture[];
  ok: boolean;
} {
  const current = loadCaptures();
  const existing = current.findIndex((c) => c.url === capture.url && c.size === capture.size);
  // Keep the existing favorite when re-capturing the same url+size.
  const entry: SavedCapture = {
    ...capture,
    id: uid(),
    fav: existing >= 0 ? current[existing].fav : false,
    createdAt: Date.now(),
  };
  const next = existing >= 0 ? [...current.slice(0, existing), entry, ...current.slice(existing + 1)] : [entry, ...current];
  const ok = persist(next);
  return { list: next.slice(0, MAX), ok };
}

export function deleteCapture(id: string): SavedCapture[] {
  const next = loadCaptures().filter((c) => c.id !== id);
  persist(next);
  return next;
}

export function toggleFavorite(id: string): SavedCapture[] {
  const next = loadCaptures().map((c) => (c.id === id ? { ...c, fav: !c.fav } : c));
  persist(next);
  return next;
}
