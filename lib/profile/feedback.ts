import type { ProfilePreferences } from "@/lib/storage/profile-store";

export type FeedbackDifficulty = "too_much_at_once" | "too_complex" | "too_visually_busy" | "too_many_steps" | "hard_to_remember" | "audio_easier";
export type PreferenceAdjustment = { field: keyof ProfilePreferences; previous: number | boolean | string; next: number | boolean | string; reason: string };
const rules: Record<FeedbackDifficulty, { field: keyof ProfilePreferences; reason: string }> = {
  too_much_at_once: { field: "informationDensityTolerance", reason: "You reported too much at once." },
  too_complex: { field: "readingTolerance", reason: "You reported language still felt complex." },
  too_visually_busy: { field: "visualLoadTolerance", reason: "You reported the page felt visually busy." },
  too_many_steps: { field: "taskSwitchingTolerance", reason: "You reported too many simultaneous steps." },
  hard_to_remember: { field: "memoryLoadTolerance", reason: "You reported that details were hard to remember." },
  audio_easier: { field: "audioTolerance", reason: "You reported audio was easier to process." }
};
export function adjustProfile(profile: ProfilePreferences, difficulty: FeedbackDifficulty): { profile: ProfilePreferences; adjustment: PreferenceAdjustment } {
  const rule = rules[difficulty];
  const previous = profile[rule.field];
  if (typeof previous !== "number") return { profile, adjustment: { field: rule.field, previous, next: previous, reason: rule.reason } };
  const next = Math.max(0, previous - 3);
  return { profile: { ...profile, [rule.field]: next, source: "interaction_derived", updatedAt: new Date().toISOString() }, adjustment: { field: rule.field, previous, next, reason: rule.reason } };
}
