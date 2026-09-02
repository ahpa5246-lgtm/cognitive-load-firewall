import { z } from "zod";

export const profilePreferencesSchema = z.object({
  version: z.literal(1),
  source: z.enum(["self_reported", "demo", "interaction_derived"]),
  readingTolerance: z.number().min(0).max(100),
  attentionTolerance: z.number().min(0).max(100),
  memoryLoadTolerance: z.number().min(0).max(100),
  visualLoadTolerance: z.number().min(0).max(100),
  motionTolerance: z.number().min(0).max(100),
  informationDensityTolerance: z.number().min(0).max(100),
  audioTolerance: z.number().min(0).max(100),
  taskSwitchingTolerance: z.number().min(0).max(100),
  sessionDurationTolerance: z.number().min(0).max(100),
  fatigueLevel: z.number().min(0).max(100),
  updatedAt: z.string()
});
export type ProfilePreferences = z.infer<typeof profilePreferencesSchema>;
export const defaultProfile: ProfilePreferences = { version: 1, source: "self_reported", readingTolerance: 55, attentionTolerance: 55, memoryLoadTolerance: 55, visualLoadTolerance: 55, motionTolerance: 55, informationDensityTolerance: 55, audioTolerance: 55, taskSwitchingTolerance: 55, sessionDurationTolerance: 55, fatigueLevel: 45, updatedAt: new Date(0).toISOString() };
const key = "clf-profile";
export function readProfile(storage?: Storage): ProfilePreferences { const target = storage ?? (typeof window !== "undefined" ? window.localStorage : null); try { if (!target) return defaultProfile; const parsed = JSON.parse(target.getItem(key) ?? "null"); return profilePreferencesSchema.parse(parsed); } catch { return defaultProfile; } }
export function writeProfile(profile: Omit<ProfilePreferences, "version" | "updatedAt">, storage?: Storage) { const value = profilePreferencesSchema.parse({ ...profile, version: 1, updatedAt: new Date().toISOString() }); const target = storage ?? (typeof window !== "undefined" ? window.localStorage : null); target?.setItem(key, JSON.stringify(value)); return value; }
export function clearProfile(storage?: Storage) { const target = storage ?? (typeof window !== "undefined" ? window.localStorage : null); target?.removeItem(key); }
