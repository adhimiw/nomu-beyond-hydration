# UI/UX & Accessibility Standards

Follow these guidelines for all web interface components, forms, navigation, and user interaction patterns.

## 1. Accessibility (WCAG 2.2 AA Mandatory)
- **Color Contrast**: Normal text >= 4.5:1 against background. Large text (>=18pt or bold >=14pt) >= 3.0:1. Verify with `python3 .agents/skills/antislop-human/contrast-check.py <fg> <bg>`.
- **Keyboard Navigation**: All interactive elements (links, buttons, form controls, modals) must be operable via Tab/Shift+Tab and Enter/Space with a clear, visible focus outline (never `outline: none` without replacement).
- **Touch Targets**: Minimum interactive target area is 44×44px on mobile/touch interfaces, with at least 8px spacing.
- **Labels & Forms**: Never rely on placeholder text alone. Provide explicit `<label>` tags with matching `for`/`id` or `aria-label` / `aria-labelledby`.
- **Images**: All informational images must include descriptive `alt` text. Purely decorative images must use `alt=""` and `aria-hidden="true"`.

## 2. Responsive Layout & Motion
- Mobile-first approach. Ensure zero unintended horizontal scrolling at viewport widths 320px–1920px.
- Use fluid typography and spacing tokens.
- Respect `prefers-reduced-motion`: always provide reduced motion CSS transitions that retain functionality without disorienting movement.
- Keep Cumulative Layout Shift (CLS) < 0.1 by reserving image/media dimensions with aspect-ratio or explicit width/height.
