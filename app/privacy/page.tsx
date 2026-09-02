import { PageIntro, Shell } from "@/app/ui";

export default function PrivacyPage() {
  return <Shell><PageIntro eyebrow="Privacy" title="Share the accommodation, not the illness.">Demo mode keeps profile preferences and history in your browser. No account is required and no third-party tracker is used by the application.</PageIntro><section className="panel prose"><h2>Data minimization</h2><p>When PostgreSQL is configured, the product can store profiles, artifacts, adaptations, feedback, and receipts. Raw content should be retained only when the user chooses to save it.</p><h2>AI boundary</h2><p>The deterministic provider receives content only for the current transformation. Optional providers must be configured explicitly; secrets remain server-side.</p><h2>Your controls</h2><p>Use Settings to reset preferences and History to delete local adaptation history.</p></section></Shell>;
}
