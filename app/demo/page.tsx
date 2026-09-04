"use client";
import Link from "next/link";
import { useState } from "react";
import { demoArtifact } from "@/lib/demo-data";
import { defaultTolerance, runAdaptation } from "@/lib/adaptation/pipeline";
import { ActionLink } from "@/app/ui";
import { LoadSpectrum } from "@/components/LoadSpectrum";
import { readProfile, writeProfile, type ProfilePreferences } from "@/lib/storage/profile-store";
import { adjustProfile, type FeedbackDifficulty } from "@/lib/profile/feedback";
import { addHistory } from "@/lib/storage/history-store";

type Result = ReturnType<typeof runAdaptation>;
const toTolerance = (profile: ProfilePreferences) => ({ reading: profile.readingTolerance, memory: profile.memoryLoadTolerance, attention: profile.attentionTolerance, visual: profile.visualLoadTolerance, motion: profile.motionTolerance, density: profile.informationDensityTolerance });
const toSpectrumPreference = (profile: ProfilePreferences) => ({ reading: profile.readingTolerance, memory: profile.memoryLoadTolerance, attention: profile.attentionTolerance, visual: profile.visualLoadTolerance, motion: profile.motionTolerance, density: profile.informationDensityTolerance });

export default function DemoPage() {
	const [content, setContent] = useState(demoArtifact.content);
	const [mode, setMode] = useState<"chunk" | "plain" | "guided">("chunk");
	const [view, setView] = useState<"adapted" | "original" | "difference">("adapted");
	const [result, setResult] = useState<Result>(() => runAdaptation({ content: demoArtifact.content, tolerance: defaultTolerance(), mode: "chunk" }));
	const [feedback, setFeedback] = useState<string | null>(null);
	const [profile, setProfile] = useState<ProfilePreferences>(() => readProfile());
	const [adjustment, setAdjustment] = useState<string | null>(null);
	function adapt() { setFeedback(null); setAdjustment(null); setResult(runAdaptation({ content, tolerance: toTolerance(profile), mode })); setView("adapted"); }
	function recordFeedback(label: string) { setFeedback(label); addHistory({ title: demoArtifact.title, mode, feedback: label }); const difficulty: FeedbackDifficulty | undefined = ({ "Much easier": undefined, "A little easier": undefined, "No difference": "too_much_at_once", Harder: "too_much_at_once" } as Record<string, FeedbackDifficulty | undefined>)[label]; if (difficulty) { const changed = adjustProfile(profile, difficulty); setProfile(changed.profile); writeProfile(changed.profile); setAdjustment(`${changed.adjustment.reason} Preference changed from ${changed.adjustment.previous} to ${changed.adjustment.next}. Adapt again to see the interface respond.`); } }
	return <main className="app-shell">
		<header className="topbar"><Link className="brand" href="/">Cognitive Load <span>Firewall</span></Link><nav aria-label="Main navigation"><Link href="/accessibility">Accessibility</Link><Link href="/responsible-ai">Responsible AI</Link></nav></header>
		<section className="demo-header"><div><div className="eyebrow">90-second demo / Maya</div><h1>Make one thing easier to process.</h1><p className="lede">A fictional study profile helps the interface choose a calmer starting point. These are personalization preferences, not clinical measurements.</p></div><div className="profile-chip"><strong>Maya</strong><span>Reading stamina {profile.readingTolerance} · Visual {profile.visualLoadTolerance} · Motion {profile.motionTolerance}</span></div></section>
		<section className="workspace" aria-label="Adapt content workspace">
			<div className="input-panel panel"><label htmlFor="content"><span className="label">01 / Content to adapt</span><textarea id="content" value={content} onChange={(event) => setContent(event.target.value)} /><span className="field-note">Pasted content stays in this demo session. Treat external content as untrusted data.</span></label><div className="mode-row"><span className="label">Adaptation mode</span><div className="segmented" role="group" aria-label="Adaptation mode">{([["chunk", "Chunk"], ["plain", "Plain language"], ["guided", "Guided steps"]] as const).map(([value, label]) => <button key={value} className={mode === value ? "selected" : ""} onClick={() => setMode(value)} aria-pressed={mode === value}>{label}</button>)}</div></div><button className="primary full" onClick={adapt}>Adapt this content <span aria-hidden="true">→</span></button></div>
			<div className="results-panel">{result.blocked ? <div className="safety-notice" role="alert"><span className="label">Safety pause</span><h2>Pause and seek urgent help.</h2><p>{result.safety.message} This tool cannot determine severity and will not provide productivity advice for this message.</p></div> : <>
				<div className="load-summary panel"><div><span className="label">02 / Interface Load Estimate</span><h2>{result.overallMismatch > 35 ? "A high mismatch is showing" : "A manageable mismatch is showing"}</h2><p>Experimental interface estimate. It helps choose presentation changes; it does not measure recovery.</p></div><div className="spectrum" aria-label={`Overall mismatch ${result.overallMismatch} out of 100`}><strong>{result.overallMismatch}</strong><span>mismatch</span></div></div>
				<LoadSpectrum load={result.load} preference={toSpectrumPreference(profile)} />
				<div className="metrics">{Object.entries(result.load).filter(([key]) => key !== "motion").map(([key, value]) => <div className="metric" key={key}><span>{key}</span><div className="meter"><i style={{ width: `${value}%` }} /></div><strong>{value}</strong></div>)}</div>
				<div className="view-tabs" role="tablist" aria-label="Content comparison">{(["original", "adapted", "difference"] as const).map((value) => <button key={value} onClick={() => setView(value)} className={view === value ? "active" : ""} role="tab" aria-selected={view === value}>{value}</button>)}</div>
				<article className={`content-view panel ${view === "adapted" ? "adapted" : ""}`}><span className="label">03 / {view === "original" ? "Original content" : view === "difference" ? "What changed" : "Adapted content"}</span>{view === "original" && <p>{content}</p>}{view === "adapted" && result.chunks.map((chunk, index) => <section className="chunk" key={`${chunk}-${index}`}><span className="chunk-number">{String(index + 1).padStart(2, "0")}</span><p>{chunk}</p>{index === 0 && <button className="text-button" onClick={() => setFeedback("simpler")}>Make this simpler</button>}</section>)}{view === "difference" && <><p><strong>Kept in view:</strong> the original meaning, numbers, dates, URLs, and safety directives remain available.</p><ul>{result.plan.strategies.map((item) => <li key={item.type}><strong>{item.type.replaceAll("_", " ")}</strong> because of {item.reason.replace("Mismatch", " preference mismatch").toLowerCase()}.</li>)}</ul></>}</article>
				<div className="aftercare panel"><div><span className="label">04 / Quick check-in</span><h2>Was this easier to process?</h2></div><div className="feedback-buttons">{["Much easier", "A little easier", "No difference", "Harder"].map((label) => <button key={label} onClick={() => recordFeedback(label)} className={feedback === label ? "selected" : ""}>{label}</button>)}</div>{feedback && <p className="confirmation" role="status">Thanks. Your preference was noted for this demo session.</p>}{adjustment && <p className="confirmation" role="status">{adjustment}</p>}<ActionLink href="/session" secondary>Start a recovery session</ActionLink></div>
				<details className="receipt panel"><summary>Why was this changed? <span>Decision receipt</span></summary><div className="receipt-grid"><p><strong>Provider</strong> {result.receipt.provider}</p><p><strong>Rules</strong> {result.receipt.rulesTriggered.length || "None"}</p><p><strong>Fidelity</strong> {result.fidelity.safe ? "Critical tokens preserved" : "Review original"}</p><p><strong>Safety</strong> Passed before adaptation</p><p><strong>Profile source</strong> {profile.source.replaceAll("_", " ")}</p><p><strong>Interface mismatch</strong> {result.overallMismatch}/100</p></div><p>{result.receipt.explanation}</p><p className="receipt-boundary"><strong>AI boundary:</strong> This system may change presentation, but it is not allowed to diagnose concussion, estimate recovery, or provide medical clearance.</p></details>
			</>}</div>
		</section>
	</main>;
}
