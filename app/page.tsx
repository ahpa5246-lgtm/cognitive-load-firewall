import Link from "next/link";

export default function Home() {
  return (
    <main className="page-shell">
      <section className="hero">
        <div className="eyebrow">Adaptive cognitive accessibility</div>
        <h1>Your brain shouldn&apos;t have to fight the interface.</h1>
        <p className="hero-copy">Cognitive Load Firewall reshapes digital content around the preferences and limits you provide. It supports accessibility and recovery workflows; it does not diagnose concussion.</p>
        <div className="actions">
          <Link className="primary" href="/demo">Try the adaptive demo</Link>
          <Link className="secondary" href="/responsible-ai">Responsible AI</Link>
        </div>
      </section>
      <section className="comparison" aria-label="Before and after adaptation">
        <article className="panel noisy"><span className="label">Original</span><h2>Dense biology lesson</h2><p>Cellular respiration comprises a coordinated sequence of biochemical pathways, including glycolysis, pyruvate oxidation, the citric acid cycle, and oxidative phosphorylation, each involving substrates, enzymes, cofactors, regulatory checkpoints, and energy-transfer reactions.</p><p>Students are expected to retain the order of events, distinguish cellular compartments, compare aerobic and anaerobic conditions, and interpret ATP yield while connecting each phase to earlier metabolic concepts.</p></article>
        <article className="panel calm"><span className="label">Adapted</span><h2>Start with one idea</h2><p><strong>Cellular respiration</strong> is how cells release usable energy from food.</p><ol><li>First: glycolysis begins breaking down glucose.</li><li>Next: later stages extract more energy.</li><li>Open technical details when you are ready.</li></ol></article>
      </section>
    </main>
  );
}
