"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { defaultSettings, readSettings, writeSettings, type InterfaceSettings } from "@/lib/storage/settings-store";

export function Shell({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<InterfaceSettings>(defaultSettings);
  useEffect(() => { const current = readSettings(); setSettings(current); document.documentElement.dataset.calm = String(current.calm); }, []);
  function toggleCalm() { const next = writeSettings({ ...settings, calm: !settings.calm }); setSettings(next); document.documentElement.dataset.calm = String(next.calm); }
  const surfaceStyle = { fontSize: settings.largeText ? "1.1rem" : undefined, backgroundColor: settings.calm ? "#eef2e9" : undefined, color: settings.highContrast ? "#0b1710" : undefined };
  return <main className="app-shell" style={surfaceStyle}><header className="topbar"><Link className="brand" href="/">Cognitive Load <span>Firewall</span></Link><nav aria-label="Main navigation"><Link href="/dashboard">Workspace</Link><Link href="/adapt">Adapt</Link><Link href="/history">History</Link><Link href="/accessibility">Accessibility</Link><button className="quiet-toggle" onClick={toggleCalm} aria-pressed={settings.calm}>{settings.calm ? "Calm on" : "Calm mode"}</button></nav></header>{children}</main>;
}
export function PageIntro({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) { return <section className="narrow"><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p className="lede">{children}</p></section>; }
export function ActionLink({ href, children, secondary = false }: { href: string; children: React.ReactNode; secondary?: boolean }) { return <Link className={secondary ? "secondary" : "primary"} href={href}>{children}</Link>; }
