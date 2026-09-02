import { describe, expect, it } from "vitest";
import { defaultTolerance, runAdaptation } from "@/lib/adaptation/pipeline";

describe("adaptation pipeline", () => {
  it("preserves critical numbers and directives while chunking", () => {
    const result = runAdaptation({
      content: "You must submit 2 forms by 2026-09-02. Do not call this complete until the deadline.",
      tolerance: defaultTolerance(),
      mode: "chunk"
    });
    expect(result.blocked).toBe(false);
    if (!result.blocked) expect(result.fidelity.safe).toBe(true);
  });

  it("stops emergency-like input before normal adaptation", () => {
    const result = runAdaptation({
      content: "I have a worsening severe headache and repeated vomiting today.",
      tolerance: defaultTolerance(),
      mode: "chunk"
    });
    expect(result.blocked).toBe(true);
  });
});