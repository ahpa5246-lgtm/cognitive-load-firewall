import Link from "next/link";
import { CognitiveField } from "@/components/CognitiveField";

export default function Home() {
  return (
    <main className="app-shell home-shell">
      <header className="topbar">
        <Link className="brand" href="/" aria-label="Cognitive Load Firewall home">
          <span className="brand-mark">CLF</span>
          <span className="brand-name">Cognitive Load <b>Firewall</b></span>
        </Link>
        <nav aria-label="Main navigation">
          <Link href="/demo">Judge demo</Link>
          <Link href="/onboarding">Preferences</Link>
          <Link href="/dashboard">Workspace</Link>
          <Link href="/responsible-ai">Responsible AI</Link>
        </nav>
        <Link className="nav-cta" href="/demo">Open demo ↗</Link>
      </header>

      <section className="hero hero-redesign">
        <div className="hero-copy-block">
          <div className="eyebrow"><span className="live-dot" /> Adaptive cognitive accessibility</div>
          <h1>
            The interface should
            <span className="hero-shift">move around you.</span>
          </h1>
          <p className="hero-copy">Cognitive Load Firewall detects when digital content asks for more reading, memory, attention, or sensory effort than you want to spend—and reshapes the interface instead of asking you to push harder.</p>
          <div className="actions">
            <Link className="primary" href="/demo">Enter the 90-second demo <span>↗</span></Link>
            <Link className="secondary" href="/responsible-ai">See the safety model</Link>
          </div>
          <div className="hero-proof" aria-label="Product principles">
            <div><strong>0</strong><span>diagnoses made</span></div>
            <div><strong>6</strong><span>load dimensions</span></div>
            <div><strong>1</strong><span>interface that yields</span></div>
          </div>
        </div>
        <CognitiveField />
      </section>

      <section className="manifesto-strip" aria-label="Core idea">
        <span>01</span>
        <p>Most recovery tools ask the person to keep adapting to the software.</p>
        <strong>We reverse the direction.</strong>
      </section>

      <section className="transformation-stage" aria-label="Before and after adaptation">
        <div className="section-kicker"><span>02</span> Live transformation</div>
        <div className="transform-grid">
          <article className="panel noisy transform-card original-card">
            <div className="card-topline"><span className="label">Original / high density</span><span className="signal-badge signal-high">LOAD ↑</span></div>
            <h2>One screen. Too many demands.</h2>
            <p>Cellular respiration comprises a coordinated sequence of biochemical pathways, including glycolysis, pyruvate oxidation, the citric acid cycle, and oxidative phosphorylation, each involving substrates, enzymes, cofactors, regulatory checkpoints, and energy-transfer reactions.</p>
            <p className="ghost-line">Students are expected to retain the order of events, distinguish cellular compartments, compare aerobic and anaerobic conditions, and interpret ATP yield while connecting each phase to earlier metabolic concepts.</p>
            <div className="noise-map" aria-hidden="true"><i/><i/><i/><i/><i/></div>
          </article>

          <div className="adaptation-rail" aria-hidden="true">
            <span>ANALYZE</span><i/><span>ADAPT</span>
          </div>

          <article className="panel calm transform-card adapted-card">
            <div className="card-topline"><span className="label">Adapted / lower friction</span><span className="signal-badge signal-low">LOAD ↓</span></div>
            <h2>Start with one idea.</h2>
            <p><strong>Cellular respiration</strong> is how cells release usable energy from food.</p>
            <ol className="calm-steps">
              <li><span>01</span><p>Glycolysis starts breaking down glucose.</p></li>
              <li><span>02</span><p>Later stages extract more energy.</p></li>
              <li><span>03</span><p>Technical detail stays available when you want it.</p></li>
            </ol>
          </article>
        </div>
      </section>

      <section className="principles principles-redesign">
        <div>
          <span className="section-kicker"><span>03</span> Design principle</span>
          <h2>The user is not the interface problem.</h2>
        </div>
        <div className="principle-copy">
          <p>We estimate interface load, compare it with preferences you provide, then change density, sequencing, motion and presentation while preserving critical information.</p>
          <Link className="inline-link" href="/demo">Watch the interface yield <span>→</span></Link>
        </div>
      </section>

      <section className="system-grid" aria-label="System capabilities">
        <article><span className="system-index">A</span><h3>Load Spectrum</h3><p>A visual mismatch map across reading, attention, memory, density, visual complexity and motion.</p></article>
        <article><span className="system-index">B</span><h3>Decision Receipt</h3><p>Every transformation explains what changed, why it changed, and which safety boundaries were enforced.</p></article>
        <article><span className="system-index">C</span><h3>Recovery Session</h3><p>Dense material becomes a paced sequence with resumable chunks instead of a wall of information.</p></article>
      </section>

      <section className="final-cta">
        <div className="final-mark" aria-hidden="true">CLF</div>
        <div>
          <span className="eyebrow">The software adapts first.</span>
          <h2>Try the experience judges will see.</h2>
          <Link className="primary" href="/demo">Launch judge demo <span>↗</span></Link>
        </div>
      </section>
    </main>
  );
}
