# Website Development Project with Unified AI Skills

A modern, production-grade website engineering workspace equipped with an elite toolkit of AI skills, art direction engines, design intelligence, and deterministic workflow rules.

Integrated from:
- [Gentleman-Programming/gentle-ai](https://github.com/Gentleman-Programming/gentle-ai)
- [leonxlnx/taste-skill](https://github.com/leonxlnx/taste-skill)
- [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)
- [miqdadbadjuber/anti-slop](https://github.com/miqdadbadjuber/anti-slop)
- [cathrynlavery/diagram-design](https://github.com/cathrynlavery/diagram-design)
- [blendi-remade/dioramas](https://github.com/blendi-remade/dioramas)
- [Snyk: Top Claude Skills for UI/UX Engineers](https://snyk.io/articles/top-claude-skills-ui-ux-engineers/)

---

## Workspace Structure

```text
website-development/
├── .agents/
│   ├── rules/
│   │   ├── antislop.md                 # Core anti-slop rules
│   │   ├── engineering-workflow.md     # Gentle-AI work-unit commits & hygiene
│   │   ├── design-taste-quality.md     # Taste-Skill house rules & craft laws
│   │   └── ui-ux-standards.md          # WCAG 2.2 AA & interaction standards
│   └── skills/                         # Canonical skills library (40+ skills)
├── .claude/
│   └── skills -> ../.agents/skills     # Direct symlink for Claude Code
├── skills -> .agents/skills            # Direct symlink for Cursor, Windsurf, OpenCode
├── AGENTS.md                           # Universal agent index and workflow triggers
├── GEMINI.md                           # Antigravity/Gemini agent index
├── DESIGN.md                           # Project visual direction contract
├── index.html                          # Semantic, accessible HTML starter
├── package.json                        # Development and skill runner scripts
├── src/
│   ├── main.js                         # Accessible interactive logic
│   └── style.css                       # Fluid typography & contrast tokens
└── vite.config.js                      # Vite server config
```

---

## Integrated Skills Catalog

### 1. Anti-Slop (`miqdadbadjuber/anti-slop`)
Stops AI from outputting generic SaaS cards, fake testimonials, gradient blobs, and repetitive AI tells:
- `antislop`: Core filter. Always active.
- `antislop-ui`: Visual anti-slop rules (colors, layouts, component variety).
- `antislop-copywriting`: Real, human-sounding copy without hype or corporate fluff.
- `antislop-human`: Accessibility, contrast checking, and keyboard operability.
- `antislop-layoutmobile`: Mobile-first responsive rules, zero horizontal overflow.
- `antislop-code`: Clean code without redundant AI comments.

### 2. Taste-Skill (`leonxlnx/taste-skill`)
Art direction distilled from 247 award-winning websites with automated browser inspection:
- `design-taste-frontend` (`taste-skill`): Art direction engine with `draw.mjs` (deals directions, palettes, and section blueprints) and `inspect.mjs` (headless browser quality gate).

### 3. UI/UX Pro Max (`nextlevelbuilder/ui-ux-pro-max-skill`)
Instant, searchable local design intelligence database:
- `ui-ux-pro-max`: Query styles, palettes, font pairings, charts, and UX guidelines with zero network calls via `search.py`.
- `ui-styling`: CSS / Tailwind / layout implementations.
- `design-system`: Spacing scales, color tokens, and design contracts.
- `design`: General UX/UI rules.
- `brand`: Brand identity and palette guidelines.
- `banner-design` & `slides`: Graphic and presentation assets.

### 4. Gentle-AI (`Gentleman-Programming/gentle-ai`)
Deterministic engineering framework for agents:
- `work-unit-commits`: Single-purpose commits keeping code, tests, and docs together (< 400 lines).
- `branch-pr` & `chained-pr`: Clean PR creation and stacked PR reviews.
- `cognitive-doc-design`: Documentation structured to minimize cognitive load.
- `issue-root-resolution`: Deep root-cause debugging over temporary symptom patches.
- `systemic-issue-triage`: Bug triage, diagnosis, and resolution.
- `skill-creator` & `skill-improver`: Creating and testing custom agent skills.

### 5. Snyk Top UI/UX Engineer Skills
- `frontend-design` (Anthropic): High-craft aesthetic guidance avoiding templated defaults.
- `web-design-guidelines` (Vercel): Web Interface Guidelines compliance audit.
- `react-best-practices` (Vercel): 70 rules for React and Next.js performance.
- `composition-patterns` (Vercel): React component composition.
- `react-view-transitions` (Vercel): Smooth CSS/React view transitions.
- `accessibility-audit`, `accessibility-inspect`, `accessibility-fix`, `accessibility-scan` (AccessLint): Comprehensive WCAG 2.2 AA/AAA testing.
- `bencium-innovative-ux-designer` (Bencium): Typography-led, distinct visual languages.

### 6. Diagram Design (`cathrynlavery/diagram-design`)
Create editorial-grade diagrams and schematics with an integrated design system:
- `diagram-design`: 45 diagram types (architecture, flowcharts, sequences, data flow, Gantt, Venn, Sankey, mindmaps) as self-contained SVG/HTML with verification tools (`self_check.py`, `export_svg.py`, `drawio_extract.py`).

### 7. Dioramas 3D Web (`blendi-remade/dioramas`)
Cinematic 3D landing page framework:
- `dioramas-3d-web` (`dioramas`): Three.js r186, N8AO ambient occlusion, GSAP/Lenis camera choreography, planar reflections, and HDR post-processing stack. Includes full `core/` engine modules and 20 world briefs.

---

## Flagship Showcase: NOMU — Beyond Hydration 3D Experience

An interactive 3D WebGL product showcase designed for **NOMU** ([@drinkitnomu](https://www.instagram.com/drinkitnomu/)), Japanese-inspired functional electrolyte tonics crafted with cold-pressed Tokushima botanicals and gut prebiotics.

### Features
- **3D Glass Bottle Architecture**: Real-time WebGL rendering with Three.js featuring continuous `LatheGeometry` borosilicate glass chassis (`transmission: 0.94`, `ior: 1.52`), inner liquid core with volumetric absorption, effervescence micro-bubbles, and white ribbed screw cap.
- **Authentic Brand Identity**: Extracted directly from official Instagram posts:
  - Authentic Katakana brushmark logomark (`nomu_logo_clean.png`)
  - Authentic geometric Japanese typography wordmark (`nomu_wordmark_transparent.png`)
  - Framed Kanji badges (`野武` for Golden Yuzu, `姫` for Peach Sencha, `紫` for Shiso Berry)
- **Interactive Diorama Modes**:
  - `360° Rotate`: Smooth turntable orbit with inertia drag and gyro parallax.
  - `Frost Drops`: Micro-droplet condensation bump map across the glass body.
  - `Layer Anatomy`: Exploded view separating cap, tamper seal, washi label, and liquid core.
- **Antigravity Studio Photography**: Ultra-high-fidelity commercial photoshoot generated with Antigravity subagent (`nomu_hero_studio.jpg`).
- **Archival Dispatch Feed**: Curated gallery of real `@drinkitnomu` photography from the Tokyo tasting room.
- **Zero AI Slop & High Taste**: 0 FAILs on `taste:lint`, 18.23:1 text contrast ratio, accessible keyboard navigation, and custom drawer cart.

---

## Quickstart Commands

```bash
# Start local development server
npm run dev

# Deal an art direction for a SaaS / Portfolio / Product
npm run taste:draw -- --sector saas --brief "Next-generation developer tool" --options 3

# Search UI/UX design intelligence (styles, UX guidelines, colors, fonts)
npm run uiux:search -- "minimalist dashboard" --domain style
npm run uiux:search -- "form validation" --domain ux

# Check WCAG 2.2 color contrast
npm run a11y:contrast -- "#FFFFFF" "#0D1117"

# Run browser inspection gate
npm run taste:inspect -- index.html

# Verify diagram HTML files
npm run diagram:check -- path/to/diagram.html
```
