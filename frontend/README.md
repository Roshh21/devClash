# DevClash — Frontend

React + Vite single-page app for DevClash. It calls no backend — everything on screen is static
or hand-written mock data. See `../docs/IMPLEMENTATION.md` for the full implementation record.

## Stack

- React 19 + Vite
- Tailwind CSS (custom design tokens via CSS variables)
- Framer Motion (animation)
- Zustand (local UI state — currently just theme)
- React Router
- lucide-react (icons)
- @monaco-editor/react (code editor in the challenge player)

## Getting started

```bash
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
  store/           Zustand stores
  lib/             Motion presets, hooks, and mock data files
  styles/          Design tokens (tokens.css) and global styles (globals.css)
```

## Environment

Copy `.env.example` to `.env`. `VITE_API_BASE_URL` is a placeholder — nothing reads it yet.

## Routes

See `../docs/IMPLEMENTATION.md` for the full, up-to-date routing table. Quick reference: `/`
(landing), `/styleguide` (design system), `/login`/`/signup` (shared auth card), `/app/dashboard`,
`/app/profile`, `/app/practice`, `/app/rankings`, `/app/friends`, `/app/notifications`, and
`/app/admin/*` (real mock content, admin routes gated by a mock role flag), `/app/challenge/:id`
and `/app/quick-play` (full-screen flows, own layout, no sidebar), and the remaining `/app/*`
routes (Team Mode, Challenges, Statistics, Settings — still placeholder screens).
