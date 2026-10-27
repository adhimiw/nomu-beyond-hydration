# Design Direction (`DESIGN.md`)

> **Contract for AI Agents**: This file defines the visual, aesthetic, and structural direction for the website. Anti-slop and taste-skill require this file to avoid producing generic or monotonous output. Modify this file to set the character of your project.

---

## 1. Subject & Identity
- **Project Name**: Modern Web Experience
- **Brief / Purpose**: High-performance, beautifully art-directed web application and landing experience.
- **Audience**: Modern web users, design enthusiasts, and product evaluators seeking fast, accessible, and intentional design.
- **Tone**: Bold, crafted, responsive, and editorial (clean structure with decisive typographic contrast).

---

## 2. Palette & Proportions
*Adhere to strict contrast ratios (WCAG 2.2 AA >= 4.5:1 for body).*

- **Ground (Background)**: `#0D1117` (Deep Slate / Dark Mode) or `#FDFDFD` (Clean Studio Light)
- **Surface / Cards**: Tone step from Ground, separated by contrast rather than heavy drop shadows.
- **Ink (Text)**: High contrast, readable (`#F0F6FC` on dark, `#111827` on light). Never soft-grey body copy.
- **Primary Accent**: Decisive accent (e.g. `#2563EB` or `#10B981` or custom brand color), used with restraint on primary actions and focus indicators.
- **Muted Text / Meta**: `#8B949E` (ensuring >= 4.5:1 ratio against ground).

---

## 3. Typography & Hierarchy
- **Primary Family**: System UI / Modern Sans (`Inter`, `system-ui`, `-apple-system`, `sans-serif`)
- **Display / Heading Family**: Distinctive display or confident geometric grotesque
- **Scale**:
  - `Display / Hero`: `clamp(2.5rem, 6vw, 4.5rem)` (Two lines or fewer at all viewport widths!)
  - `H2 (Section)`: `clamp(1.75rem, 3.5vw, 2.5rem)`
  - `H3 (Sub-heading)`: `1.25rem`–`1.5rem`
  - `Body`: `1rem` (16px) with line-height `1.5`–`1.6`
  - `Caption / Meta`: `0.875rem` (14px)

---

## 4. Visual Devices & Anti-Patterns
- **Allowed**:
  - Clean spatial rhythm (120px–240px section gaps on desktop, 60px–80px on mobile).
  - High-quality authentic imagery, photography, and live interactive UI components.
  - Subtle, purpose-driven micro-interactions (< 250ms ease).
- **Prohibited (Strictly Filtered by Anti-Slop)**:
  - No generic AI SaaS cards with identical icons in colored rounded squares.
  - No tracked uppercase eyebrow chips (`NEW FEATURE`, `AI-POWERED`).
  - No rainbow gradients, ambient glow blobs, or glassmorphic blur panels.
  - No fake metrics (e.g. "99.999% Synergy AI Productivity") or fabricated testimonials.
  - No emoji used as navigation icons.

---

## 5. Signature Interactive Moment
- One memorable, authentic interactive feature on the page (e.g., live configuration preview, real-time responsive component inspector, interactive palette preview).
