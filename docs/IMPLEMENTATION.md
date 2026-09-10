# DevClash — Implementation Notes

This document tracks what currently exists in the codebase, what's mocked or placeholder, and
what's still unfinished. It reflects the actual code, not a plan.

## Current state

The frontend is feature-complete end to end for every screen described below. As of Stage B1–B6,
**authentication and admin user-management are real**: a Node/Express + MongoDB backend now backs
signup, login, sessions, protected routes, server-enforced admin authorization, and a working
admin user-management API (block/unblock, promote/demote, remove). Everything else past login —
dashboard, profile, practice, the challenge player, quick play, rankings, friends, notifications,
and the admin *content* screens — is still driven entirely by hand-written mock data; those get
wired up to real endpoints in later stages (C onward). Nothing has been deployed anywhere (see
"Deployment" below).

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
  "continue with" social buttons. **As of Stage B2/B3, submitting a valid form is real**: it calls
  the backend, creates/authenticates an account, and logs you in — a duplicate email/username comes
  back as a field-level error (not a generic toast), and a wrong password shows a generic "invalid
  email or password" message rather than confirming which field was wrong. A network failure (e.g.
  the backend isn't running) shows a clear "can't reach the server" notice instead of hanging.
  **As of Stage B6**, real errors (wrong password, duplicate account, blocked account, network
  failure) render in a distinct red/"danger" tone, while the still-unbuilt "coming soon" hints
  (forgot password, social login) stay in the original neutral tone — `InlineNotice` gained an
  optional `tone` prop for this, defaulting to the original look everywhere else it's used. If a
  session elsewhere in the app was ended by the *server* (expired token, or the account got
  blocked mid-session) rather than the user clicking "Log out," landing back here shows exactly why
  instead of a blank form. Social login buttons are still inert "coming soon."
- An authenticated app shell at `/app/*`, now gated by a real session (`RequireAuth` — see
  `components/auth/RequireAuth.jsx`): visiting any `/app/*` URL without a valid, logged-in session
  redirects to `/login`, and a still-valid session survives a page refresh (checked once against
  `GET /api/auth/me` on load). The shell itself: a sidebar that collapses to icon-only on desktop
  and becomes a slide-in drawer with backdrop on mobile, a topbar with a (non-functional) search
  field, a real notification-bell dropdown, and an avatar menu (View Profile + Settings links, and
  a "Log out" button that ends the real session and returns to the homepage). The active nav item
  is highlighted. Sidebar/topbar/profile/dashboard all show the real logged-in user's name and
  initials (`lib/useCurrentUser.js`) — rating, league, and tagline still come from the Stage A mock
  (`lib/mockUser.js`) since the backend has no concept of those yet. **As of Stage B4**, the Admin
  sidebar section is gated on the real, authenticated user's role (not a mock flag anymore), and
  the four nested `/app/admin/*` routes are wrapped in `RequireAdmin`
  (`components/auth/RequireAdmin.jsx`), which redirects a non-admin straight to the dashboard
  instead of showing admin screens that would just fail on every action — see "What's real right
  now" below for the full B4–B6 rundown. **As of Stage B6**, a session that becomes invalid
  anywhere in the app (an expired token on any authenticated request, or an account that gets
  blocked mid-session) triggers an automatic, graceful logout with a clear reason shown on the
  next visit to `/login` — see `lib/api.js`'s `setUnauthorizedHandler` and `store/authStore.js`'s
  `sessionMessage`. A plain "you're logged in but not allowed to do that" 403 (e.g. a non-admin
  hitting an admin endpoint directly) does *not* trigger this — the session stays valid, only the
  one action fails.
