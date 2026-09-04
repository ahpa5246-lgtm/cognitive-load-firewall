"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { defaultSettings, readSettings, writeSettings, type InterfaceSettings } from "@/lib/storage/settings-store";

const navigation = [
  { href: "/dashboard", label: "Workspace", index: "01" },
  { href: "/adapt", label: "Adapt", index: "02" },
  { href: "/history", label: "History", index: "03" },
  { href: "/accessibility", label: "Access", index: "04" },
];

const routeCodes: Record<string, string> = {
  "/dashboard": "01",
  "/adapt": "02",
  "/history": "03",
  "/accessibility": "04",
  "/onboarding": "05",
  "/accommodations": "06",
  "/profile": "07",
  "/settings": "08",
  "/responsible-ai": "AI",
  "/science": "RX",
  "/privacy": "00",
  "/session": "S",
};

function applySettings(settings: InterfaceSettings) {
  document.documentElement.dataset.calm = String(settings.calm);
  document.documentElement.dataset.large = String(settings.largeText);
  document.documentElement.dataset.contrast = String(settings.highContrast);
  document.documentElement.dataset.reduced = String(settings.reducedMotion);
}

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [settings, setSettings] = useState<InterfaceSettings>(defaultSettings);

  useEffect(() => {
    const current = readSettings();
    setSettings(current);
    applySettings(current);
  }, []);

  useEffect(() => {
    if (settings.reducedMotion || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const move = (event: PointerEvent) => {
      document.documentElement.style.setProperty("--cursor-x", `${event.clientX}px`);
      document.documentElement.style.setProperty("--cursor-y", `${event.clientY}px`);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [settings.reducedMotion]);

  function toggleCalm() {
    const next = writeSettings({ ...settings, calm: !settings.calm });
    setSettings(next);
    applySettings(next);
  }

  const code = routeCodes[pathname] ?? "CLF";

  return (
    <main className="app-shell experience-shell">
      <header className="topbar">
        <Link className="brand" href="/" aria-label="Cognitive Load Firewall home">
          Cognitive Load <span>Firewall</span>
        </Link>
        <nav aria-label="Main navigation">
          {navigation.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link key={item.href} href={item.href} className={active ? "active" : ""} aria-current={active ? "page" : undefined}>
                <b aria-hidden="true">{item.index}</b>{item.label}
              </Link>
            );
          })}
          <button className="quiet-toggle" onClick={toggleCalm} aria-pressed={settings.calm}>
            {settings.calm ? "Calm / on" : "Calm / off"}
          </button>
        </nav>
      </header>

      <div className="shell-meta" aria-hidden="true">
        <span><strong>CLF</strong> / adaptive access layer / route {code}</span>
        <span className="live">interface responsive</span>
      </div>

      <div key={pathname} className="route-stage" data-route={pathname} data-code={code}>
        {children}
      </div>
    </main>
  );
}

export function PageIntro({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section className="narrow experience-intro">
      <div className="eyebrow">{eyebrow}</div>
      <h1>{title}</h1>
      <p className="lede">{children}</p>
    </section>
  );
}

export function ActionLink({ href, children, secondary = false }: { href: string; children: React.ReactNode; secondary?: boolean }) {
  return <Link className={secondary ? "secondary" : "primary"} href={href}>{children}</Link>;
}
