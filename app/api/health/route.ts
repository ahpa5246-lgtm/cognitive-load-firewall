import { NextResponse } from "next/server";
import { databaseConfigured, prisma } from "@/lib/db";

export async function GET() {
  let databaseReachable = false;
  if (databaseConfigured) {
    try {
      await Promise.race([
        prisma.$queryRaw`SELECT 1`,
        new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 1200)),
      ]);
      databaseReachable = true;
    } catch {
      databaseReachable = false;
    }
  }

  const workflowProvider = process.env.WORKFLOW_PROVIDER ?? "local";
  const renderWorkflowConfigured = Boolean(process.env.RENDER_API_KEY && process.env.RENDER_WORKFLOW_TASK);

  return NextResponse.json({
    status: "ok",
    app: "cognitive-load-firewall",
    database: { configured: databaseConfigured, reachable: databaseReachable },
    ai: {
      provider: process.env.AI_PROVIDER ?? "deterministic",
      demoMode: process.env.DEMO_AI_MODE !== "false",
    },
    workflow: {
      provider: workflowProvider,
      configured: workflowProvider === "render" ? renderWorkflowConfigured : true,
      task: process.env.RENDER_WORKFLOW_TASK ?? null,
      fallbackLocal: process.env.WORKFLOW_FALLBACK_LOCAL !== "false",
    },
    timestamp: new Date().toISOString(),
  });
}
