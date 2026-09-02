# Hackathon Submission Draft

## Project
Cognitive Load Firewall

## Tagline
Your brain shouldn't have to fight the interface.

## Problem
Digital interfaces usually assume stable attention, visual tolerance, reading stamina, and working-memory capacity. During concussion recovery or temporary cognitive overload, that assumption can make ordinary learning and online tasks unnecessarily difficult.

## Solution
Cognitive Load Firewall analyzes load characteristics of digital content, compares them with user-selected tolerance preferences, and adapts the interface/content rather than asking the person to keep adapting to the interface.

## Innovation
The product changes the **adaptation target** from the recovering person to the digital environment.

## Responsible AI
The architecture separates deterministic safety and fidelity checks from optional generative-AI transformations.

## Working demo
The judge path runs without credentials: onboarding preferences, Maya's content adaptation, Load Estimate, Original/Adapted/Difference views, feedback-driven local personalization, Recovery Session with optional speech, Decision Receipt, and accommodation card.

## Safety and privacy
Emergency-like input and medical clearance questions stop normal adaptation. Critical numbers, dates, directives, units, percentages, URLs, and email addresses are checked before output. Guest preferences and history stay local; PostgreSQL persistence is enabled only when configured.

## Accessibility and design
The quiet visual system includes semantic controls, visible focus, reduced-motion support, larger text, high contrast, keyboard navigation, screen-reader labels, and no color-only status.

## Render
The workflow contract supports a local runner for the credential-free demo and a real Render HTTP runner when `WORKFLOW_PROVIDER=render` and `RENDER_WORKFLOW_URL` are configured. Hosting alone is not presented as workflow integration.
