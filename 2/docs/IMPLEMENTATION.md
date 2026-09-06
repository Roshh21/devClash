# DevClash — Implementation Notes

This document tracks what currently exists in the codebase, what's mocked or placeholder, and
what's still unfinished. It reflects the actual code, not a plan.

## Current state

The project is a **frontend-only** React application. There is no backend, no database, and no
real authentication — everything visible is either static content or hand-written mock data.

### What works right now

- A public landing page at `/` with a sticky navbar, a hero section, a stat/feature strip, and a
  footer.
- A shared design system (colors, the glass-card surface, buttons, inputs, badges, tabs, a modal,
  skeleton loaders, a theme toggle) that every screen is built from, viewable on its own at
  `/styleguide`.
- Light and dark themes ("warm-cream" and "espresso") that switch instantly via a toggle in the
  navbar, persist across reloads (`localStorage`), and drive every color in the app through CSS
  variables — no component re-render is needed to re-theme.
- Scroll-triggered and hover animations (Framer Motion), including a shared page-transition
  wrapper used by every route, with automatic fallback to little/no animation when the browser's
  reduced-motion preference is on.
- A fully responsive layout from small mobile widths up through desktop, including a collapsible
  mobile navigation menu.

### Placeholder / not real yet

- `/signup` and `/login` render a generic "coming soon" screen. There is no signup or login form
  yet, and no accounts exist anywhere.
- The navbar's "Challenges", "Leaderboards", and "Pricing" links, and every footer link (About,
  Blog, Careers, Docs, Community, Support), are visual only — they don't go anywhere yet. Only
  "Features" (scrolls to the on-page feature strip), "Log in", and "Get Started" are functional.
- Any unmatched URL falls back to the same generic "coming soon" screen rather than a designed 404
  page.
- The favicon is a simple placeholder mark, not a finished brand asset.
- `.env.example` defines `VITE_API_BASE_URL`, but nothing in the app reads it — there is no
  network layer yet.
- The hero's "workspace" visual is a CSS/SVG mock of a code editor window (with a small floating
  quote card), not a photograph — no image assets are bundled with the project.

### Explicitly out of scope right now

- `backend/` — empty placeholder, no server code.
- `DevClash-Bank/` — empty placeholder, no content.
- Any database, real user accounts, or persisted data.

## Project structure

```
DevClash/
  frontend/            React app (implemented so far: landing page + shared design system)
    src/
      components/
        ui/            Theme-aware primitives: Button, Input, Badge, Card, Tabs, Modal,
                        Skeleton, ThemeToggle
        layout/        Navbar, Footer, PageTransition
        landing/       Hero, FeatureStrip, CodeWindowMock (landing-page-only sections)
      pages/           LandingPage, StyleGuidePage, ComingSoonPage
      store/           themeStore.js (Zustand — theme only, persisted to localStorage)
      lib/             motion.js (Framer Motion presets), useReducedMotion.js, utils.js
      styles/          tokens.css (design tokens), globals.css
  backend/             Empty placeholder — not started
  DevClash-Bank/       Empty placeholder — not started
  docs/
    IMPLEMENTATION.md  This file
```

## Design system

- All colors are CSS custom properties defined in `frontend/src/styles/tokens.css`, scoped under
  `[data-theme="dark"]` and `[data-theme="light"]`. Tailwind utility classes (`bg-accent`,
  `text-secondary`, `border-glass`, etc.) read from these variables via `tailwind.config.js`, so
  switching themes is a pure CSS variable swap.
- Translucent tints used for badges and icon chips (`--tint-accent`, `--tint-success`, etc.) are
  baked in as `rgba()` values per theme rather than relying on Tailwind's opacity-modifier syntax,
  which doesn't apply cleanly to custom CSS-variable-based colors.
- The "glass card" look (`Card` component, `src/components/ui/Card.jsx`) is: a translucent
  surface color, `backdrop-blur`, a 1px soft border, a soft shadow, and large rounded corners.
  Landing-page decorative panels (the hero's mock code window and its floating quote card) reuse
  this same `Card` component rather than duplicating the styling.
- Reusable animation variants live in `src/lib/motion.js`: fade-in, slide-up, a staggered-children
  container, hover-lift, tap-scale, and the page-transition wrapper used by every route. All of
  them shrink to near-zero duration automatically when `prefers-reduced-motion` is set.

## Routing

| Path            | Renders                            |
| --------------- | ----------------------------------- |
| `/`             | Landing page                        |
| `/styleguide`   | Design system reference page        |
| `/signup`       | "Coming soon" placeholder           |
| `/login`        | "Coming soon" placeholder           |
| anything else   | "Coming soon" placeholder           |

## Known limitations

- No automated tests yet.
- No backend calls anywhere — all content is hardcoded in components.
- Icons and copy are illustrative rather than final production copy.

## Running locally

```bash
cd frontend
npm install
npm run dev
```

Build for production: `npm run build` (output in `frontend/dist/`). Preview that build locally
with `npm run preview`.

## Verification performed

- `npm run build` completes with no errors.
- `npm run lint` (oxlint) reports 0 warnings / 0 errors.
- The production build was served locally (`vite preview`) and `/`, `/styleguide`, `/signup`, and
  an unmatched route all returned HTTP 200 with the expected page title.
- Manually reviewed every component for responsive breakpoints (mobile → desktop) and for both
  theme variants reading from the shared tokens.
