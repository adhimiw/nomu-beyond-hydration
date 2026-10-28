# Project Agent Configuration & Skills Index

Welcome to this website development workspace. This project is configured with a unified suite of elite design, engineering, anti-slop, and accessibility skills.

Before starting any design, coding, or refactoring task, read the relevant skill instructions and follow the project rules.

---

## The 5 Pillars of this Project

1. **Anti-Slop** (`miqdadbadjuber/anti-slop`): Eliminates generic AI tropes, boilerplate SaaS layouts, fake metrics, and repetitive styling patterns.
2. **Taste-Skill** (`leonxlnx/taste-skill`): Art direction engine distilled from 247 award-winning websites with automated browser inspection.
3. **UI/UX Pro Max** (`nextlevelbuilder/ui-ux-pro-max-skill`): Searchable local design intelligence database covering 79 styles, 192 color palettes, 74 font pairings, and 119 UX guidelines.
4. **Gentle-AI** (`Gentleman-Programming/gentle-ai`): Deterministic engineering environment with work-unit commits, cognitive load reduction, and PR staging.
5. **Top UI/UX Engineering Skills** (`snyk.io/articles/top-claude-skills-ui-ux-engineers/`):
   - **Anthropic Frontend Design**: Creative lead guidance for distinctive, authentic aesthetics.
   - **Vercel Guidelines & React Best Practices**: 70 rules for optimal React/Next.js performance and composition patterns.
   - **AccessLint Accessibility Suite**: Automated and manual WCAG 2.2 AA/AAA accessibility audits.
   - **Bencium UX Designer**: Typography-led, human-centered innovative UX design.
6. **Editorial Visuals & 3D Immersion**:
   - **Diagram Design** (`cathrynlavery/diagram-design`): 45 visual diagram and schematic formats rendered as self-contained SVG/HTML.
   - **Dioramas** (`blendi-remade/dioramas`): Cinematic 3D landing page framework (Three.js r186, N8AO, GSAP, Lenis, AgX tone mapping).

---

## Active Skills Index

| Skill Name | Pillar / Source | When to Trigger / Description |
|---|---|---|
| `antislop` | Anti-Slop | **Always active**. Core filter against generic AI aesthetics and slop. |
| `antislop-ui` | Anti-Slop | Building or styling visual UI (color, layout, components, motion). |
| `antislop-copywriting` | Anti-Slop | Drafting headlines, CTAs, value propositions, and web copy. |
| `antislop-human` | Anti-Slop | Ensuring accessibility, contrast (4.5:1), keyboard focus, states. |
| `antislop-layoutmobile` | Anti-Slop | Mobile-first responsiveness, viewport breakpoints, zero horizontal overflow. |
| `antislop-code` | Anti-Slop | Eliminating AI-slop comments and keeping meaningful code documentation. |
| `design-taste-frontend` (`taste-skill`) | Taste Skill | Full art direction runbook, direction dealing (`draw.mjs`), and browser inspector (`inspect.mjs`). |
| `ui-ux-pro-max` | UI/UX Pro Max | Querying styles, palettes, font pairings, charts, and UX guidelines via `search.py`. |
| `ui-styling` | UI/UX Pro Max | Stack-specific CSS, Tailwind, responsive layout patterns. |
| `design-system` | UI/UX Pro Max | Token architecture, spacing scales, and design system contracts. |
| `frontend-design` | Anthropic | Opinionated aesthetic direction, avoiding generic defaults. |
| `web-design-guidelines` | Vercel | Auditing UI against official Web Interface Guidelines. |
| `react-best-practices` | Vercel | Performance optimization for React/Next.js (waterfalls, bundle size, re-renders). |
| `composition-patterns` | Vercel | Clean component composition patterns in React. |
| `react-view-transitions` | Vercel | Smooth, accessible page view transitions. |
| `accessibility-audit` | AccessLint / Snyk | Full WCAG 2.2 AA/AAA audit following WCAG-EM methodology. |
| `accessibility-inspect` | AccessLint / Snyk | Manual verification of keyboard focus, screen readers, and interactive states. |
| `accessibility-fix` | AccessLint / Snyk | Targeted fixes for accessibility defects. |
| `bencium-innovative-ux-designer`| Bencium / Snyk | Distinctive typography-only exploratory design directions. |
| `work-unit-commits` | Gentle-AI | Splitting implementation into deliverable, single-purpose commits (< 400 lines). |
| `chained-pr` / `branch-pr` | Gentle-AI | Reviewable stacked PR workflows. |
| `cognitive-doc-design` | Gentle-AI | Designing documentation that minimizes reviewer cognitive fatigue. |
| `systemic-issue-triage` | Gentle-AI | Root cause triage and systematic bug resolution. |
| `diagram-design` | Diagram Design | Rendering 45 editorial diagram types (architecture, flow, sequence, mindmap, Gantt) as SVG/HTML. |
| `dioramas-3d-web` (`dioramas`) | Dioramas 3D | Cinematic 3D landing pages with Three.js r186, N8AO, GSAP, Lenis, and postprocessing. |
| `gravitas` | Gravitas | Engineering reliability runtime: grounded edits, declared scope, post-mutation verification, and 6 invariants. |
| `gravitas-highstakes` | Gravitas | Tier-2 checkpoint protocol for irreversible/high-risk migrations and deletions. |
| `gravitas-typescript` | Gravitas | Strict TypeScript recon, boundary contracts, and test verification. |
| `gravitas-python` | Gravitas | Python environment recon, type checks (mypy/pyright), and pytest suites. |

---

## Agent Operating Workflow

When developing or modifying this website:

```
[1. Brief & Context]
       │
       ▼
[2. Check DESIGN.md] ──► (Ensure brand personality, palette, and typography are defined)
       │
       ▼
[3. Art Direction] ────► (Use `draw.mjs` or `search.py` for section blueprints & tokens)
       │
       ▼
[4. Implementation] ───► (Mobile-first, clean semantic HTML, fluid typography, no AI slop)
       │
       ▼
[5. Verification Gate] ─► (Run `inspect.mjs`, `contrast-check.py`, and accessibility audit)
       │
       ▼
[6. Work-Unit Commit] ──► (Deliver single-purpose, fully tested commit with Conventional Commit msg)
```

### CLI Helper Commands

- **Deal Art Direction**:
  ```bash
  node .agents/skills/design-taste-frontend/scripts/draw.mjs --sector saas --brief "Your website brief" --options 3
  ```
- **Inspect Built Website in Headless Browser**:
  ```bash
  node .agents/skills/design-taste-frontend/scripts/inspect.mjs index.html
  ```
- **Search UI/UX Intelligence**:
  ```bash
  python3 .agents/skills/ui-ux-pro-max/scripts/search.py "query" --domain style
  python3 .agents/skills/ui-ux-pro-max/scripts/search.py "query" --domain ux
  ```
- **Check Color Contrast**:
  ```bash
  python3 .agents/skills/antislop-human/contrast-check.py "#FFFFFF" "#0D1117"
  ```
