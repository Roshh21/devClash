# DevClash — Implementation Notes

This document tracks what currently exists in the codebase, what's mocked or placeholder, and
what's still unfinished. It reflects the actual code, not a plan.

## Current state

The project is a **frontend-only** React application. There is no backend, no database, and no
real authentication — everything visible is either static content or hand-written mock data. The
frontend is now feature-complete end to end for every screen described below; nothing has been
deployed anywhere (see "Deployment" at the bottom).

### What works right now

- A public landing page at `/` with a sticky navbar, a hero section, a stat/feature strip, and a
  footer.
- A shared design system (colors, the glass-card surface, buttons, inputs, textareas, checkboxes,
  badges, tabs, a modal, skeleton loaders, a theme toggle, a select, progress rings/bars, an inline
  notice banner) that every screen is built from, viewable on its own at `/styleguide`.
- Light and dark themes ("warm-cream" and "espresso") that switch instantly via a toggle in the
  navbar, persist across reloads (`localStorage`), and drive every color in the app through CSS
  variables — no component re-render is needed to re-theme.
- Login and signup screens at `/login` and `/signup` — one shared card with animated Log In / Sign
  Up tabs, email/password (plus username and confirm-password on signup), a show/hide password
  toggle, a "remember me" checkbox on login and a terms checkbox on signup, inline client-side
  validation (empty fields, email format, password length, password match), and three inert
  "continue with" social buttons. Submitting a valid form shows a short loading state and then an
  inline "coming soon" notice — nothing is created or persisted.
