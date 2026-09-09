# DevClash — Frontend

React + Vite single-page app for DevClash. As of Stage B1–B3, auth (`/login`, `/signup`, and every
`/app/*` route) is wired to a real backend — see `../backend`. Everything past login is still
static or hand-written mock data. See `../docs/IMPLEMENTATION.md` for the full implementation
record.

## Stack

- React 19 + Vite
- Tailwind CSS (custom design tokens via CSS variables)
- Framer Motion (animation)
- Zustand (theme, and now real auth session state — `store/authStore.js`)
- React Router (with a real `RequireAuth` guard on every `/app/*` route)
- lucide-react (icons)
- @monaco-editor/react (code editor in the challenge player)

## Getting started

Requires the backend running too (see `../backend/README.md`) — auth, and everything behind it,
won't work without it.

```bash
cp .env.example .env   # defaults already match the backend's default port (4000)
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

## Structure

```
src/
  components/
    ui/            Reusable, theme-aware primitives (Button, Input, Textarea, Card, Badge, Tabs,
                    Modal, Skeleton, ThemeToggle, Select, ProgressRing, ProgressBar, Sparkline,
                    Pagination, InlineNotice, EmptyTabState, StatTile, Checkbox)
    layout/        Navbar, Footer, PageTransition, AppShell, Sidebar, Topbar, NotificationBell
    auth/          RequireAuth (route guard)
    landing/       Landing-page-only sections (Hero, FeatureStrip, CodeWindowMock)
    dashboard/     Dashboard-only sections
    profile/       Profile-only sections
    practice/      Practice-only sections
    challenge/     Challenge player sections (Monaco wrapper, timer, status pill)
    quickplay/     Quick Play flow sections
    rankings/      Rankings-only sections
    social/        Friends-only sections
    notifications/ Notification row + skeleton
    admin/         Admin-only sections
  pages/           Route-level screens
  store/           Zustand stores — themeStore.js, authStore.js (real session)
  lib/             Motion presets, hooks, mock data files, api.js (backend fetch wrapper),
                    useCurrentUser.js (real identity + still-mocked gamification fields)
  styles/          Design tokens (tokens.css) and global styles (globals.css)
```

## Environment

Copy `.env.example` to `.env`. `VITE_API_BASE_URL` points at the backend — see
`../backend/README.md` for running it locally, and update this if you deploy the backend
elsewhere.

## Routes

See `../docs/IMPLEMENTATION.md` for the full, up-to-date routing table. Quick reference: `/`
(landing), `/styleguide` (design system), `/login`/`/signup` (shared auth card — real signup/login,
redirects to `/app/dashboard` if already logged in), `/app/dashboard`, `/app/profile`,
`/app/practice`, `/app/rankings`, `/app/friends`, `/app/notifications`, and `/app/admin/*` (real
mock content; admin *routes* are still gated by a mock role flag pending Stage B4 — see
`docs/IMPLEMENTATION.md`), `/app/challenge/:id` and `/app/quick-play` (full-screen flows, own
layout, no sidebar), and the remaining `/app/*` routes (Team Mode, Challenges, Statistics,
Settings — still placeholder screens). Every `/app/*` route requires a real session — visiting one
while logged out redirects to `/login`.
