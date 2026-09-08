# CLF-V1 demo visual thesis

## Thesis

The demo is a **focus corridor**, not a dashboard. It should make the transformation from source text to an explainable adapted result feel spatially continuous: input, estimate, adaptation, verification. The interface remains dark and low-stimulation, while mint is reserved for active state and causal connections.

## Anti-goals

- No generic card grid, glass panels, decorative analytics, or invented outcomes.
- No medical diagnosis, recovery score, or confidence claim.
- No animation that communicates nothing.
- No additional UI library, icon set, font request, image, or runtime script.

## Route tokens

- Canvas: `#090c0a`
- Stateful surface: `#0d120f`
- Mint action/causality: `#73f5d3`
- Warm safety boundary: `#ffbb6e`
- Hairline: `#273129`
- Corridor line: 28% mint
- Minimum interactive target: 44 CSS pixels

## Signature behavior

A single line ties input to results on wide screens and becomes a horizontal gateway on narrow screens. The line and labels remain static, legible, and meaningful with motion disabled. Existing deterministic values drive every meter and status; the visual layer introduces no metrics.

## Responsive acceptance

- Two spatial zones above 940px.
- One continuous column at and below 940px.
- Controls stack at 620px.
- No horizontal page overflow at 360px; comparison tabs may scroll within their own labeled region.
- The input ceases to be sticky on smaller layouts.

## Accessibility acceptance

- Existing semantic labels and live regions remain unchanged.
- Mode, comparison, feedback, and receipt controls are at least 44px high.
- Focus treatment remains visible.
- `prefers-reduced-motion` and the product's Reduced Motion setting produce a static corridor.
- High Contrast strengthens the corridor rule.
- Safety content keeps a distinct warm boundary and is not visually confused with success.

## Performance budget

This slice adds one route-scoped CSS file only. It allows no new dependency, network request, font, image, canvas, or script. Target added transfer size after compression: under 4 KB. Runtime JavaScript delta: zero.
