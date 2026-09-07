# DevClash — Frontend

React + Vite single-page app for DevClash. Right now it ships the public landing page and the
shared design system every later screen will be built from. It calls no backend — everything on
screen is static or hand-written mock data.

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
    ui/        Reusable, theme-aware primitives (Button, Input, Card, Badge, Tabs, Modal, Skeleton, ThemeToggle)
    layout/    Navbar, Footer, PageTransition
    landing/   Landing-page-only sections (Hero, FeatureStrip, CodeWindowMock)
  pages/       Route-level screens
  store/       Zustand stores
  lib/         Motion presets + small utilities
  styles/      Design tokens (tokens.css) and global styles (globals.css)
```

## Environment

Copy `.env.example` to `.env`. `VITE_API_BASE_URL` is a placeholder — nothing reads it yet.

## Routes

See `../docs/IMPLEMENTATION.md` for the full, up-to-date routing table and implementation record.
Quick reference: `/` (landing), `/styleguide` (design system), `/login` and `/signup` (shared auth
card), `/app/dashboard`, `/app/profile`, `/app/practice`, and `/app/rankings` (real mock content),
`/app/challenge/:id` and `/app/quick-play` (full-screen flows, own layout, no sidebar), and the
rest of `/app/*` (Team Mode, Challenges, Friends, Statistics, Notifications, Settings — still
placeholder screens).
