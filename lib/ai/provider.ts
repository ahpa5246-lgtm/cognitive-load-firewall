import { z } from "zod";
import { analyzeContentLoad } from "@/lib/cognitive-load/analyzer";
import { buildAdaptationPlan } from "@/lib/adaptation/planner";
import type { AdaptationPlan, LoadVector } from "@/lib/types";

export const providerResultSchema = z.object({ provider: z.string(), load: z.record(z.string(), z.number()), plan: z.object({ strategies: z.array(z.object({ type: z.string(), reason: z.string(), priority: z.number() })) }) });
export interface AIProvider { analyzeContent(content: string): Promise<{ load: LoadVector }>; generateAdaptationPlan(load: LoadVector, tolerance: LoadVector): Promise<AdaptationPlan>; explainAdaptation(plan: AdaptationPlan): Promise<string>; }
export class DeterministicProvider implements AIProvider {
  async analyzeContent(content: string) { return { load: analyzeContentLoad(content) }; }
  async generateAdaptationPlan(load: LoadVector, tolerance: LoadVector) { return buildAdaptationPlan({ reading: Math.max(0, load.reading - tolerance.reading), memory: Math.max(0, load.memory - tolerance.memory), attention: Math.max(0, load.attention - tolerance.attention), visual: Math.max(0, load.visual - tolerance.visual), motion: Math.max(0, load.motion - tolerance.motion), density: Math.max(0, load.density - tolerance.density) }); }
  async explainAdaptation(plan: AdaptationPlan) { return `Deterministic rules selected ${plan.strategies.length || "no"} presentation change${plan.strategies.length === 1 ? "" : "s"}.` }
}
export function getAIProvider(): AIProvider { return new DeterministicProvider(); }
