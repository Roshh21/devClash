# DevClash — Implementation Notes

This document tracks what currently exists in the codebase, what's mocked or placeholder, and
what's still unfinished. It reflects the actual code, not a plan.

## Current state

The project is a **frontend-only** React application. There is no backend, no database, and no
real authentication — everything visible is either static content or hand-written mock data.

### What works right now

- A public landing page at `/` with a sticky navbar, a hero section, a stat/feature strip, and a
  footer.
- A shared design system (colors, the glass-card surface, buttons, inputs, checkboxes, badges,
  tabs, a modal, skeleton loaders, a theme toggle) that every screen is built from, viewable on
  its own at `/styleguide`.
- Light and dark themes ("warm-cream" and "espresso") that switch instantly via a toggle in the
  navbar, persist across reloads (`localStorage`), and drive every color in the app through CSS
  variables — no component re-render is needed to re-theme.
- Login and signup screens at `/login` and `/signup` — one shared card with animated Log In / Sign
  Up tabs, email/password (plus username and confirm-password on signup), a show/hide password
  toggle, a "remember me" checkbox on login and a terms checkbox on signup, inline client-side
  validation (empty fields, email format, password length, password match), and three inert
  "continue with" social buttons. Submitting a valid form shows a short loading state and then an
  inline "coming soon" notice — nothing is created or persisted.
- An authenticated app shell at `/app/*`: a sidebar (10 nav items) that collapses to icon-only on
  desktop and becomes a slide-in drawer with backdrop on mobile, a topbar with a (non-functional)
  search field, a notification bell linking to the notifications screen, and an avatar menu
  (Settings link + a "Log out" link that just returns to the homepage, since there's no real
  session to end). The active nav item is highlighted, and every nav item routes to a themed
  "coming soon" placeholder screen. A hardcoded mock user ("Roshni") stands in for a real logged-in
  account.
- Scroll-triggered and hover animations (Framer Motion), including a shared page-transition
  wrapper used by every route and a separate inner transition for content inside the app shell, so
  navigating between sidebar items animates just the content area, not the whole shell. Everything
  falls back to little/no animation when the browser's reduced-motion preference is on.
- A fully responsive layout from small mobile widths up through desktop everywhere above.

### Placeholder / not real yet

- Login and signup don't create or check accounts — see above. Social login buttons show a
  "coming soon" notice instead of doing anything.
- The `/app/*` shell is a standalone area reachable only by typing the URL — it is intentionally
  **not** linked from `/login` or `/signup` yet, since connecting real auth to the app shell is
  later work. The mock "Roshni" user is hardcoded, not read from anywhere.
- Every `/app/*` screen (Dashboard, Quick Play, Practice, Team Mode, Challenges, Rankings, Friends,
  Statistics, Notifications, Settings) is the same generic "coming soon" placeholder — none of
  them have real content yet.
- The navbar's "Challenges", "Leaderboards", and "Pricing" links, and every footer link (About,
  Blog, Careers, Docs, Community, Support), are visual only — they don't go anywhere yet. Only
  "Features" (scrolls to the on-page feature strip), "Log in", and "Get Started" are functional.
- Any unmatched URL falls back to a generic "coming soon" screen rather than a designed 404 page.
- The favicon is a simple placeholder mark, not a finished brand asset.
- `.env.example` defines `VITE_API_BASE_URL`, but nothing in the app reads it — there is no
  network layer yet.
- The hero's "workspace" visual is a CSS/SVG mock of a code editor window (with a small floating
  quote card), not a photograph — no image assets are bundled with the project.

### Explicitly out of scope right now

- `backend/` — empty placeholder, no server code.
- `DevClash-Bank/` — empty placeholder, no content.
- Any database, real user accounts, sessions, or persisted data.

## Project structure

```
DevClash/
  frontend/            React app (implemented so far: public site, auth screens, app shell)
    src/
      components/
        ui/            Theme-aware primitives: Button, Input, Checkbox, Badge, Card, Tabs, Modal,
                        Skeleton, ThemeToggle
        layout/        Navbar, Footer, PageTransition, AppShell, Sidebar, Topbar
        landing/       Hero, FeatureStrip, CodeWindowMock (landing-page-only sections)
      pages/           LandingPage, StyleGuidePage, AuthPage, ComingSoonPage, StubPage
      store/           themeStore.js (Zustand — theme only, persisted to localStorage)
      lib/             motion.js (Framer Motion presets), useReducedMotion.js, utils.js,
                        navigation.js (shared nav-item list), mockUser.js (hardcoded mock account)
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
  Landing-page decorative panels, the auth card, and stub screens all reuse this same `Card`
  component (or its underlying tokens) rather than duplicating the styling.
- `Tabs` supports both an uncontrolled mode (internal state, used on the style guide) and a
  controlled mode (`active` + `onChange`, used by the auth card so the active tab can stay in
  sync with the current URL).
- `Input` supports an optional `rightElement` slot (used for the password show/hide toggle) in
  addition to its left `icon` slot.
- `Checkbox` is a small themed primitive added alongside the others for "remember me" / terms
  agreement — same border/accent tokens as everything else.
- Reusable animation variants live in `src/lib/motion.js`: fade-in, slide-up, a staggered-children
  container, hover-lift, tap-scale, and the page-transition wrapper used by every route. All of
  them shrink to near-zero duration automatically when `prefers-reduced-motion` is set. The app
  shell additionally runs its own inner transition (keyed by the current sub-route) so switching
  between sidebar items animates only the content area, not the sidebar/topbar around it.

## Routing

| Path                    | Renders                                                     |
| ----------------------- | ------------------------------------------------------------ |
| `/`                     | Landing page                                                  |
| `/styleguide`           | Design system reference page                                  |
| `/login`                | Auth card, Log In tab active                                   |
| `/signup`               | Auth card, Sign Up tab active                                  |
| `/app` → `/app/dashboard` | Redirects into the app shell's default screen                |
| `/app/dashboard`        | App shell — Dashboard stub                                     |
| `/app/quick-play`       | App shell — Quick Play stub                                    |
| `/app/practice`         | App shell — Practice stub                                      |
| `/app/team-mode`        | App shell — Team Mode stub                                     |
| `/app/challenges`       | App shell — Challenges stub                                    |
| `/app/rankings`         | App shell — Rankings stub                                      |
| `/app/friends`          | App shell — Friends stub                                       |
| `/app/statistics`       | App shell — Statistics stub                                    |
| `/app/notifications`    | App shell — Notifications stub                                 |
| `/app/settings`         | App shell — Settings stub                                      |
| anything else           | Generic "coming soon" placeholder                              |

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
- The production build was served locally (`vite preview`) and every route in the table above
  returned HTTP 200 with the expected page content.
- Manually reviewed every component for responsive breakpoints (mobile → desktop), for both theme
  variants reading from the shared tokens, and for Framer Motion/Tailwind conflicts (e.g. a
  static `rotate-*` class would be silently overridden by an animated `transform`, so rotation is
  set via the motion values instead wherever a component is also animated).
