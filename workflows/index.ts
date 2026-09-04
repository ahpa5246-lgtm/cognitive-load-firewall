import { task } from "@renderinc/sdk/workflows";
import { adaptationInputSchema, type AdaptationInput } from "@/lib/adaptation/pipeline";
import { safetyScan } from "@/lib/safety/rules";
import { analyzeContentLoad } from "@/lib/cognitive-load/analyzer";
import { calculateMismatch } from "@/lib/cognitive-load/mismatch";
import { buildAdaptationPlan } from "@/lib/adaptation/planner";
import { adaptTextDeterministically } from "@/lib/adaptation/deterministic";
import { compareCriticalTokens } from "@/lib/fidelity/critical-tokens";

const retry = { maxRetries: 2, waitDurationMs: 500, backoffScaling: 2 };

type LoadAnalysis = {
  load: ReturnType<typeof analyzeContentLoad>;
  mismatch: ReturnType<typeof calculateMismatch>;
  plan: ReturnType<typeof buildAdaptationPlan>;
  overallMismatch: number;
};

const plainLanguage = (text: string) => text
  .replace(/comprises/gi, "includes")
  .replace(/utilize/gi, "use")
  .replace(/commence/gi, "start")
  .replace(/approximately/gi, "about");

const validateAndSafety = task(
  { name: "validateAndSafety", retry, timeoutSeconds: 60 },
  function validateAndSafety(input: AdaptationInput) {
    const parsed = adaptationInputSchema.parse(input);
    const safety = safetyScan(parsed.content);
    return { input: parsed, safety };
  },
);

const analyzeCognitiveLoad = task(
  { name: "analyzeCognitiveLoad", retry, timeoutSeconds: 60 },
  function analyzeCognitiveLoad(input: AdaptationInput): LoadAnalysis {
    const load = analyzeContentLoad(input.content);
    const mismatch = calculateMismatch(load, input.tolerance);
    const plan = buildAdaptationPlan(mismatch);
    const overallMismatch = Math.round(
      Object.values(mismatch).reduce((sum, value) => sum + value, 0) / 6,
    );
    return { load, mismatch, plan, overallMismatch };
  },
);

const transformAndVerify = task(
  { name: "transformAndVerify", retry, timeoutSeconds: 90 },
  function transformAndVerify(input: AdaptationInput, analysis: LoadAnalysis) {
    const source = input.mode === "plain" ? plainLanguage(input.content) : input.content;
    const transformed = adaptTextDeterministically(source, analysis.plan);
    const essential = input.mode === "essential"
      ? transformed.chunks.filter((chunk) => /\b(must|required|warning|deadline|do not|first|key|important)\b/i.test(chunk))
      : transformed.chunks;
    const chunks = input.mode === "guided"
      ? transformed.chunks.map((chunk, index) => `Step ${index + 1}: ${chunk}`)
      : essential.length ? essential : transformed.chunks;
    const adaptedContent = chunks.join("\n\n");
    const fidelity = compareCriticalTokens(input.content, adaptedContent);

    return {
      blocked: false as const,
      safety: { blocked: false, requiresCare: false, message: "" },
      ...analysis,
      adaptedContent,
      chunks,
      fidelity,
      operations: transformed.operations,
      receipt: {
        inputType: "pasted_text",
        provider: "render-workflows/deterministic",
        stages: [
          "validateAndSafety",
          "analyzeCognitiveLoad",
          "profileMatch",
          "transformAndVerify",
          "validateCriticalFacts",
          "buildDecisionReceipt",
        ],
        rulesTriggered: analysis.plan.strategies.map((strategy) => strategy.type),
        explanation: "Content was adapted because the interface-load estimate exceeded one or more current preferences. This is an accessibility decision, not a medical conclusion.",
        safetyChecksPassed: true,
      },
    };
  },
);

export const adaptContentWorkflow = task(
  { name: "adaptContentWorkflow", retry, timeoutSeconds: 180 },
  async function adaptContentWorkflow(input: AdaptationInput) {
    const gate = await validateAndSafety(input);
    if (gate.safety.blocked || gate.safety.requiresCare) {
      return {
        blocked: true as const,
        safety: gate.safety,
        receipt: {
          inputType: "pasted_text",
          provider: "render-workflows/deterministic",
          stages: ["validateAndSafety"],
          rulesTriggered: ["SAFETY_PAUSE"],
          explanation: "Normal adaptation stopped because the deterministic safety gate detected a high-risk health statement.",
          safetyChecksPassed: false,
        },
      };
    }

    const analysis = await analyzeCognitiveLoad(gate.input);
    return transformAndVerify(gate.input, analysis);
  },
);
