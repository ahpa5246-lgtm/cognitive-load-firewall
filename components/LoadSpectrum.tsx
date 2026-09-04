import type { LoadVector } from "@/lib/types";
import styles from "./LoadSpectrum.module.css";

type PreferenceVector = {
  reading: number;
  attention: number;
  memory: number;
  density: number;
  visual: number;
  motion: number;
};

type Dimension = keyof PreferenceVector;

const dimensions: { key: Dimension; label: string }[] = [
  { key: "reading", label: "Reading" },
  { key: "attention", label: "Attention" },
  { key: "memory", label: "Memory" },
  { key: "density", label: "Density" },
  { key: "visual", label: "Visual" },
  { key: "motion", label: "Motion" },
];

const center = 150;
const radius = 108;

function point(index: number, value = 100) {
  const angle = -Math.PI / 2 + (index / dimensions.length) * Math.PI * 2;
  const scaled = radius * Math.max(0, Math.min(100, value)) / 100;
  return {
    x: center + Math.cos(angle) * scaled,
    y: center + Math.sin(angle) * scaled,
  };
}

function polygon(values: Record<Dimension, number>) {
  return dimensions.map(({ key }, index) => {
    const p = point(index, values[key]);
    return `${p.x.toFixed(2)},${p.y.toFixed(2)}`;
  }).join(" ");
}

export function LoadSpectrum({ load, preference }: { load: LoadVector; preference: PreferenceVector }) {
  const contentValues = Object.fromEntries(dimensions.map(({ key }) => [key, Number(load[key] ?? 0)])) as Record<Dimension, number>;
  const preferenceValues = Object.fromEntries(dimensions.map(({ key }) => [key, preference[key]])) as Record<Dimension, number>;
  const mismatchValues = Object.fromEntries(dimensions.map(({ key }) => [key, Math.max(0, contentValues[key] - preferenceValues[key])])) as Record<Dimension, number>;
  const largest = dimensions.reduce((best, current) => mismatchValues[current.key] > mismatchValues[best.key] ? current : best, dimensions[0]);
  const largestValue = mismatchValues[largest.key];

  return (
    <section className={`${styles.card} panel`} aria-labelledby="load-spectrum-title">
      <div className={styles.copy}>
        <span className="label">Load Spectrum</span>
        <h2 id="load-spectrum-title">Where the interface asks for more than you prefer.</h2>
        <p>
          This compares an experimental interface-load estimate with the preferences you selected. It is not a medical or neurological measurement.
        </p>
        <div className={styles.legend} aria-label="Chart legend">
          <span><i className={styles.contentDot} />Content load</span>
          <span><i className={styles.preferenceDot} />My preference</span>
          <span><i className={styles.mismatchDot} />Mismatch</span>
        </div>
        <div className={styles.insight} role="status">
          <span>Largest mismatch</span>
          <strong>{largest.label}</strong>
          <small>{largestValue > 0 ? `${largestValue} points above current preference` : "No positive mismatch detected"}</small>
        </div>
      </div>

      <div className={styles.visual}>
        <svg viewBox="0 0 300 300" role="img" aria-labelledby="spectrum-title spectrum-desc">
          <title id="spectrum-title">Interface Load Spectrum</title>
          <desc id="spectrum-desc">
            Radar comparison of content load, current preference and mismatch across reading, attention, memory, density, visual and motion dimensions.
          </desc>
          {[25, 50, 75, 100].map((level) => (
            <polygon
              key={level}
              className={styles.grid}
              points={dimensions.map((_, index) => {
                const p = point(index, level);
                return `${p.x},${p.y}`;
              }).join(" ")}
            />
          ))}
          {dimensions.map((dimension, index) => {
            const outer = point(index, 100);
            const label = point(index, 121);
            return (
              <g key={dimension.key}>
                <line className={styles.axis} x1={center} y1={center} x2={outer.x} y2={outer.y} />
                <text className={styles.label} x={label.x} y={label.y} textAnchor="middle" dominantBaseline="middle">{dimension.label}</text>
              </g>
            );
          })}
          <polygon className={`${styles.shape} ${styles.content}`} points={polygon(contentValues)} />
          <polygon className={`${styles.shape} ${styles.preference}`} points={polygon(preferenceValues)} />
          <polygon className={`${styles.shape} ${styles.mismatch}`} points={polygon(mismatchValues)} />
        </svg>
      </div>

      <dl className={styles.table} aria-label="Load Spectrum values">
        {dimensions.map(({ key, label }) => (
          <div key={key}>
            <dt>{label}</dt>
            <dd><span>Content {contentValues[key]}</span><span>Preference {preferenceValues[key]}</span><strong>Mismatch {mismatchValues[key]}</strong></dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
