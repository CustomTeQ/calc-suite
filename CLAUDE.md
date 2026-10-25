# Calc Suite — Project Guide for Claude

React 19 + TypeScript + Vite + Tailwind CSS v4, wrapped with Capacitor for Android.
Source in `src/` (`pages/`, `components/ui`, `components/layout`, `components/charts`,
`hooks/`, `routes/`, `context/`, `utils/`). Global styles in `src/index.css`.

- Dev: `npm run dev` · Build: `npm run build` (runs `tsc -b` then Vite) · Lint: `npm run lint`
- Always run `npm run lint` and `npm run build` before considering UI work done.

## Design system — Apple-inspired, applies to ALL UI

Adapted from Emil Kowalski's `apple-design` + `animate` skills. These are the house
rules for every screen, component, and artifact built in or for this project. Follow
them unless the user's explicit instruction for a given task overrides them.

### Motion
- **Interruptibility is the priority.** Never block input during a transition. A new
  animation starts from the element's *current* value, not from the target. Gesture- or
  pointer-driven motion must be grabbable and reversible mid-flight.
- **Animate only `transform` and `opacity`.** Never animate layout/paint properties
  (width, height, top/left, margin, color→use opacity-layered fills). Add `will-change`
  only where motion is imminent; drive continuous motion with `requestAnimationFrame`.
- **Gate motion by frequency.** Frequent actions (navigation, typing, anything done many
  times a day) get little or no motion. Save expressive motion for rare/first-time moments.
  Every animation needs a named purpose (feedback, spatial continuity, state change,
  preventing a jarring jump, delight). Data the user is reading never moves for style.
- **Timing & easing.** UI transitions stay **under 300ms**. `ease-out` for enter/exit,
  `ease-in-out` for on-screen moves, `ease` for hover/color. **Never `ease-in` on UI,
  never `transition: all`, never `scale(0)` entrances** (start ~0.95–0.97 + `opacity:0`).
  Prefer spring-like curves for anything that should feel alive, e.g.
  `cubic-bezier(0.22, 1, 0.36, 1)`; keep bounce subtle, only after momentum gestures.
- **Spatial consistency.** Elements exit along the path they entered. Popovers, menus,
  dropdowns, tooltips anchor to their trigger via `transform-origin`; modals stay centered.
- Entrances resolve to a visible resting state — never leave content at `opacity:0`
  waiting on an observer. Stagger groups; never fire everything at once.

### Materials & depth ("liquid glass")
- Use translucent layers — `backdrop-filter: blur(...)` over a semi-transparent token
  background — so content reads through. Heavier blur marks structure; lighter marks
  interactive surfaces. Keep text contrast high over glass. Prefer edge fades to hard
  dividers. Animate blur + scale together when a material enters/exits.

### Color & theme
- Define **every** color as a CSS/Tailwind token; no literal colors inside component
  rules. Support light + dark: tokens on `:root`, dark overrides under both
  `@media (prefers-color-scheme: dark)` (guarded `:root:not([data-theme="light"])`) and
  `:root[data-theme="dark"]`, with `color-scheme` set so native controls follow.
- Neutrals carry a slight hue bias toward the accent — never a flat mid-grey. Put bold
  color in one place and keep the surrounding surface quiet.

### Typography
- System font stack by default (`-apple-system, BlinkMacSystemFont, "Segoe UI", ...`).
  Tracking tighter as size grows (≈ -0.02em on large display), near zero for body; leading
  decreases as size increases. Build hierarchy with weight + size + leading together.
  Body measure ≈ 65ch, headings `text-wrap: balance`. Numeric columns use
  `font-variant-numeric: tabular-nums` (important for a calculator app).

### Interaction & feedback
- Respond on pointer-*down*, not release; remove artificial latency/tap delays.
- Direct manipulation stays 1:1 with the pointer (Pointer Events + pointer capture).
- Visible, non-color-only focus states for keyboard users.
- Give every action clear status/completion/error feedback; errors say what went wrong
  and how to fix it. Labels are specific ("Calculate", not "Submit"). Undo over confirms.

### Accessibility (non-negotiable)
- Honor `prefers-reduced-motion` (cross-fade instead of slide/spring — gentler, not zero),
  `prefers-reduced-transparency` (more opaque surfaces), `prefers-contrast: more`.
- Gate hover-motion to fine pointers. Maintain WCAG contrast in both themes.

### Never ship
`transition: all` · `scale(0)` entrances · `ease-in` on UI · keyframes on toasts/toggles ·
animating layout properties · ungated hover motion · missing reduced-motion handling ·
colors defined only inside a theme block · lorem ipsum.

> Source skills: https://github.com/emilkowalski/skills (`apple-design`, `animate`).
> Install locally with `npx skills@latest add emilkowalski/skills` if using the skills CLI.
