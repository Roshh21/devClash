# DevClash

A competitive programming / engineering-challenge platform, built incrementally.

## Layout

- `frontend/` — the React app. A complete, mostly mock-data-driven frontend: public landing page,
  shared design system (`/styleguide`), an authenticated app shell with sidebar/topbar, dashboard,
  profile, practice discovery, a full challenge player (real Monaco editor), a scripted Quick Play
  flow, rankings, friends, notifications, and an admin section. **Auth is now real** (see below) —
  everything past login is still mock-data-driven. See `docs/IMPLEMENTATION.md` for exactly what's
  real vs. mocked.
- `backend/` — a real Node/Express API. Currently covers Stage B1–B3: signup, login, sessions,
  and protected routes. See `backend/README.md` for setup and endpoint docs.
- `DevClash-Bank/` — reserved for future challenge/scenario content. Empty for now.
- `docs/IMPLEMENTATION.md` — a practical, up-to-date record of what's actually built, what's
  mocked, and what's missing. Also notes that deployment hasn't been attempted (needs a hosting
  account this environment doesn't have) — everything else is ready for it.

## Quick start

You need both servers running for anything past the landing page and style guide to work — the
auth screens, and everything behind them, now depend on the backend being up.

**1. Backend** (see `backend/README.md` for the full walkthrough, including MongoDB Atlas setup):

```bash
cd backend
cp .env.example .env   # then fill in MONGODB_URI and JWT_SECRET
npm install
npm run dev
```

**2. Frontend**, in a second terminal:

```bash
cd frontend
cp .env.example .env   # defaults already match the backend's default port
npm install
npm run dev
```

Then visit `/signup` to create a real account — you'll land in the authenticated app shell with
everything after login still running on mock data, exactly as before.

See `frontend/README.md` and `backend/README.md` for more detail, and `docs/IMPLEMENTATION.md`
before assuming anything is "real" — most of the app past login is intentionally still
static/mocked at this stage.
