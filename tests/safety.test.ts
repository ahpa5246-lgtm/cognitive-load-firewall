import { describe, expect, it } from "vitest";
import { safetyScan } from "@/lib/safety/rules";
import { defaultTolerance, runAdaptation } from "@/lib/adaptation/pipeline";

describe("safety layer", () => {
  it("blocks emergency-like input", () => {
    expect(safetyScan("I have repeated vomiting and increasing confusion").blocked).toBe(true);
  });

  it("allows normal adaptation requests", () => {
    expect(safetyScan("This article feels too dense to read").blocked).toBe(false);
  });

  it("does not provide clearance for activity questions", () => {
    const result = runAdaptation({
      content: "Can I return to football tomorrow after my concussion?",
      tolerance: defaultTolerance(),
      mode: "chunk",
    });
    expect(result.blocked).toBe(true);
    expect(result.safety.requiresCare).toBe(true);
  });
});

describe("Arabic language deterministic safety layer", () => {
  it("blocks Arabic emergency-like symptom text before normal adaptation", () => {
    const result = runAdaptation({
      content: "لدي صداع شديد يزداد مع تقيؤ متكرر اليوم.",
      tolerance: defaultTolerance(),
      mode: "chunk",
    });

    expect(result.blocked).toBe(true);
    expect(result.safety.matchCount).toBeGreaterThan(0);
  });

  it("pauses Arabic clearance and medication questions without answering them", () => {
    const result = runAdaptation({
      content: "هل أستطيع العودة إلى اللعب أو قيادة السيارة غدًا؟",
      tolerance: defaultTolerance(),
      mode: "chunk",
    });

    expect(result.blocked).toBe(true);
    expect(result.safety.requiresCare).toBe(true);
  });

  it("does not block ordinary Arabic educational content", () => {
    const scan = safetyScan("هذا نص دراسي عادي يشرح كيف نرتب الأفكار في خطوات قصيرة.");
    expect(scan.blocked).toBe(false);
    expect(scan.requiresCare).toBe(false);
  });
});