- A real backend (`backend/`): Node/Express + MongoDB (Mongoose), with `GET /health`,
  `POST/GET /api/auth/{signup,login,me,logout}`, and (Stage B4–B5) `GET /api/admin/users`
  (paginated + searchable) plus `PATCH /api/admin/users/:id/{block,unblock,promote,demote}` and
  `DELETE /api/admin/users/:id` — every admin route requires both a valid session and the admin
  role (`requireAuth` + `requireAdmin`), checked fresh from the database on every request (the JWT
  itself carries no role, so a demotion takes effect on that user's very next request, not just
  their next login). Demoting, blocking, or removing the *only* remaining admin account is rejected
  with a 400, server-side — there's no way to lock the system out of having an admin, whether by
  one admin acting on another or an admin acting on themselves. Passwords are bcrypt-hashed (never
  stored or returned in plaintext), sessions are stateless JWTs sent as `Authorization: Bearer
  <token>` (not cookies — see `backend/README.md` for why), and CORS is restricted to configured
  origins rather than left open. Error responses can carry an optional machine-readable `code`
  (currently just `ACCOUNT_BLOCKED`) alongside the human message, letting the frontend tell "your
  session just died" apart from "you're logged in fine, just not allowed to do that" even though
  both can be a 403. There's also a one-off CLI script, `npm run seed:admin -- email@example.com`,
  the only way to create the very first admin account (every signup defaults to `role: 'user'`, and
  every admin-management endpoint requires an admin to already be logged in). See
  `backend/README.md` for setup and a full endpoint reference with `curl` examples for all of the
  above.
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
- An Admin section, visible in the sidebar only for real admins (Stage B4 — see above) and reached
  through `RequireAdmin`-guarded routes:
  - **Users** (`/app/admin/users`) — **fully real as of Stage B5.** A paginated (8 per page),
    debounced-search (by username or email) table fetched from `GET /api/admin/users`. Block/
    Unblock, Promote/Demote, and Remove each open a confirm modal whose Confirm button now performs
    a real API call; on success the table re-fetches from the server (never patched optimistically,
    so it can't drift from what the backend actually did) and a success toast shows. On failure
    (e.g. trying to demote or remove the only remaining admin) the modal stays open and shows the
    server's error inline instead of silently closing. The current user's own row is marked
    "(you)". Removing the last row on a page beyond the first backs up a page automatically instead
    of showing an empty table.
  - **Content** (`/app/admin/content`) — still Stage A mock: draft/review/published/archived status
    counts, a search bar, a status filter, and a table of mock challenges with Edit and Archive
    actions (Archive opens a confirm modal that ends in a "coming soon" notice — nothing is
    actually archived). Becomes real in Stage C.
  - **New/Edit Challenge** (`/app/admin/content/new`, `/app/admin/content/:id/edit`) — still Stage
    A mock: a form whose fields change based on the selected challenge type (MCQ options + correct
    answer, Output code + expected output, Coding starter code + a dynamic add/remove test-case
    list, Debugging buggy code + expected fix, SQL schema + expected result), plus shared fields
    (title, category, difficulty, time, description). Fully validated client-side; Save shows a
    loading state and a "coming soon" notice rather than persisting anything. Edit mode pre-fills
    what the mock catalogue actually has (title/category/type) and leaves the rest blank, since the
    catalogue doesn't store full content per entry. Becomes real in Stage C.
- Scroll-triggered and hover animations (Framer Motion), including a shared page-transition
  wrapper used by every route and a separate inner transition for content inside the app shell, so
  navigating between sidebar items animates just the content area, not the whole shell. Numeric
  stats count up on load and progress rings/bars animate to their value. A dedicated audit pass
  went through every animated component to confirm it degrades to a static (or near-instant)
  fallback when the browser's reduced-motion preference is on — see "Motion & reduced-motion audit"
  below for specifics on what that caught.
- A fully responsive layout from small mobile widths up through desktop everywhere above.

### Placeholder / not real yet

- Social login buttons show a "coming soon" notice instead of doing anything; "Forgot password" is
  the same.
- Rating, league, and tagline shown on Profile/Sidebar still come from the Stage A mock
  (`lib/mockUser.js`), since the backend has no concept of them yet (Stage E/K).
- Dashboard, Profile, Practice, Rankings, Friends, Notifications, and the Admin *Content* screens
  (but not Users — see above) all show fixed mock data from local files under `src/lib/` — nothing
  is fetched, and every "loading" skeleton is a timer, not a real request.
- Editing a profile, and archiving/creating/editing a challenge, still end in a "coming soon"
  notice rather than persisting anything. (Blocking/promoting/demoting/removing a *user* is real
  now — see above.)
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
- Every other `/app/*` screen (Team Mode, Challenges, Statistics, Settings) is still the generic
  "coming soon" placeholder.
- The navbar's "Challenges", "Leaderboards", and "Pricing" links, and every footer link (About,
  Blog, Careers, Docs, Community, Support), are visual only — they don't go anywhere yet. Only
  "Features" (scrolls to the on-page feature strip), "Log in", and "Get Started" are functional.
