# DevClash

A competitive programming / engineering-challenge platform, built incrementally.

## Layout

- `frontend/` — the React app. Implemented so far: the public landing page and the shared design
  system (colors, glass-card surface, buttons, inputs, badges, tabs, modal, skeleton loaders,
  theme toggle) at `/styleguide`.
- `backend/` — reserved for the future API. Empty for now.
- `DevClash-Bank/` — reserved for future challenge/scenario content. Empty for now.
- `docs/IMPLEMENTATION.md` — a practical, up-to-date record of what's actually built, what's
  mocked, and what's missing.

## Quick start

```bash
cd frontend
npm install
npm run dev
```

See `frontend/README.md` for more detail, and `docs/IMPLEMENTATION.md` before assuming anything
is "real" — most of the app is intentionally static/mocked at this stage.