- An authenticated app shell at `/app/*`: a sidebar that collapses to icon-only on desktop and
  becomes a slide-in drawer with backdrop on mobile, a topbar with a (non-functional) search field,
  a real notification-bell dropdown, and an avatar menu (View Profile + Settings links, and a "Log
  out" link that just returns to the homepage, since there's no real session to end). The active
  nav item is highlighted. A hardcoded mock user ("Roshni", role `admin`) stands in for a real
  logged-in account.
- A Dashboard screen (`/app/dashboard`) built entirely from one local mock-data file: a greeting
  header with a quote, three action cards (Quick Play, Practice, Team Mode) linking into the app
  shell, four animated stat cards (Rating, Win Rate with a circular progress ring, Streak, Total
  Matches with a mini bar-sparkline — all counting up on load), a Your Rank card with an animated
  progress bar toward the next league, a Recent Matches list, and a Challenge of the Day card with
  a "Start Challenge" button. A skeleton placeholder shows for a moment before the mock data
  "arrives."
- A Profile screen (`/app/profile`, reachable from the sidebar's user card or the avatar menu):
  header with avatar, name, league/rating, and tagline; an Overview / Statistics / Match History /
  Achievements tab group (only Overview has real mock content — stat tiles and favorite-category
  tags — the other three show a lightweight "on the way" placeholder); and an Edit Profile modal
  (name + tagline fields) that shows a brief saving state and a "not actually saved" notice rather
  than persisting anything.
- A Practice screen (`/app/practice`) built from one local catalogue: an 8-category grid with
  counts (clicking a category filters the list below), a search bar, a category dropdown, and a
  difficulty dropdown — all three filters combine and update the visible challenge list instantly,
  client-side. Each challenge card shows its difficulty, type, estimated time, and a "Solved" badge
  where applicable, and links into the challenge player. Filtering down to zero results shows a
  deliberate empty state with a "Clear filters" action rather than a blank list.
- A challenge player (`/app/challenge/:challengeId`) — its own full-screen layout without the
  sidebar/topbar (matching the reference mockup's focus-mode screen), with a real Monaco editor
  (syntax highlighting only, themed to match the app's light/dark palette) rather than a styled
  textarea. Three panels: a Problem panel (difficulty, tags, description, worked examples, plus
  Submissions/Discussion tabs that are placeholders for now), the editor with Run Code / Submit
  buttons, and a Test Cases panel that switches to a Result tab on submit. A header timer chip
  counts down visually. Clicking Run or Submit plays a scripted sequence — test rows flip from
  "running" to "passed" one at a time — and Submit finishes with a mock "all tests passed" banner.
  No code is actually executed anywhere.
- A Quick Play flow (`/app/quick-play`) — another full-screen layout, launched from the Dashboard's
  Quick Play card or the sidebar. It scripts three screens in sequence: a Finding Opponent screen
  (pulsing radar animation, rating/league/estimated-wait chips, a Cancel button that returns to the
  dashboard) that auto-advances after a few seconds into a Victory screen (player-vs-opponent card,
  accuracy/tests/time/rating stats, Rematch or Back to Dashboard), which itself auto-advances into
  a League Promotion screen (animated badge, league-transition text, an animated progress bar, and
  View Profile / Continue actions). Rematch restarts the sequence from the top; every exit point
  routes somewhere real. There's no actual opponent, timer server, or socket connection — it's a
  fixed script.
- A Rankings screen (`/app/rankings`) with Global / Friends / This Season tabs backed by three
  separate mock datasets (so the tabs show genuinely different standings, not just a relabeled
  table), a small league badge per row, the current user's row visually highlighted, working
  client-side pagination on the 24-player Global tab, and a card-list fallback below the `md`
  breakpoint instead of a cramped table.
- A Friends screen (`/app/friends`): an add-friend search bar that filters a mock user directory
  client-side and shows inline "Add" results; Friends / Requests tabs; each friend row shows a
  presence dot (online / in-match / offline) plus Challenge and Message actions; each request row
  has Accept/Decline. All actions are locally interactive (requests can be accepted/declined from
  the list, search results flip to "Request sent") but nothing persists past a reload.
- A real notification system: a bell dropdown in the topbar (grouped preview of the most recent
  notifications, unread count badge, "View all" link) backed by the same data as the full
  Notifications screen (`/app/notifications`), which lists every notification with a "Mark all as
  read" action.
- A role-gated Admin section, visible in the sidebar only because the mock user's `role` is
  `'admin'` (verified during development by flipping it to `'user'` and confirming the section
  disappears and rebuilds cleanly either way):
  - **Content** (`/app/admin/content`): draft/review/published/archived status counts, a
    search bar, a status filter, and a table of mock challenges with Edit and Archive actions
    (Archive opens a confirm modal that ends in a "coming soon" notice — nothing is actually
    archived).
  - **New/Edit Challenge** (`/app/admin/content/new`, `/app/admin/content/:id/edit`): a form whose
    fields change based on the selected challenge type (MCQ options + correct answer, Output
    code + expected output, Coding starter code + a dynamic add/remove test-case list, Debugging
    buggy code + expected fix, SQL schema + expected result), plus shared fields (title, category,
    difficulty, time, description). Fully validated client-side; Save shows a loading state and a
    "coming soon" notice rather than persisting anything. Edit mode pre-fills what the mock
    catalogue actually has (title/category/type) and leaves the rest blank, since the catalogue
    doesn't store full content per entry.
  - **Users** (`/app/admin/users`): search by name/email, and Block/Unblock, Promote/Demote, and
    Remove actions, each behind a shared confirm modal that ends in a "coming soon" notice —
    nothing in the table actually changes.
- Scroll-triggered and hover animations (Framer Motion), including a shared page-transition
  wrapper used by every route and a separate inner transition for content inside the app shell, so
  navigating between sidebar items animates just the content area, not the whole shell. Numeric
  stats count up on load and progress rings/bars animate to their value. A dedicated audit pass
  went through every animated component to confirm it degrades to a static (or near-instant)
  fallback when the browser's reduced-motion preference is on — see "Motion & reduced-motion audit"
  below for specifics on what that caught.
- A fully responsive layout from small mobile widths up through desktop everywhere above.

### Placeholder / not real yet

- Login and signup don't create or check accounts — see above. Social login buttons show a
  "coming soon" notice instead of doing anything.
- The `/app/*` shell is a standalone area reachable only by typing the URL — it is intentionally
  **not** linked from `/login` or `/signup` yet, since connecting real auth to the app shell is
  later work. The mock "Roshni" user (including her `role: 'admin'` flag) is hardcoded, not read
  from anywhere.
- Dashboard, Profile, Practice, Rankings, Friends, Notifications, and the Admin screens all show
  fixed mock data from local files under `src/lib/` — nothing is fetched, and every "loading"
  skeleton is a timer, not a real request.
- Editing a profile, archiving/creating/editing a challenge, and blocking/promoting/removing a user
  all end in a "coming soon" notice rather than persisting anything.
- Every challenge in Practice opens the **same** mock problem body (a Two-Sum-style example) in
  the player — only the title, difficulty, and completion badge come from the catalogue entry that
  was clicked. Building genuinely unique content for every catalogue entry wasn't in scope here.
- The challenge player's Run/Submit never execute real code — the pass/fail sequence is a fixed
  timer-driven script, and it always ends in success. The language selector only offers
  JavaScript.
- The Quick Play flow always plays out the same way (find opponent → win → get promoted) on a
  fixed timer — there's no real matchmaking, no possibility of losing, and the numbers shown
  (opponent, ratings, promotion) are constants, not computed from the Dashboard's own stats.
- Rankings' pagination and tab-switching are fully real client-side interactions, but the
  underlying data never changes — there's no live query, and "This Season" is just a second
  hand-written dataset, not a real time-boxed leaderboard.
- The Admin role gate only hides/shows a sidebar section and a set of routes that still exist —
  there's no route guard preventing direct navigation to `/app/admin/*` when the mock role is
  `'user'`. That's intentional: real enforcement is a backend/API concern for later, not something
  a frontend-only build can do meaningfully.
- Every other `/app/*` screen (Team Mode, Challenges, Statistics, Settings) is still the generic
  "coming soon" placeholder.
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

## Deployment

Not attempted. Getting a real, shareable production URL live (custom 404/favicon/OG polish,
environment variables on the host, a smoke test against the deployed domain) requires an actual
hosting account and external network access this environment doesn't have, so it's left for
whoever has that access. Everything above this line is otherwise ready for it: the app builds
cleanly (`npm run build`), lints cleanly, and every route has been verified to serve correctly from
a local production build (see "Verification performed").

## Project structure

```
DevClash/
  frontend/            React app — public site, auth, app shell, dashboard, profile, practice,
                        challenge player, quick play, rankings, friends, notifications, admin
    src/
      components/
        ui/            Theme-aware primitives: Button, Input, Textarea, Checkbox, Badge, Card,
                        Tabs, Modal, Skeleton, ThemeToggle, ProgressRing, ProgressBar, Sparkline,
                        Select, EmptyTabState, StatTile, Pagination, InlineNotice
        layout/        Navbar, Footer, PageTransition, AppShell, Sidebar, Topbar, NotificationBell
        landing/       Hero, FeatureStrip, CodeWindowMock (landing-page-only sections)
        dashboard/     ActionCard, StatCard, DashboardSkeleton
        profile/       EditProfileModal
        practice/      CategoryCard, ChallengeCard, PracticeSkeleton
        challenge/     CodeEditor (Monaco wrapper), TimerChip, StatusPill
        quickplay/     RadarPing, FindingOpponent, PlayerBlock, VictoryScreen, PromotionScreen
        rankings/      LeagueBadge, LeaderboardTable, RankingsSkeleton
        social/        PresenceDot, FriendRow, RequestRow, FriendsSkeleton
        notifications/ NotificationRow, NotificationsSkeleton
        admin/         ConfirmActionModal, AdminTableSkeleton, AdminFormSkeleton
      pages/           LandingPage, StyleGuidePage, AuthPage, ComingSoonPage, StubPage,
                        DashboardPage, ProfilePage, PracticePage, ChallengePlayerPage,
                        QuickPlayPage, RankingsPage, FriendsPage, NotificationsPage,
                        AdminContentPage, AdminChallengeFormPage, AdminUsersPage
      store/           themeStore.js (Zustand — theme only, persisted to localStorage)
      lib/             motion.js (Framer Motion presets), useReducedMotion.js, useCountUp.js,
                        useMockLoading.js, useCountdown.js, utils.js, navigation.js,
                        mockUser.js, mockDashboard.js, mockProfile.js, mockChallenges.js,
                        mockChallengeDetail.js, mockQuickPlay.js, mockLeaderboard.js,
                        mockSocial.js, mockNotifications.js, mockAdminContent.js,
                        mockAdminUsers.js (hardcoded mock data)
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
- The "glass card" look (`Card` component) is: a translucent surface color, `backdrop-blur`, a 1px
  soft border, a soft shadow, and large rounded corners. Landing-page decorative panels, the auth
  card, and stub screens all reuse this same `Card` component rather than duplicating the styling.
- `Tabs` supports both an uncontrolled mode (internal state, used on the style guide) and a
  controlled mode (`active` + `onChange`, used everywhere else so the active tab can stay in sync
  with app state or the URL).
- `Input` supports an optional `rightElement` slot (password show/hide toggle) and a `mono` flag
  for code-like fields; `Textarea` is the multi-line counterpart, added for the admin challenge
  form's description/code fields.
- `Checkbox` is a small themed primitive added alongside the others for "remember me" / terms
  agreement — same border/accent tokens as everything else.
- `ProgressRing` (animated SVG circular gauge) and `ProgressBar` (animated linear bar) are generic
  primitives built with plain SVG/CSS rather than a charting library, since the visuals are simple.
  `ProgressBar` replaced two near-identical hand-rolled progress bars (Dashboard's rank progress,
  the Quick Play promotion screen) — consolidating them also fixed a real bug: the original
  Dashboard version set its final width directly with only a CSS `transition` class, which never
  animates on first paint because there's nothing to transition *from*. `Sparkline` (animated mini
  bar chart) rounds out the set.
- `Select` is a themed wrapper around a native `<select>` (used for Practice's filters, the
  challenge player's language picker, and the admin form's category/difficulty/type pickers) — kept
  native rather than a custom listbox for built-in accessibility and keyboard support.
- `EmptyTabState` started as a profile-only component and was promoted to `components/ui/` once
  the challenge player needed the same "nothing here yet" treatment for its Submissions/Discussion/
  Result tabs — one shared component instead of two near-duplicates. `StatTile` followed the same
  path (Profile → Quick Play's Victory screen), and `InlineNotice` (the "isn't wired up yet, coming
  soon" banner) was promoted the same way once Auth, Profile, Friends, and both Admin table screens
  all needed the identical pattern.
- `Pagination` is a small shared control (Previous/Next + page indicator) added for the Rankings
  table, written generically enough to reuse anywhere else a long list needs paging later.
- The challenge player's code editor is a real Monaco instance (`@monaco-editor/react`), not a
  styled textarea, per the plan's explicit call for it. Monaco loads from a CDN at runtime rather
  than being bundled, so it adds negligible weight to the build; two small custom themes
  (`devclash-dark` / `devclash-light`) tint its background to match the app's surface colors.
- `useCountUp` animates a number counting up to its target value on mount; `useMockLoading`
  simulates a brief load so every mock-data screen shows its skeleton state before content
  "arrives," even though there's no real request yet; `useCountdown` powers the challenge player's
  timer chip.

## Motion & reduced-motion audit

A dedicated pass went through every Framer Motion animation in the app (not just the obviously
decorative ones) and checked it against the reduced-motion preference. A few real inconsistencies
turned up and were fixed:

- Several components (the tab-underline spring in `Tabs`, the notification/avatar dropdown menus,
  the mobile drawer and mobile nav-menu slide/height animations, the theme-toggle icon swap, the
  hero's code-window mount animation, and the dashboard sparkline's bar-grow animation) were
  animating with a hardcoded duration regardless of the user's motion preference. The global CSS
  reduced-motion rule in `globals.css` only catches animations driven by real CSS
  `transition`/`animation` properties — it does **not** reliably affect Framer Motion, which
  interpolates most properties directly via JavaScript rather than CSS. Each of these was fixed to
  check `useReducedMotion()` (or the module-level `prefersReducedMotion()` for cases evaluated once
  at import time) and either skip the animation, collapse its duration to `0`, or remove the
  distance it travels.
- To stop this from recurring, `src/lib/motion.js` now exports shared, reduced-motion-aware presets
  for every repeated pattern instead of leaving each screen to hand-roll its own:
  `tabContentTransition` (small in-place content swaps — used by Auth's mode switch and every tab
  panel in Profile/Rankings/Friends), `dropdownMenu` (popover menus), `modalBackdrop`/`modalPanel`
  (the `Modal` component), `drawerSlide` (the mobile sidebar drawer), and `heightExpand` (collapsible
  sections like the mobile nav menu and `InlineNotice`). New animated UI should pull from this list
  before writing a new one-off transition.
- The one genuine "loading" animation that repeats indefinitely (the Quick Play radar ping) was
  already correct: for reduced-motion users it doesn't render the pulsing rings at all, showing a
  static ring in their place instead of just speeding up or slowing down the same effect.
- Every skeleton loader across the app (`Dashboard`, `Profile`, `Practice`, `Rankings`, `Friends`,
  `Notifications`, and both Admin table/form screens) now uses the shared `Skeleton` primitive and
  is shaped to roughly match its screen's real layout, replacing a few pages that had briefly used
  a generic `animate-pulse` div instead — the goal (per the plan) being no layout jump when the
  skeleton resolves into real content, and one consistent shimmer treatment everywhere rather than
  two different loading visual languages.
- Animations throughout use GPU-friendly properties (`opacity`, `transform`/`x`/`y`/`scale`) almost
  everywhere; the two deliberate exceptions are `height` (the notice banner and mobile nav menu
  expanding/collapsing) and `width` (the progress bar), both common, low-risk choices for small UI
  elements where a transform-based alternative would add real complexity for no visible benefit.
  Actual frame-rate wasn't benchmarked on real hardware, since this environment has no browser —
  see "Known limitations."

## Routing

| Path                      | Renders                                                     |
| -------------------------- | ------------------------------------------------------------ |
| `/`                         | Landing page                                                  |
| `/styleguide`               | Design system reference page                                  |
| `/login`                    | Auth card, Log In tab active                                   |
| `/signup`                   | Auth card, Sign Up tab active                                  |
| `/app` → `/app/dashboard`   | Redirects into the app shell's default screen                 |
| `/app/dashboard`            | App shell — Dashboard (real mock content)                      |
| `/app/profile`              | App shell — Profile (real mock content)                        |
| `/app/practice`             | App shell — Practice discovery (real mock content)             |
| `/app/rankings`             | App shell — Rankings (real mock content)                       |
| `/app/friends`              | App shell — Friends (real mock content)                        |
| `/app/notifications`        | App shell — Notifications (real mock content)                  |
| `/app/admin` → `.../content`| Redirects into the admin section's default screen (admin only) |
| `/app/admin/content`        | App shell — Admin content dashboard                            |
| `/app/admin/content/new`    | App shell — New Challenge form                                 |
| `/app/admin/content/:id/edit` | App shell — Edit Challenge form                              |
| `/app/admin/users`          | App shell — Admin user management                              |
| `/app/challenge/:id`        | Full-screen challenge player (own layout, no sidebar)          |
| `/app/quick-play`           | Full-screen Quick Play flow (own layout, no sidebar)           |
| `/app/team-mode`            | App shell — Team Mode stub                                     |
| `/app/challenges`           | App shell — Challenges stub                                    |
| `/app/statistics`           | App shell — Statistics stub                                    |
| `/app/settings`             | App shell — Settings stub                                      |
| anything else               | Generic "coming soon" placeholder                              |

## Known limitations

- No automated tests yet.
- No backend calls anywhere — all content is hardcoded in components.
- Icons and copy are illustrative rather than final production copy.
- The challenge player's Monaco editor loads from a CDN at runtime (the standard way
  `@monaco-editor/react` works without extra bundler config) — it needs the end user's browser to
  have internet access the first time it loads. This couldn't be visually verified in this
  environment since there's no browser available here; it was verified by installing/building the
  package and confirming Monaco isn't pulled into the local bundle (see verification notes below).
- There's no browser in this environment, so nothing here was visually screenshotted or manually
  clicked through — verification relied on a clean production build, a clean lint pass, serving the
  build and checking every route returns the right content over HTTP, and close manual reading of
  every animated/interactive component (including deliberately testing the admin role flag both
  ways). A real frame-rate check on an actual machine, and a plain look at the UI, are both still
  worth doing before treating this as final.
- The production bundle is a single ~535KB (~161KB gzipped) JS file; Vite's build warns about this.
  Nothing is broken by it, but if load time on a slow connection becomes a concern, the challenge
  player and admin screens are reasonable candidates for `React.lazy()` code-splitting later, since
  they're not needed on first load for most visitors.

## Running locally

```bash
cd frontend
npm install
npm run dev
```

Build for production: `npm run build` (output in `frontend/dist/`). Preview that build locally
with `npm run preview`.

## Verification performed

- `npm run build` completes with no errors on every change described in this document.
- `npm run lint` (oxlint) reports 0 warnings / 0 errors on the final state.
- The production build was served locally (`vite preview`) and every route in the table above
  returned HTTP 200 with the expected page content, including a full pass after the A11–A13-scale
  additions (friends, notifications, admin, and the motion/skeleton audit) landed together.
- Manually reviewed every component for responsive breakpoints (mobile → desktop), for both theme
  variants reading from the shared tokens, and for Framer Motion/Tailwind conflicts (e.g. a
  static `rotate-*` class would be silently overridden by an animated `transform`, so rotation is
  set via the motion values instead wherever a component is also animated).
- The linter caught two real issues along the way: `ProgressRing`/`useCountUp` calling `setState`
  synchronously inside an effect for the reduced-motion case (redundant with initial state, fixed
  by deriving the value directly), and an unused constant left over from a refactor.
- `npm audit` flags a moderate DOMPurify advisory pulled in transitively by `monaco-editor`, which
  is only installed as a peer dependency for local type-checking — confirmed neither our code nor
  `@monaco-editor/react`/`@monaco-editor/loader` imports it directly, and the production bundle
  size barely changed after adding the editor, consistent with Monaco itself loading from a CDN at
  runtime rather than being bundled. No action needed, but worth knowing it's there.
- Reviewed the Quick Play flow's timers specifically: each phase schedules its own auto-advance
  `setTimeout` in a `useEffect` keyed on the current phase, so navigating away or manually changing
  phase (Rematch, Cancel, Back to Dashboard) always runs the previous effect's cleanup first —
  there's no path where a stale timer fires after the user has already left that phase.
- The admin role gate (`MOCK_USER.role`) was manually flipped between `'admin'` and `'user'` and
  rebuilt both ways to confirm the sidebar section actually appears/disappears and nothing else
  breaks, before being set back to `'admin'` for the delivered default.
- A dedicated motion audit (see "Motion & reduced-motion audit" above) went through every
  `transition`/`animate` usage in the codebase via a full-project search, not just a visual
  once-over, and fixed every instance found that didn't already respect reduced motion.
