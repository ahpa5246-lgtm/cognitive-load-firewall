import { prisma, databaseConfigured } from "@/lib/db";
export async function saveAdaptation(input: { content: string; mode: string; result: { adaptedContent: string; load: Record<string, number>; plan: object; receipt: { rulesTriggered: string[]; stages: string[]; safetyChecksPassed: boolean } } }) {
  if (!databaseConfigured) return { persisted: false as const, reason: "database_not_configured" };
  try {
    const persisted = await prisma.$transaction(async (transaction) => {
      const artifact = await transaction.contentArtifact.create({ data: { title: "Guest adaptation", inputType: "pasted_text", content: input.content } });
      await transaction.contentAnalysis.create({ data: { artifactId: artifact.id, reading: Number(input.result.load.reading), memory: Number(input.result.load.memory), attention: Number(input.result.load.attention), visual: Number(input.result.load.visual), motion: Number(input.result.load.motion), density: Number(input.result.load.density) } });
      return transaction.adaptation.create({ data: { artifactId: artifact.id, mode: input.mode, adaptedContent: input.result.adaptedContent, plan: input.result.plan, receipt: { create: { rulesTriggered: input.result.receipt.rulesTriggered, aiStagesUsed: input.result.receipt.stages, preservedCritical: input.result.receipt.rulesTriggered, safetyChecksPassed: input.result.receipt.safetyChecksPassed } } } });
    });
    return { persisted: true as const, adaptationId: persisted.id };
  } catch { return { persisted: false as const, reason: "database_unavailable" }; }
}
