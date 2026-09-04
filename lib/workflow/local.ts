import { randomUUID } from "node:crypto";
import { runAdaptation, type AdaptationInput } from "@/lib/adaptation/pipeline";
import { saveAdaptation } from "@/lib/repositories/adaptation-repository";

export type WorkflowStatus = {
  workflowId: string;
  requestId: string;
  adaptationId: string;
  currentStage: string;
  status: "completed" | "blocked";
  startedAt: string;
  finishedAt: string;
  durationMs: number;
};

type AdaptationResult = ReturnType<typeof runAdaptation>;
type PersistenceResult = { persisted: boolean; reason?: string; adaptationId?: string };
type WorkflowRunResult = { result: AdaptationResult; workflow: WorkflowStatus; persisted: PersistenceResult };

type RemoteRun = {
  id?: string;
  status?: string;
  results?: unknown[];
  error?: string;
  startedAt?: string;
  completedAt?: string;
  rootTaskRunId?: string;
  taskRun?: RemoteRun;
};

export interface WorkflowRunner {
  run(input: AdaptationInput): Promise<WorkflowRunResult>;
}

function unwrapRun(payload: unknown): RemoteRun {
  if (!payload || typeof payload !== "object") throw new Error("Render returned an invalid task-run payload");
  const run = payload as RemoteRun;
  return run.taskRun && typeof run.taskRun === "object" ? run.taskRun : run;
}

async function renderRequest(path: string, apiKey: string, init?: RequestInit) {
  const response = await fetch(`https://api.render.com/v1${path}`, {
    ...init,
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });
  if (!response.ok) {
    const message = await response.text().catch(() => "");
    throw new Error(`Render Workflows API ${response.status}: ${message.slice(0, 240)}`);
  }
  return response.json() as Promise<unknown>;
}

export class RenderWorkflowRunner implements WorkflowRunner {
  constructor(private readonly apiKey: string, private readonly taskSlug: string) {}

  async run(input: AdaptationInput): Promise<WorkflowRunResult> {
    const requestedAt = Date.now();
    const created = unwrapRun(await renderRequest("/task-runs", this.apiKey, {
      method: "POST",
      body: JSON.stringify({ task: this.taskSlug, input: [input] }),
    }));
    const taskRunId = created.id;
    if (!taskRunId) throw new Error("Render Workflows did not return a task-run ID");

    let remote = created;
    const deadline = Date.now() + 75_000;
    while (!new Set(["completed", "succeeded", "failed", "canceled"]).has(remote.status ?? "")) {
      if (Date.now() > deadline) throw new Error(`Render workflow ${taskRunId} exceeded the web wait budget`);
      await new Promise((resolve) => setTimeout(resolve, 650));
      remote = unwrapRun(await renderRequest(`/task-runs/${encodeURIComponent(taskRunId)}`, this.apiKey));
    }

    if (remote.status === "failed" || remote.status === "canceled") {
      throw new Error(`Render workflow ${taskRunId} ${remote.status}: ${remote.error ?? "no error detail"}`);
    }

    const result = remote.results?.[0] as AdaptationResult | undefined;
    if (!result || typeof result !== "object" || !("blocked" in result)) {
      throw new Error(`Render workflow ${taskRunId} completed without an adaptation result`);
    }

    const persisted: PersistenceResult = !result.blocked
      ? await saveAdaptation({ content: input.content, mode: input.mode, result })
      : { persisted: false, reason: "safety_blocked" };
    const started = remote.startedAt ? Date.parse(remote.startedAt) : requestedAt;
    const finished = remote.completedAt ? Date.parse(remote.completedAt) : Date.now();

    return {
      result,
      persisted,
      workflow: {
        workflowId: remote.rootTaskRunId || taskRunId,
        requestId: taskRunId,
        adaptationId: persisted.adaptationId ?? randomUUID(),
        currentStage: result.blocked ? "validateAndSafety" : "transformAndVerify",
        status: result.blocked ? "blocked" : "completed",
        startedAt: new Date(Number.isFinite(started) ? started : requestedAt).toISOString(),
        finishedAt: new Date(Number.isFinite(finished) ? finished : Date.now()).toISOString(),
        durationMs: Math.max(0, (Number.isFinite(finished) ? finished : Date.now()) - (Number.isFinite(started) ? started : requestedAt)),
      },
    };
  }
}

export class LocalWorkflowRunner implements WorkflowRunner {
  async run(input: AdaptationInput) {
    return adaptContentWorkflow(input);
  }
}

export class ResilientWorkflowRunner implements WorkflowRunner {
  constructor(private readonly primary: WorkflowRunner, private readonly fallback: WorkflowRunner) {}
  async run(input: AdaptationInput) {
    try {
      return await this.primary.run(input);
    } catch (error) {
      console.error("Render workflow failed; using safe local fallback", error instanceof Error ? error.message : error);
      return this.fallback.run(input);
    }
  }
}

export async function adaptContentWorkflow(input: AdaptationInput): Promise<WorkflowRunResult> {
  const started = Date.now();
  const startedAt = new Date(started).toISOString();
  const result = runAdaptation(input);
  const persisted: PersistenceResult = !result.blocked
    ? await saveAdaptation({ content: input.content, mode: input.mode, result })
    : { persisted: false, reason: "safety_blocked" };
  const finished = new Date().toISOString();
  return {
    result,
    persisted,
    workflow: {
      workflowId: `local-${randomUUID()}`,
      requestId: randomUUID(),
      adaptationId: persisted.adaptationId ?? randomUUID(),
      currentStage: result.blocked ? "safetyScan" : "buildDecisionReceipt",
      status: result.blocked ? "blocked" : "completed",
      startedAt,
      finishedAt: finished,
      durationMs: Date.now() - started,
    },
  };
}

export function getWorkflowRunner(): WorkflowRunner {
  const provider = process.env.WORKFLOW_PROVIDER ?? "local";
  const apiKey = process.env.RENDER_API_KEY;
  const taskSlug = process.env.RENDER_WORKFLOW_TASK;
  if (provider === "render" && apiKey && taskSlug) {
    const remote = new RenderWorkflowRunner(apiKey, taskSlug);
    return process.env.WORKFLOW_FALLBACK_LOCAL === "false"
      ? remote
      : new ResilientWorkflowRunner(remote, new LocalWorkflowRunner());
  }
  return new LocalWorkflowRunner();
}
