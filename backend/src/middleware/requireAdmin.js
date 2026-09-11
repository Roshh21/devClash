import { ApiError } from '../utils/ApiError.js';

// Stage B4: the real, server-enforced counterpart to the frontend's
// mock `MOCK_USER.role === 'admin'` sidebar gate. Always used after
// requireAuth (needs req.user already populated) — see
// routes/adminUserRoutes.js and routes/adminChallengeRoutes.js, which
// each apply both as `router.use(...)`.
//
// Deliberately a plain 403 with no `code` — unlike requireAuth's
// blocked-account rejection, this does NOT mean the caller's session
// is invalid, just that this particular action isn't allowed. The
// frontend's global unauthorized-handler (lib/api.js) only reacts to
// 401s and the ACCOUNT_BLOCKED code, so a non-admin hitting this
// stays logged in and just sees the error inline.
export function requireAdmin(req, res, next) {
  if (!req.user) {
    // Shouldn't happen if requireAuth ran first — fail safe rather
    // than silently treating a missing user as "not admin".
    throw new ApiError(401, 'You must be logged in to do that.');
  }

  if (req.user.role !== 'admin') {
    throw new ApiError(403, 'Admins only.');
  }

  next();
}
