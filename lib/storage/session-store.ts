import { z } from "zod";
export const sessionStateSchema = z.object({ version: z.literal(1), content: z.string().min(20), title: z.string(), index: z.number().int().min(0), updatedAt: z.string() });
export type SessionState = z.infer<typeof sessionStateSchema>;
const key = "clf-session";
export function readSession(storage?: Storage): SessionState | null { const target = storage ?? (typeof window !== "undefined" ? window.localStorage : null); try { if (!target) return null; const value = sessionStateSchema.parse(JSON.parse(target.getItem(key) ?? "null")); return value; } catch { return null; } }
export function writeSession(state: Omit<SessionState, "version" | "updatedAt">, storage?: Storage) { const value = sessionStateSchema.parse({ ...state, version: 1, updatedAt: new Date().toISOString() }); const target = storage ?? (typeof window !== "undefined" ? window.localStorage : null); target?.setItem(key, JSON.stringify(value)); return value; }
export function clearSession(storage?: Storage) { const target = storage ?? (typeof window !== "undefined" ? window.localStorage : null); target?.removeItem(key); }
