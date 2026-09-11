# DevClash — Backend

Stage B1–B6 + C1–C2: a real Node/Express API backing the frontend's auth, admin-user-management,
and admin-challenge-authoring screens. Everything else (matchmaking, evaluation, real-time...)
grows into this over later stages — see `../docs/IMPLEMENTATION.md` for the project-wide picture.

## What's real right now

- `GET /health` — liveness check, reports Mongo connection state
- `POST /api/auth/signup` — creates a user, returns `{ user, token }`
- `POST /api/auth/login` — verifies credentials, returns `{ user, token }`
- `GET /api/auth/me` — returns the current user for a valid token (used to
  restore a session on page refresh)
- `POST /api/auth/logout` — no-op today (stateless JWT); exists so the
  frontend always has something to call
- `GET /api/admin/users?search=&page=&limit=` — paginated/searchable user list (admin only)
- `PATCH /api/admin/users/:id/block` / `.../unblock` — toggle account access (admin only)
- `PATCH /api/admin/users/:id/promote` / `.../demote` — toggle the admin role (admin only)
- `DELETE /api/admin/users/:id` — permanently remove an account (admin only)
- `POST /api/admin/challenges` — create a draft challenge (admin only)
- `GET /api/admin/challenges/:id` — fetch one challenge, for the Edit form (admin only)
- `PATCH /api/admin/challenges/:id` — update a challenge, full re-validation (admin only)

Every `/api/admin/*` route requires a valid session **and** the admin role
(`requireAuth` + `requireAdmin`, both in `src/middleware/`). Demoting, blocking, or removing the
only remaining admin account is rejected with a 400 — there's no way to lock the system out of
having an admin. Challenges have no such guard to speak of yet — any admin can create/edit any
challenge, matching the same "any admin can manage anything" convention as user management.

