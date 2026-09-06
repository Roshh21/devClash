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
  search field, a notification bell linking to the notifications screen, and an avatar menu (View
  Profile + Settings links, and a "Log out" link that just returns to the homepage, since there's
  no real session to end). The active nav item is highlighted. A hardcoded mock user ("Roshni")
  stands in for a real logged-in account.
- A Dashboard screen (`/app/dashboard`) built entirely from one local mock-data file
  (`lib/mockDashboard.js`): a greeting header with a quote, three action cards (Quick Play,
  Practice, Team Mode) linking into the app shell, four animated stat cards (Rating, Win Rate with
  a circular progress ring, Streak, Total Matches with a mini bar-sparkline — all counting up on
  load), a Your Rank card with a progress bar toward the next league, a Recent Matches list, and a
  Challenge of the Day card with a "Start Challenge" button. A skeleton placeholder shows for a
  moment before the mock data "arrives."
- A Profile screen (`/app/profile`, reachable from the sidebar's user card or the avatar menu):
  header with avatar, name, league/rating, and tagline; an Overview / Statistics / Match History /
  Achievements tab group (only Overview has real mock content — stat tiles and favorite-category
  tags — the other three show a lightweight "on the way" placeholder); and an Edit Profile modal
  (name + tagline fields) that shows a brief saving state and a "not actually saved" notice rather
  than persisting anything.
- A Practice screen (`/app/practice`) built from one local catalogue (`lib/mockChallenges.js`): an
  8-category grid with counts (clicking a category filters the list below), a search bar, a
  category dropdown, and a difficulty dropdown — all three filters combine and update the visible
  challenge list instantly, client-side. Each challenge card shows its difficulty, type, estimated
  time, and a "Solved" badge where applicable, and links into the challenge player. Filtering down
  to zero results shows a deliberate empty state with a "Clear filters" action rather than a blank
  list.
- A challenge player (`/app/challenge/:challengeId`) — its own full-screen layout without the
  sidebar/topbar (matching the reference mockup's focus-mode screen), with a real Monaco editor
  (syntax highlighting only, themed to match the app's light/dark palette) rather than a styled
  textarea. Three panels: a Problem panel (difficulty, tags, description, worked examples, plus
  Submissions/Discussion tabs that are placeholders for now), the editor with Run Code / Submit
  buttons, and a Test Cases panel that switches to a Result tab on submit. A header timer chip
  counts down visually. Clicking Run or Submit plays a scripted sequence — test rows flip from
  "running" to "passed" one at a time — and Submit finishes with a mock "all tests passed" banner.
  No code is actually executed anywhere.
- Scroll-triggered and hover animations (Framer Motion), including a shared page-transition
  wrapper used by every route and a separate inner transition for content inside the app shell, so
  navigating between sidebar items animates just the content area, not the whole shell. Numeric
  stats count up on load and progress rings/bars animate to their value. Everything falls back to
  little/no animation when the browser's reduced-motion preference is on.
- A fully responsive layout from small mobile widths up through desktop everywhere above.

### Placeholder / not real yet

- Login and signup don't create or check accounts — see above. Social login buttons show a
  "coming soon" notice instead of doing anything.
- The `/app/*` shell is a standalone area reachable only by typing the URL — it is intentionally
  **not** linked from `/login` or `/signup` yet, since connecting real auth to the app shell is
  later work. The mock "Roshni" user is hardcoded, not read from anywhere.
- Dashboard and Profile show fixed mock numbers from `lib/mockDashboard.js` and
  `lib/mockProfile.js` — nothing is fetched, and the "loading" skeleton is a timer, not a real
  request.
- Editing a profile doesn't save anything; the modal just closes and shows a notice.
- Every challenge in Practice opens the **same** mock problem body (a Two-Sum-style example) in
  the player — only the title, difficulty, and completion badge come from the catalogue entry that
  was clicked. Building genuinely unique content for every catalogue entry wasn't in scope here.
- The challenge player's Run/Submit never execute real code — the pass/fail sequence is a fixed
  timer-driven script, and it always ends in success. The language selector only offers
  JavaScript.
- Every other `/app/*` screen (Quick Play, Team Mode, Challenges, Rankings, Friends, Statistics,
  Notifications, Settings) is still the generic "coming soon" placeholder.
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
  frontend/            React app (implemented so far: public site, auth screens, app shell,
                        dashboard, profile, practice discovery, challenge player)
    src/
      components/
        ui/            Theme-aware primitives: Button, Input, Checkbox, Badge, Card, Tabs, Modal,
                        Skeleton, ThemeToggle, ProgressRing, Sparkline, Select, EmptyTabState
        layout/        Navbar, Footer, PageTransition, AppShell, Sidebar, Topbar
        landing/       Hero, FeatureStrip, CodeWindowMock (landing-page-only sections)
        dashboard/     ActionCard, StatCard, DashboardSkeleton
        profile/       EditProfileModal
        practice/      CategoryCard, ChallengeCard, PracticeSkeleton
        challenge/     CodeEditor (Monaco wrapper), TimerChip, StatusPill
      pages/           LandingPage, StyleGuidePage, AuthPage, ComingSoonPage, StubPage,
                        DashboardPage, ProfilePage, PracticePage, ChallengePlayerPage
      store/           themeStore.js (Zustand — theme only, persisted to localStorage)
      lib/             motion.js (Framer Motion presets), useReducedMotion.js, useCountUp.js,
                        useMockLoading.js, useCountdown.js, utils.js, navigation.js,
                        mockUser.js, mockDashboard.js, mockProfile.js, mockChallenges.js,
                        mockChallengeDetail.js (hardcoded mock data)
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
- `ProgressRing` (animated SVG circular gauge) and `Sparkline` (animated mini bar chart) are
  generic primitives added for the dashboard's stat cards, built with plain SVG/CSS rather than a
  charting library since the visuals are simple. Both respect reduced motion.
- `Select` is a themed wrapper around a native `<select>` (used for Practice's category/difficulty
  filters and the challenge player's language picker) — kept native rather than a custom listbox
  for built-in accessibility and keyboard support.
- `EmptyTabState` started as a profile-only component and was promoted to `components/ui/` once
  the challenge player needed the same "nothing here yet" treatment for its Submissions/Discussion/
  Result tabs — one shared component instead of two near-duplicates.
- The challenge player's code editor is a real Monaco instance (`@monaco-editor/react`), not a
  styled textarea, per the plan's explicit call for it. Monaco loads from a CDN at runtime rather
  than being bundled, so it adds negligible weight to the build; two small custom themes
  (`devclash-dark` / `devclash-light`) tint its background to match the app's surface colors.
- `useCountUp` animates a number counting up to its target value on mount (used for Rating, Win
  Rate, and Total Matches); `useMockLoading` simulates a brief load so every mock-data screen shows
  its skeleton state before content "arrives," even though there's no real request yet;
  `useCountdown` powers the challenge player's timer chip.
- Reusable animation variants live in `src/lib/motion.js`: fade-in, slide-up, a staggered-children
  container, hover-lift, tap-scale, and the page-transition wrapper used by every route. All of
  them shrink to near-zero duration automatically when `prefers-reduced-motion` is set. The app
  shell additionally runs its own inner transition (keyed by the current sub-route) so switching
  between sidebar items animates only the content area, not the sidebar/topbar around it. The
  challenge player deliberately sits outside that grouping — it has its own full-screen layout
  (no sidebar), so it gets a normal full-page transition in and out instead.

## Routing

| Path                    | Renders                                                     |
| ----------------------- | ------------------------------------------------------------ |
| `/`                     | Landing page                                                  |
| `/styleguide`           | Design system reference page                                  |
| `/login`                | Auth card, Log In tab active                                   |
| `/signup`               | Auth card, Sign Up tab active                                  |
| `/app` → `/app/dashboard` | Redirects into the app shell's default screen                |
| `/app/dashboard`        | App shell — Dashboard (real mock content)                      |
| `/app/profile`          | App shell — Profile (real mock content)                        |
| `/app/practice`         | App shell — Practice discovery (real mock content)              |
| `/app/challenge/:id`    | Full-screen challenge player (real mock content, own layout)    |
| `/app/quick-play`       | App shell — Quick Play stub                                    |
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
- The challenge player's Monaco editor loads from a CDN at runtime (the standard way
  `@monaco-editor/react` works without extra bundler config) — it needs the end user's browser to
  have internet access the first time it loads. This couldn't be visually verified in this
  environment since there's no browser available here; it was verified by installing/building the
  package and confirming Monaco isn't pulled into the local bundle (see verification notes below).

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
- The linter also caught a real issue on this pass: `ProgressRing` and `useCountUp` were calling
  `setState` synchronously inside an effect for the reduced-motion case, which is redundant with
  the initial state and can cause an extra render — fixed by deriving the displayed value directly
  instead of syncing it through state.
- `npm audit` flags a moderate DOMPurify advisory pulled in transitively by `monaco-editor`, which
  is only installed as a peer dependency for local type-checking — confirmed neither our code nor
  `@monaco-editor/react`/`@monaco-editor/loader` imports it directly, and the production bundle
  size barely changed after adding the editor, consistent with Monaco itself loading from a CDN at
  runtime rather than being bundled. No action needed, but worth knowing it's there.