- Any unmatched URL falls back to a generic "coming soon" screen rather than a designed 404 page.
- The favicon is a simple placeholder mark, not a finished brand asset.
- The hero's "workspace" visual is a CSS/SVG mock of a code editor window (with a small floating
  quote card), not a photograph — no image assets are bundled with the project.

### Explicitly out of scope right now

- Rate limiting, account lockout, and password reset (Stage L1) — the rest of Stage B's auth
  hardening (B4–B6) is done.
- The question bank, matchmaking, code evaluation, real-time features, and everything else in
  Stages C onward — `backend/` currently only covers auth and admin user-management.
- `DevClash-Bank/` — empty placeholder, no content (Stage C).
- Deploying either the frontend or the backend anywhere.

## Deployment

Not attempted, for either the frontend or the backend. Getting real, shareable production URLs
live (custom 404/favicon/OG polish, environment variables on both hosts, CORS configured for the
real frontend origin, a production MongoDB Atlas cluster, a smoke test against the deployed
domains) requires actual hosting accounts and external network access this environment doesn't
have, so it's left for whoever has that access. Everything above this line is otherwise ready for
it: the frontend builds cleanly (`npm run build`), both lint cleanly, and every frontend route has
been verified to serve correctly from a local production build (see "Verification performed").

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
        auth/           RequireAuth (redirects to /login without a session), RequireAdmin
                        (redirects to /app/dashboard without the admin role)
        landing/       Hero, FeatureStrip, CodeWindowMock (landing-page-only sections)
        dashboard/     ActionCard, StatCard, DashboardSkeleton
        profile/       EditProfileModal
        practice/      CategoryCard, ChallengeCard, PracticeSkeleton
        challenge/     CodeEditor (Monaco wrapper), TimerChip, StatusPill
        quickplay/     RadarPing, FindingOpponent, PlayerBlock, VictoryScreen, PromotionScreen
        rankings/      LeagueBadge, LeaderboardTable, RankingsSkeleton
        social/        PresenceDot, FriendRow, RequestRow, FriendsSkeleton
        notifications/ NotificationRow, NotificationsSkeleton
        admin/         ConfirmActionModal (async confirm, inline error on failure),
                        AdminTableSkeleton, AdminFormSkeleton
      pages/           LandingPage, StyleGuidePage, AuthPage, ComingSoonPage, StubPage,
                        DashboardPage, ProfilePage, PracticePage, ChallengePlayerPage,
                        QuickPlayPage, RankingsPage, FriendsPage, NotificationsPage,
                        AdminContentPage, AdminChallengeFormPage, AdminUsersPage (real data as of
                        Stage B5)
      store/           themeStore.js (theme, persisted to localStorage),
                        authStore.js (real session — user/token/status/sessionMessage, Zustand)
      lib/             motion.js (Framer Motion presets), useReducedMotion.js, useCountUp.js,
                        useMockLoading.js, useCountdown.js, useDebouncedValue.js (search-input
                        debounce), utils.js, navigation.js, api.js (fetch wrapper for the
                        backend — also owns the global session-invalidation handler, Stage B6),
                        useCurrentUser.js (real identity + still-mocked gamification fields),
                        mockUser.js, mockDashboard.js, mockProfile.js, mockChallenges.js,
                        mockChallengeDetail.js, mockQuickPlay.js, mockLeaderboard.js,
                        mockSocial.js, mockNotifications.js, mockAdminContent.js
                        (mockAdminUsers.js removed — AdminUsersPage fetches real data as of
                        Stage B5)
      styles/          tokens.css (design tokens), globals.css
  backend/             Node/Express + MongoDB API — Stage B1–B6 (auth + admin user-management)
    src/
      config/          env.js (validated env vars), db.js (MongoDB connection)
      models/          User.js
      controllers/     authController.js, adminUserController.js (list/search/paginate,
                        block/unblock, promote/demote, remove — with a last-admin guard)
      routes/          authRoutes.js, adminRoutes.js, healthRoutes.js
      middleware/      auth.js (requireAuth), requireAdmin.js, errorHandler.js, notFound.js
      utils/           ApiError.js (statusCode + optional field errors + optional machine
                        code), asyncHandler.js, token.js (JWT), validators.js
      scripts/         seedAdmin.js (CLI — the only way to create the first admin account)
      app.js           Express app (no side effects — importable without a DB connection)
      server.js        Entrypoint — connects DB, then listens
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
| `/login`                    | Auth card, Log In tab active (redirects to `/app/dashboard` if already logged in) |
| `/signup`                   | Auth card, Sign Up tab active (same redirect if already logged in) |
| `/app` → `/app/dashboard`   | **Requires a real session** — redirects to `/login` if logged out |
| `/app/dashboard`            | App shell — Dashboard (real mock content)                      |
| `/app/profile`              | App shell — Profile (real identity header, mock stats)         |
| `/app/practice`             | App shell — Practice discovery (real mock content)             |
| `/app/rankings`             | App shell — Rankings (real mock content)                       |
| `/app/friends`              | App shell — Friends (real mock content)                        |
| `/app/notifications`        | App shell — Notifications (real mock content)                  |
| `/app/admin` → `.../content`| Redirects into the admin section's default screen (admin only — see below) |
| `/app/admin/content`        | App shell — Admin content dashboard (mock content, admin only) |
| `/app/admin/content/new`    | App shell — New Challenge form (mock, admin only)              |
| `/app/admin/content/:id/edit` | App shell — Edit Challenge form (mock, admin only)           |
| `/app/admin/users`          | App shell — Admin user management (real data/actions, admin only) |
| `/app/challenge/:id`        | Full-screen challenge player (own layout, no sidebar) — requires a session |
| `/app/quick-play`           | Full-screen Quick Play flow (own layout, no sidebar) — requires a session |
| `/app/team-mode`            | App shell — Team Mode stub                                     |
| `/app/challenges`           | App shell — Challenges stub                                    |
| `/app/statistics`           | App shell — Statistics stub                                    |
| `/app/settings`             | App shell — Settings stub                                      |
| anything else               | Generic "coming soon" placeholder                              |

