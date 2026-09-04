# Render Workflows

Cognitive Load Firewall now includes a real Render Workflows service in `workflows/` instead of treating Render as hosting only.

## Registered tasks

The TypeScript workflow service defines four tasks:

1. `validateAndSafety` — validates the request and applies the deterministic health-safety gate before any normal adaptation.
2. `analyzeCognitiveLoad` — calculates interface-load features, preference mismatch, adaptation strategies, and the overall mismatch estimate.
3. `transformAndVerify` — performs the selected content transformation and verifies preservation of critical tokens.
4. `adaptContentWorkflow` — orchestrates the stages above as the judge-facing workflow entry point.

The orchestration intentionally keeps safety first. If the safety gate blocks the request, downstream adaptation tasks are not run.

## Web-service integration

The Next.js API uses `WORKFLOW_PROVIDER=render` to dispatch adaptation requests to Render's Workflow Tasks API. It starts `RENDER_WORKFLOW_TASK`, polls the task run to a terminal state, uses the workflow result as the adaptation result, and then persists the adaptation through the application's repository layer when a database is configured.

Required web-service variables:

```text
WORKFLOW_PROVIDER=render
RENDER_API_KEY=<server-side Render API key>
RENDER_WORKFLOW_TASK=<workflow-slug>/adaptContentWorkflow
WORKFLOW_FALLBACK_LOCAL=true
```

`RENDER_API_KEY` is server-only and must never be exposed through a `NEXT_PUBLIC_` variable or committed to Git.

## Graceful fallback

The deterministic `LocalWorkflowRunner` remains available so the public demo does not become unusable if Render Workflows is temporarily unavailable. Set `WORKFLOW_FALLBACK_LOCAL=false` only when strict remote-only execution is desired.

## Render Dashboard setup

Render Workflows are currently created from the Render Dashboard rather than `render.yaml`. Create a Workflow service using this repository with:

- Root Directory: `workflows`
- Language: `Node`
- Build Command: `npm install`
- Start Command: `npm start`
- Region: the same region as the web service where practical

After the first successful workflow deploy, open the Tasks tab, copy the exact slug for `adaptContentWorkflow`, and place it in the web service's `RENDER_WORKFLOW_TASK` environment variable. Add a Render API key to the web service as `RENDER_API_KEY`, change `WORKFLOW_PROVIDER` from `local` to `render`, and redeploy the web service.

The `/api/health` endpoint reports whether Render workflow credentials and a task slug are configured without exposing the API key itself.
