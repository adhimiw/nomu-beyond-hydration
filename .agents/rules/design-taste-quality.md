# Design Taste & Anti-Slop Quality Rules

Follow these rules on every build, redesign, restyle, or polish of websites and interfaces. The goal is crafted, intentional design with genuine art direction, free from generic AI-generated tropes.

## 1. Zero AI Slop / House Rules
- **Headlines: Two lines or fewer at all viewport widths.** Cut words first; widen measure second; size last.
- **No eyebrow tags / chips**: Do not put small uppercase tracked-out labels or "New ·" pill badges above headlines.
- **No assistant palette**: Avoid the ubiquitous Claude warm cream (#F4F1EA) + terracotta/rust (#D97757) and violet/indigo presets unless specifically asked.
- **No decorative gradients or glassmorphism**: Use flat color, tone steps, or real photographs. No backdrop blur panels or floating pill navbars.
- **No identical card grids**: Replace identical icon-topped card rows with asymmetric, varied section blueprints suited to the content.
- **No monospace outside code**: Use standard typography; tabular figures where numbers align.
- **No fake dashboard grey bars or invented metrics**: Real interface fragments, real screenshots, or genuine content.
- **No styled accent word**: Do not randomly italicize or recolor a single word in a headline.
- **Two typefaces maximum**: Usually one high-quality family with clear scale and intentional weights.

## 2. Real Imagery & Grounding
- Open with the subject's world: real photography, authentic interface fragments, or archival images from open collections (using `assets.mjs`).
- Never fake product shots. A found picture illustrates the world around the subject and is honestly credited in the footer.

## 3. Measurable Quality Gate
- Before considering any UI complete, verify with `node .agents/skills/design-taste-frontend/scripts/inspect.mjs <url-or-file>`.
- Fix all `FAIL` items and defend any `WARN` items.
- Ensure the first screen communicates who/what this is within 5 seconds of viewing.