Every path prefixed with `/app` is wrapped in `RequireAuth` (`components/auth/RequireAuth.jsx`),
which checks the session once on app load and redirects unauthenticated visitors to `/login`,
preserving the originally-requested path so a successful login sends them back there. The four
`/app/admin/*` routes are additionally wrapped in `RequireAdmin` (`components/auth/RequireAdmin.jsx`),
which redirects a real, logged-in-but-non-admin user to `/app/dashboard` instead. Both are UX
conveniences layered on top of the actual security boundary, which is server-side
(`requireAuth`/`requireAdmin` in `backend/src/middleware/`) — a client-side redirect can be
bypassed by disabling JavaScript or hitting the API directly, but the backend can't be.

## Known limitations

- No automated tests yet, on either the frontend or the backend.
- Only auth and admin user-management talk to a real backend — every other screen's data is still
  hardcoded in components (see "Placeholder / not real yet" above for the full list).
- No live MongoDB connection was available in the environment this backend was built in (no
  internet access to Atlas, no way to install a local `mongod`), so the backend was verified
  several other ways instead: (1) booting the real Express app without a DB connection and
  exercising routing, validation, JWT/role middleware, and CORS directly against every route
  (auth *and* admin) — including confirming all six `/api/admin/*` endpoints correctly 401 with no
  token, before ever touching the database; (2) testing JWT sign/verify, bcrypt hash/compare, and
  the search-query regex-escaping helper in isolation; (3) running the frontend's actual
  `authStore` against a mocked `fetch` through 8 signup/login/session-restore scenarios (Stage
  B1–B3) plus 6 more Stage B6 scenarios (a 401 with a token auto-logs-out with the right message; a
  403 tagged `ACCOUNT_BLOCKED` does the same; a *plain* 403 — e.g. a non-admin hitting an admin
  route — correctly does NOT log out; a network failure during session-restore preserves the stored
  token instead of discarding it; a retry after the network recovers succeeds using that preserved
  token). An actual signup → login → promote-to-admin → manage-users round trip against a real
  Atlas cluster still hasn't been run — see the curl commands in `backend/README.md` to do that
  yourself.
- Icons and copy are illustrative rather than final production copy.
- The challenge player's Monaco editor loads from a CDN at runtime (the standard way
  `@monaco-editor/react` works without extra bundler config) — it needs the end user's browser to
  have internet access the first time it loads. This couldn't be visually verified in this
  environment since there's no browser available here; it was verified by installing/building the
  package and confirming Monaco isn't pulled into the local bundle (see verification notes below).
