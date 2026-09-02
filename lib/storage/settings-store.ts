import { z } from "zod";
export const settingsSchema = z.object({ version: z.literal(1), calm: z.boolean(), reducedMotion: z.boolean(), largeText: z.boolean(), highContrast: z.boolean(), readAloud: z.boolean() });
export type InterfaceSettings = z.infer<typeof settingsSchema>;
export const defaultSettings: InterfaceSettings = { version: 1, calm: false, reducedMotion: false, largeText: false, highContrast: false, readAloud: false };
const key = "clf-settings";
export function readSettings(storage?: Storage): InterfaceSettings { const target = storage ?? (typeof window !== "undefined" ? window.localStorage : null); try { if (!target) return defaultSettings; return settingsSchema.parse(JSON.parse(target.getItem(key) ?? "null")); } catch { return defaultSettings; } }
export function writeSettings(settings: Omit<InterfaceSettings, "version">, storage?: Storage) { const value = settingsSchema.parse({ ...settings, version: 1 }); const target = storage ?? (typeof window !== "undefined" ? window.localStorage : null); target?.setItem(key, JSON.stringify(value)); return value; }
export function clearSettings(storage?: Storage) { const target = storage ?? (typeof window !== "undefined" ? window.localStorage : null); target?.removeItem(key); }
