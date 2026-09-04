"use client";

import { useRef } from "react";

export function CognitiveField() {
  const ref = useRef<HTMLDivElement>(null);

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;
    event.currentTarget.style.setProperty("--mx", `${x}%`);
    event.currentTarget.style.setProperty("--my", `${y}%`);
  }

  return (
    <div
      ref={ref}
      className="cognitive-field"
      onPointerMove={onPointerMove}
      onPointerLeave={(event) => {
        event.currentTarget.style.setProperty("--mx", "68%");
        event.currentTarget.style.setProperty("--my", "38%");
      }}
      aria-hidden="true"
    >
      <div className="field-orbit orbit-a" />
      <div className="field-orbit orbit-b" />
      <div className="field-orbit orbit-c" />
      <div className="field-core">
        <span className="core-ring ring-one" />
        <span className="core-ring ring-two" />
        <span className="core-point" />
      </div>
      <div className="field-node node-a"><i />READ</div>
      <div className="field-node node-b"><i />FOCUS</div>
      <div className="field-node node-c"><i />MOTION</div>
      <div className="field-node node-d"><i />MEMORY</div>
      <div className="field-radar radar-a" />
      <div className="field-radar radar-b" />
      <div className="field-caption">INTERFACE LOAD FIELD / LIVE ADAPTATION MODEL</div>
    </div>
  );
}
