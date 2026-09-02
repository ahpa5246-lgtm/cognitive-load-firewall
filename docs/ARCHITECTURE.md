# Architecture

The adaptation engine remains usable without a generative-AI provider. Deterministic analysis and safety logic form the baseline; generative AI may enhance transformations only behind validated structured interfaces.

## Boundaries

- Safety is evaluated before normal adaptation.
- Content is treated as untrusted data.
- User tolerance values are product-personalization inputs, not clinical measurements.
- Clinician constraints preserve provenance and must override convenience suggestions.
- AI outputs require schema validation and fidelity checks before display.
