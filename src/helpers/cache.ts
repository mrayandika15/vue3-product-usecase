export type CacheEntry<T> = {
  data: T;
  timestamp: number;
};

function resolveEnvNumber(key: string, fallback: number): number {
  const raw = (import.meta as any)?.env?.[key];
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

export const CACHE_STALE_MS = resolveEnvNumber("VITE_CACHE_STALE_MS", 5 * 60 * 1000);
export const CACHE_GC_MS = resolveEnvNumber("VITE_CACHE_GC_MS", 10 * 60 * 1000);

export function getCache<T>(
  store: Record<string, CacheEntry<T>>,
  key: string
): CacheEntry<T> | null {
  const entry = store[key];
  if (!entry) return null;
  const age = Date.now() - entry.timestamp;
  if (age > CACHE_STALE_MS) return null;
  return entry;
}

export function setCache<T>(
  store: Record<string, CacheEntry<T>>,
  key: string,
  data: T
): void {
  store[key] = { data, timestamp: Date.now() };
}

export function invalidateCache(store: Record<string, CacheEntry<any>>, key: string): void {
  delete store[key];
}

export function gcCache(store: Record<string, CacheEntry<any>>): void {
  const now = Date.now();
  for (const k of Object.keys(store)) {
    if (now - store[k].timestamp > CACHE_GC_MS) delete store[k];
  }
}