The challenge endpoints implement Stage C1's generic content contract — one schema covering all
five challenge types (MCQ/Output/Coding/Debugging/SQL), with type-specific validation. See
`../DevClash-Bank/docs/CHALLENGE_SCHEMA.md` for the full documented contract, and
`../DevClash-Bank/README.md` for why this content lives in this backend rather than a separate
service. Every challenge is created as `status: 'draft'` — nothing created here is visible to a
regular user yet (there's no user-facing retrieval endpoint at all until Stage C4).

Auth is JWT via `Authorization: Bearer <token>` — **not** a cookie. That's a
deliberate choice: the frontend (Vercel) and this API will very likely end up
on different domains once deployed (Stage L8), and Bearer tokens sidestep
cross-site cookie/SameSite complications entirely. The token is signed with
`JWT_SECRET` and carries just the user id (`sub` claim) — role isn't in the token, so
`requireAdmin` always checks the *current* role from the database, not a snapshot from login time.

Error responses look like `{ message, errors?, code? }`. `errors` is per-field (matching the
frontend's inline validation), used on 400s. `code` is a machine-readable tag used only when the
frontend needs to distinguish two errors that share a status code — right now just
`ACCOUNT_BLOCKED` on a 403, which the frontend treats as "your session just died" and logs you out
with that message, versus a plain 403 (e.g. `requireAdmin` rejecting a non-admin) which leaves you
logged in and just shows the error.

## What's not real yet

- No rate limiting, no account lockout, no password reset (Stage L1)
- No publish/review workflow for challenges yet — every challenge is stuck at `status: 'draft'`
  forever until Stage C3 implements the real lifecycle transitions
- No user-facing challenge retrieval (Stage C4) — challenges exist only for admins to create/edit
- No matchmaking, evaluation, or anything else outside auth/admin — those routes don't exist yet

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
6. **Get your first admin account.** There's no signup flow or API endpoint that creates an
   admin — every signup defaults to `role: 'user'`, and every admin endpoint requires an admin to
   already be logged in. Break that chicken-and-egg problem once:
   - Sign up for a real account through the frontend (`/signup`).
   - Promote it:
     ```bash
     npm run seed:admin -- you@example.com
     ```
   - Refresh the frontend (or log out and back in) — the Admin sidebar section only appears
     after the app re-checks your role, which happens on load, not automatically mid-session.

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

**Admin endpoints** (after running `npm run seed:admin` on your account, per step 6 above — paste
a *fresh* token from logging in again after seeding, since the one from before you were promoted
still works fine, but grabbing a new one is a good sanity check that login still reflects your
current role each time):

```bash
# List users
curl "http://localhost:4000/api/admin/users?limit=5" \
  -H "Authorization: Bearer PASTE_ADMIN_TOKEN_HERE"

# Search
curl "http://localhost:4000/api/admin/users?search=roshni" \
  -H "Authorization: Bearer PASTE_ADMIN_TOKEN_HERE"

# Block/unblock, promote/demote (swap in a real user id from the list above)
curl -X PATCH "http://localhost:4000/api/admin/users/PASTE_USER_ID/block" \
  -H "Authorization: Bearer PASTE_ADMIN_TOKEN_HERE"

# A non-admin token hitting any of these should get a plain 403 "Admins only."
# — sign up a second, throwaway account and try it with that one's token.

# Removing/demoting the only admin account should be rejected with a 400,
# even as that same admin — try it on yourself if you're the only admin:
curl -X DELETE "http://localhost:4000/api/admin/users/YOUR_OWN_ADMIN_ID" \
  -H "Authorization: Bearer PASTE_ADMIN_TOKEN_HERE"
# → 400, "Can't remove the only remaining admin account."
```

**Challenge endpoints** (same admin token as above):

```bash
# Create a draft challenge from one of the real, pre-validated samples
curl -X POST http://localhost:4000/api/admin/challenges \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer PASTE_ADMIN_TOKEN_HERE" \
  -d @../DevClash-Bank/samples/arrays-two-sum.coding.json
# → 201, { challenge: { id, status: "draft", version: 1, content: {...}, ... } }

# Fetch it back (swap in the id from the response above)
curl http://localhost:4000/api/admin/challenges/PASTE_CHALLENGE_ID \
  -H "Authorization: Bearer PASTE_ADMIN_TOKEN_HERE"

# Try a deliberately invalid one — an MCQ missing two of its four options
curl -X POST http://localhost:4000/api/admin/challenges \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer PASTE_ADMIN_TOKEN_HERE" \
  -d '{"title":"x","type":"MCQ","category":"x","difficulty":"Easy","description":"x","estimatedTime":"5 min","options":["a","b","",""],"correctOption":0}'
# → 400, { message: "Please fix the highlighted fields.", errors: { options: "Fill in all four options" } }

# A non-existent or malformed id → 404, not a 500
curl http://localhost:4000/api/admin/challenges/not-a-real-id \
  -H "Authorization: Bearer PASTE_ADMIN_TOKEN_HERE"
```

See `../DevClash-Bank/samples/` for one ready-to-use example per challenge type, and
`../DevClash-Bank/docs/CHALLENGE_SCHEMA.md` for exactly what each type requires.

**From the actual frontend:** run `npm run dev` in `../frontend` with both
servers up, visit `/signup`, create an account, and you should land on
`/app/dashboard` with your real username in the sidebar/topbar. Refresh the
page — you should stay logged in (this is `GET /api/auth/me` restoring the
session from the stored token). Log out, then try visiting `/app/dashboard`
directly — you should get bounced to `/login`. After seeding yourself as admin and refreshing,
the Admin section appears in the sidebar and `/app/admin/users` shows your real accounts with
working Block/Promote/Remove actions; visiting that URL as a non-admin account redirects to the
dashboard instead of showing the (functionally broken, for them) admin screen. From
`/app/admin/content`, click "New Challenge" (the dashboard rows themselves are still Stage A mock
— see `../docs/IMPLEMENTATION.md` — but the New Challenge button isn't) and save one: you should land
on that challenge's own real Edit page with a "Challenge created." notice, and reloading that page
should show the same data you entered, fetched fresh from the backend.

## Project structure

```
backend/
  src/
    config/       # env loading + validation, MongoDB connection
    models/       # Mongoose schemas (User, Challenge)
    controllers/  # request handlers (authController, adminUserController,
                  # adminChallengeController)
    routes/       # route → controller wiring (authRoutes, adminUserRoutes,
                  # adminChallengeRoutes, healthRoutes)
    middleware/   # requireAuth, requireAdmin, errorHandler, notFound
    utils/        # ApiError, asyncHandler, JWT sign/verify, validators,
                  # challengeValidators (type-aware, mirrors the admin form)
    scripts/      # seedAdmin.js — the only way to create the first admin account
    app.js        # Express app (no side effects — importable without a DB connection)
    server.js     # Entrypoint — connects DB, then listens
  .env.example
```

`app.js` and `server.js` are split on purpose: `app.js` has no side effects
(no DB connection, no `listen()`), which is what let me boot-test routing,
validation, and error handling in isolation before you ever add a database.

## A note on the `qs` audit warning

`npm audit` will flag a moderate advisory in `qs`, pulled in transitively by
Express 4.x itself — not something this project's code touches directly. No
action needed for now; the same category of thing is already noted in
`../docs/IMPLEMENTATION.md` re: a DOMPurify advisory via monaco-editor.
