"use client";

import { useState } from "react";
import { Shell } from "@/app/ui";

const capabilities = [
  "Keyboard navigation",
  "Visible focus states",
  "Reduced motion",
  "Text resizing",
  "Screen reader landmarks",
  "No color-only status",
  "Optional read aloud",
  "High contrast surfaces",
];

export default function AccessibilityPage() {
  const [large, setLarge] = useState(false);
  const [contrast, setContrast] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [focusMode, setFocusMode] = useState(true);

  return (
    <Shell>
      <section className="access-hero">
        <div>
          <div className="eyebrow">Accessibility lab / live instrument</div>
          <h1>The interface should know when to disappear.</h1>
          <p className="lede">Accessibility here is not a palette swap. Change the controls and watch hierarchy, contrast, motion and reading scale respond in the live surface.</p>
        </div>
        <div className="access-orbit" aria-hidden="true">
          <div className="access-core">A11Y</div>
          <span>FOCUS / VISIBLE</span>
          <span>MOTION / OPTIONAL</span>
          <span>TEXT / FLUID</span>
          <span>STATUS / REDUNDANT</span>
        </div>
      </section>

      <section className="access-lab-grid" aria-label="Interactive accessibility laboratory">
        <div className="access-matrix" role="group" aria-label="Preview controls">
          <button className={`access-control ${large ? "active" : ""}`} onClick={() => setLarge(!large)} aria-pressed={large}>
            <span className="control-index">01</span><span><strong>Reading scale</strong><small> Increase the text without changing task order.</small></span><i className="control-state" aria-hidden="true" />
          </button>
          <button className={`access-control ${contrast ? "active" : ""}`} onClick={() => setContrast(!contrast)} aria-pressed={contrast}>
            <span className="control-index">02</span><span><strong>Contrast isolation</strong><small> Remove weak surface separation.</small></span><i className="control-state" aria-hidden="true" />
          </button>
          <button className={`access-control ${reduced ? "active" : ""}`} onClick={() => setReduced(!reduced)} aria-pressed={reduced}>
            <span className="control-index">03</span><span><strong>Motion restraint</strong><small> Keep state change, remove spectacle.</small></span><i className="control-state" aria-hidden="true" />
          </button>
          <button className={`access-control ${focusMode ? "active" : ""}`} onClick={() => setFocusMode(!focusMode)} aria-pressed={focusMode}>
            <span className="control-index">04</span><span><strong>Focus beam</strong><small> Keep one action visually dominant.</small></span><i className="control-state" aria-hidden="true" />
          </button>
        </div>

        <div className="access-live-canvas">
          <article className={`access-live-card ${large ? "large" : ""} ${contrast ? "contrast" : ""} ${reduced ? "reduced" : ""}`}>
            <span className="label">Live surface / semantic controls</span>
            <h2>One task. One visible next step.</h2>
            <p>{focusMode ? "The primary action remains visually dominant while secondary choices recede." : "All controls retain labels, focus states and keyboard access even when emphasis is neutral."}</p>
            <div className="actions">
              <button className="primary" onClick={() => window.speechSynthesis?.speak(new SpeechSynthesisUtterance("One task. One visible next step."))}>Read aloud</button>
              <button className="secondary" onClick={() => setFocusMode(!focusMode)}>Shift emphasis</button>
            </div>
          </article>
        </div>
      </section>

      <section className="access-capabilities" aria-label="Accessibility capabilities">
        {capabilities.map((item, index) => <div className="access-capability" key={item}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item}</strong></div>)}
      </section>
    </Shell>
  );
}
