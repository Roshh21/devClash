# DevClash

A competitive programming / engineering-challenge platform, built incrementally.

## Layout

- `frontend/` — the React app. A complete, mock-data-driven frontend: public landing page, shared
  design system (`/styleguide`), auth screens, an authenticated app shell with sidebar/topbar,
  dashboard, profile, practice discovery, a full challenge player (real Monaco editor), a scripted
  Quick Play flow, rankings, friends, notifications, and a role-gated admin section. Nothing is
  connected to a real backend yet — see `docs/IMPLEMENTATION.md` for exactly what's real vs. mocked.
- `backend/` — reserved for the future API. Empty for now.
- `DevClash-Bank/` — reserved for future challenge/scenario content. Empty for now.
- `docs/IMPLEMENTATION.md` — a practical, up-to-date record of what's actually built, what's
  mocked, and what's missing. Also notes that deployment hasn't been attempted (needs a hosting
  account this environment doesn't have) — everything else is ready for it.

## Quick start

```bash
cd frontend
npm install
npm run dev
```

See `frontend/README.md` for more detail, and `docs/IMPLEMENTATION.md` before assuming anything
is "real" — most of the app is intentionally static/mocked at this stage.

