"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export function Shell({ children }: { children: React.ReactNode }) {
  const [calm, setCalm] = useState(false);
  useEffect(() => setCalm(localStorage.getItem("clf-calm") === "true"), []);
  function toggleCalm() { const next = !calm; setCalm(next); localStorage.setItem("clf-calm", String(next)); document.documentElement.dataset.calm = String(next); }
  return <main className="app-shell"><header className="topbar"><Link className="brand" href="/">Cognitive Load <span>Firewall</span></Link><nav aria-label="Main navigation"><Link href="/dashboard">Workspace</Link><Link href="/adapt">Adapt</Link><Link href="/history">History</Link><Link href="/accessibility">Accessibility</Link><button className="quiet-toggle" onClick={toggleCalm} aria-pressed={calm}>{calm ? "Calm on" : "Calm mode"}</button></nav></header>{children}</main>;
}
export function PageIntro({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) { return <section className="narrow"><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p className="lede">{children}</p></section>; }
export function ActionLink({ href, children, secondary = false }: { href: string; children: React.ReactNode; secondary?: boolean }) { return <Link className={secondary ? "secondary" : "primary"} href={href}>{children}</Link>; }