- There's no browser in this environment, so nothing here was visually screenshotted or manually
  clicked through — verification relied on a clean production build, a clean lint pass, serving the
  build and checking every route returns the right content over HTTP, and close manual reading of
  every animated/interactive component (including testing the admin nav/route gate with both an
  admin-shaped and a non-admin-shaped mocked session). A real frame-rate check on an actual
  machine, and a plain look at the UI, are both still worth doing before treating this as final.
- The production bundle is a single ~540KB (~163KB gzipped) JS file; Vite's build warns about this.
  Nothing is broken by it, but if load time on a slow connection becomes a concern, the challenge
  player and admin screens are reasonable candidates for `React.lazy()` code-splitting later, since
  they're not needed on first load for most visitors.

## Running locally

Both servers need to be running for anything past `/` and `/styleguide` to work.

```bash
# Terminal 1 — backend
cd backend
cp .env.example .env   # fill in MONGODB_URI and JWT_SECRET — see backend/README.md
npm install
npm run dev

# Terminal 2 — frontend
cd frontend
cp .env.example .env   # defaults already point at the backend's default port
npm install
npm run dev
```

Build the frontend for production: `npm run build` (output in `frontend/dist/`). Preview that
build locally with `npm run preview`. The backend has no build step — `npm start` runs it directly.

## Verification performed

- **Backend (Stage B1–B3):** every source file passes `node --check`; `npm install` is clean aside
  from a moderate `qs` advisory transitive through Express 4.x itself (not our code, same
  no-action-needed category as the DOMPurify note below). Booted the real `app.js` (no DB
  connection) and hit every route directly: `/health` → 200 with Mongo state reported, malformed
  signup/login → 400 with the correct field errors, missing/garbage token on `/api/auth/me` → 401,
  unknown route → 404, CORS preflight correctly allows `localhost:5173` and rejects other origins.
  JWT sign/verify and bcrypt hash/compare round-tripped correctly in isolation. The frontend's
  `authStore.js` was run against a mocked `fetch` through 8 real scenarios (see "Known limitations"
  above) — all passed, including the security-conscious bits (generic "invalid email or password"
  on login, no field leaked; duplicate-email signup surfaces the right field error without ever
  flipping the store into an authenticated state).
- **Backend (Stage B4–B6):** every new/changed source file passes `node --check`. Re-booted
  `app.js` and hit every auth and admin route with no token — all six `/api/admin/*` endpoints
  correctly 401 before ever reaching the database, confirming `requireAuth` runs (and rejects)
  ahead of `requireAdmin` and the route handlers, not after. The search-query regex-escaping
  helper (`adminUserController.js`) was unit-tested against strings containing regex metacharacters
  to confirm they can't break out of the pattern. The frontend's `authStore.js` was run through 6
  more mocked-`fetch` scenarios covering exactly the Stage B6 DoD's edge cases — see "Known
  limitations" above for the full list — all passed, including the important negative case: a
  plain 403 (a non-admin token hitting an admin route) does *not* trigger an automatic logout,
  only a 401 or a 403 explicitly tagged `ACCOUNT_BLOCKED` does. Hit a real `oxlint`
  `set-state-in-effect` warning while building `AdminUsersPage`'s data-fetching effect (calling an
  extracted `useCallback`-wrapped fetch function from inside `useEffect`); resolved by inlining a
  cancellation-safe async IIFE directly in the effect instead — which is React's own documented
  data-fetching pattern and, as a side effect, added protection against race conditions from rapid
  search/page changes that the extracted-function version didn't have.
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
- Stage A verified the admin gate by manually flipping `MOCK_USER.role` between `'admin'` and
  `'user'` and rebuilding both ways. As of Stage B4 the gate reads the real authenticated role
  instead, which can't be flipped by hand the same way — verified by code review instead (both
  `Sidebar.jsx`'s visibility check and `RequireAdmin.jsx`'s redirect read the same
  `useCurrentUser()`/`authStore` source, so they can't disagree with each other) plus the backend
  boot-test confirming `requireAdmin` actually rejects a request before it reaches any admin
  route handler.
- A dedicated motion audit (see "Motion & reduced-motion audit" above) went through every
  `transition`/`animate` usage in the codebase via a full-project search, not just a visual
  once-over, and fixed every instance found that didn't already respect reduced motion.
