import { describe, expect, it } from "vitest";
import { adjustProfile } from "@/lib/profile/feedback";
import { defaultProfile } from "@/lib/storage/profile-store";
import { compareCriticalTokens } from "@/lib/fidelity/critical-tokens";

describe("personalization and fidelity", () => {
  it("makes one bounded, explainable density adjustment", () => {
    const result = adjustProfile(defaultProfile, "too_much_at_once");
    expect(result.profile.informationDensityTolerance).toBe(52);
    expect(result.adjustment.previous).toBe(55);
    expect(result.adjustment.next).toBe(52);
    expect(result.profile.source).toBe("interaction_derived");
  });
  it("flags lost units, percentages, and email addresses", () => {
    const report = compareCriticalTokens("Use 5 mg at 20% and email care@example.com", "Use the medicine");
    expect(report.safe).toBe(false);
    expect(report.missingUnits).toEqual(["5 mg"]);
    expect(report.missingPercentages).toEqual(["20%"]);
    expect(report.missingEmails).toEqual(["care@example.com"]);
  });
});
