# Render Workflows

The application keeps adaptation as a staged workflow boundary. `adaptContentWorkflow` currently runs through `LocalWorkflowRunner` so the judge demo is immediate and requires no credential. The same contract exposes `workflowId`, `requestId`, `adaptationId`, stage, status, timestamps, and duration.

Production deployment can bind this contract to Render Workflows by dispatching the stages below as tasks:

1. normalize input and scan safety
2. extract structure and deterministic features in parallel
3. match profile and build a plan
4. transform content
5. validate critical tokens and run output safety checks
6. persist the adaptation and build its decision receipt

Raw content is not emitted in workflow logs. `DEMO_AI_MODE=true` remains the reliable fallback when a provider or workflow service is unavailable.
