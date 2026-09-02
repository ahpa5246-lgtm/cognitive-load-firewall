import { z } from "zod";
import { analyzeContentLoad } from "@/lib/cognitive-load/analyzer";
import { calculateMismatch } from "@/lib/cognitive-load/mismatch";
import { adaptTextDeterministically } from "@/lib/adaptation/deterministic";
import { buildAdaptationPlan } from "@/lib/adaptation/planner";
import { compareCriticalTokens } from "@/lib/fidelity/critical-tokens";
import { safetyScan } from "@/lib/safety/rules";
import type { LoadVector } from "@/lib/types";

export const adaptationInputSchema = z.object({
  content: z.string().trim().min(20).max(30000),
  tolerance: z.object({
    reading: z.number().min(0).max(100), memory: z.number().min(0).max(100),
    attention: z.number().min(0).max(100), visual: z.number().min(0).max(100),
    motion: z.number().min(0).max(100), density: z.number().min(0).max(100)
  }),
  mode: z.enum(["chunk", "plain", "guided"]).default("chunk")
});

export type AdaptationInput = z.infer<typeof adaptationInputSchema>;

const plainLanguage = (text: string) => text
  .replace(/comprises/gi, "includes")
  .replace(/utilize/gi, "use")
  .replace(/commence/gi, "start")
  .replace(/approximately/gi, "about");

export function runAdaptation(input: AdaptationInput) {
  const parsed = adaptationInputSchema.parse(input);
  const safety = safetyScan(parsed.content);
  if (safety.blocked || safety.requiresCare) return { blocked: true as const, safety };

  const load = analyzeContentLoad(parsed.content);
  const mismatch = calculateMismatch(load, parsed.tolerance);
  const plan = buildAdaptationPlan(mismatch);
  const transformed = adaptTextDeterministically(parsed.mode === "plain" ? plainLanguage(parsed.content) : parsed.content, plan);
  const chunks = parsed.mode === "guided"
    ? transformed.chunks.map((chunk, index) => `Step ${index + 1}: ${chunk}`)
    : transformed.chunks;
  const adaptedContent = chunks.join("\n\n");
  const fidelity = compareCriticalTokens(parsed.content, adaptedContent);
  const overallMismatch = Math.round(Object.values(mismatch).reduce((sum, value) => sum + value, 0) / 6);

  return {
    blocked: false as const, safety, load, mismatch, overallMismatch, plan,
    adaptedContent, chunks, fidelity,
    receipt: {
      inputType: "pasted_text", provider: "deterministic-demo", stages: [
        "normalizeInput", "safetyScan", "extractFeatures", "analyzeLoad",
        "profileMatch", "transformContent", "validateCriticalFacts", "buildReceipt"
      ],
      rulesTriggered: plan.strategies.map((strategy) => strategy.type),
      explanation: "تم تقسيم المحتوى لأن تفضيل القراءة المستمرة الحالي أقل من حمولة هذا النص. هذا قرار تكييف للواجهة وليس استنتاجًا طبيًا.",
      safetyChecksPassed: true
    }
  };
}

export function defaultTolerance(): LoadVector {
  return { reading: 42, memory: 50, attention: 46, visual: 44, motion: 25, density: 38 };
}