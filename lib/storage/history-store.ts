import { z } from "zod";

const historyItemSchema = z.object({ version: z.literal(1), id: z.string(), title: z.string().min(1), mode: z.string(), createdAt: z.string(), feedback: z.string().nullable().default(null) });
export type HistoryItem = z.infer<typeof historyItemSchema>;
const collectionSchema = z.object({ version: z.literal(1), items: z.array(historyItemSchema).max(25) });
const key = "clf-history";
export function readHistory(storage?: Storage): HistoryItem[] { const target = storage ?? (typeof window !== "undefined" ? window.localStorage : null); try { if (!target) return []; const parsed = JSON.parse(target.getItem(key) ?? "null"); return collectionSchema.parse(parsed).items; } catch { return []; } }
export function addHistory(item: Omit<HistoryItem, "version" | "id" | "createdAt">, storage?: Storage) { const next: HistoryItem = { ...item, version: 1, id: crypto.randomUUID(), createdAt: new Date().toISOString() }; const target = storage ?? (typeof window !== "undefined" ? window.localStorage : null); const items = [next, ...readHistory(target ?? undefined)].slice(0, 25); target?.setItem(key, JSON.stringify({ version: 1, items })); return next; }
export function removeHistory(id: string, storage?: Storage) { const target = storage ?? (typeof window !== "undefined" ? window.localStorage : null); const items = readHistory(target ?? undefined).filter(item => item.id !== id); target?.setItem(key, JSON.stringify({ version: 1, items })); }
export function clearHistory(storage?: Storage) { const target = storage ?? (typeof window !== "undefined" ? window.localStorage : null); target?.removeItem(key); }
