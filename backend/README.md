# DevClash — Backend

Stage B1–B3: a real Node/Express API backing the frontend's auth screens.
Everything else (question bank, matchmaking, evaluation, real-time...) grows
into this over later stages — see `../docs/IMPLEMENTATION.md` for the
project-wide picture.

## What's real right now

- `GET /health` — liveness check, reports Mongo connection state
- `POST /api/auth/signup` — creates a user, returns `{ user, token }`
- `POST /api/auth/login` — verifies credentials, returns `{ user, token }`
- `GET /api/auth/me` — returns the current user for a valid token (used to
  restore a session on page refresh)
- `POST /api/auth/logout` — no-op today (stateless JWT); exists so the
  frontend always has something to call

Auth is JWT via `Authorization: Bearer <token>` — **not** a cookie. That's a
deliberate choice: the frontend (Vercel) and this API will very likely end up
on different domains once deployed (Stage L8), and Bearer tokens sidestep
cross-site cookie/SameSite complications entirely. The token is signed with
`JWT_SECRET` and carries just the user id (`sub` claim).

## What's not real yet

- No `requireAdmin` / role enforcement on the server (Stage B4)
- No way to seed or promote an admin account (Stage B4)
- No rate limiting, no account lockout, no password reset (Stage B6 / L1)
- No question bank, matchmaking, or anything else outside auth — those
  routes don't exist yet

## Setup

1. **MongoDB Atlas** — create a free cluster if you haven't (per the
   roadmap's setup checklist). Get your connection string from
   Atlas → Connect → Drivers.
2. **Copy the env file:**
   ```bash
   cp .env.example .env
   ```
3. **Fill in `.env`:**
   - `MONGODB_URI` — your Atlas connection string (include a database name,
     e.g. `.../devclash?retryWrites=true&w=majority`)
   - `JWT_SECRET` — any long random string. Generate one with:
     ```bash
     node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
     ```
   - Leave `PORT`, `JWT_EXPIRES_IN`, and `CORS_ORIGIN` at their defaults for
     local dev — `CORS_ORIGIN` already matches Vite's default port (5173).
4. **Install and run:**
   ```bash
   npm install
   npm run dev
   ```
   You should see:
   ```
   [db] connected → devclash
   [server] DevClash API listening on http://localhost:4000
   [server] Health check: http://localhost:4000/health
   ```
5. **Point the frontend at it** — in `../frontend`, copy `.env.example` to
   `.env` (it already defaults to `http://localhost:4000`, matching this
   API's default port).

If step 4 fails immediately with a MongoDB connection error, double-check
`MONGODB_URI` — in particular that your Atlas user's password doesn't need
URL-encoding (special characters like `@` or `#` in the password will break
the connection string) and that your current IP is allowed in Atlas's
Network Access settings.

## Smoke-testing it yourself

Once the server is running, these should all work end to end:

```bash
# Health check
curl http://localhost:4000/health

# Sign up
curl -X POST http://localhost:4000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"roshni_dev","email":"roshni@example.com","password":"password123"}'
# → 201, { user: {...}, token: "..." }

# Try it again with the same email — should be a 409 with a field error
curl -X POST http://localhost:4000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"someoneelse","email":"roshni@example.com","password":"password123"}'

# Log in
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"roshni@example.com","password":"password123"}'
# → 200, { user: {...}, token: "..." }

# Use the token from either response above
curl http://localhost:4000/api/auth/me \
  -H "Authorization: Bearer PASTE_TOKEN_HERE"
# → 200, { user: {...} }

# Missing/garbage token
curl http://localhost:4000/api/auth/me
curl http://localhost:4000/api/auth/me -H "Authorization: Bearer garbage"
# → both 401
```

Then check MongoDB Atlas directly (Collections tab) — you should see a
`users` collection with your account, and `passwordHash` should be a bcrypt
hash, never the plaintext password.

**From the actual frontend:** run `npm run dev` in `../frontend` with both
servers up, visit `/signup`, create an account, and you should land on
`/app/dashboard` with your real username in the sidebar/topbar. Refresh the
page — you should stay logged in (this is `GET /api/auth/me` restoring the
session from the stored token). Log out, then try visiting `/app/dashboard`
directly — you should get bounced to `/login`.

## Project structure

```
backend/
  src/
    config/       # env loading + validation, MongoDB connection
    models/       # Mongoose schemas (User for now)
    controllers/  # request handlers (authController)
    routes/       # route → controller wiring
    middleware/   # requireAuth, error handling, 404
    utils/        # ApiError, asyncHandler, JWT sign/verify, validators
    app.js        # Express app (importable without a DB connection)
    server.js     # entrypoint — connects DB, then listens
  .env.example
```

`app.js` and `server.js` are split on purpose: `app.js` has no side effects
(no DB connection, no `listen()`), which is what let me boot-test routing,
validation, and error handling in isolation before you ever add a database.

## A note on the `qs` audit warning

`npm audit` will flag a moderate advisory in `qs`, pulled in transitively by
Express 4.x itself — not something this project's code touches directly. No
action needed for now; the same category of thing is already noted in the
frontend's `docs/IMPLEMENTATION.md` re: a DOMPurify advisory via
monaco-editor.
