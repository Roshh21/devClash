import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { verifyToken } from '../utils/token.js';

// Protects a route: requires a valid `Authorization: Bearer <token>`
// header, attaches the corresponding user to req.user, and rejects
// blocked accounts. Every /app/* screen's data endpoints from Stage C
// onward will sit behind this.
//
// Stage B4 adds `requireAdmin`, a second middleware layered on top of
// this one for admin-only routes — this file only establishes *who*
// the caller is, not what they're allowed to do.
export const requireAuth = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : null;

  if (!token) {
    throw new ApiError(401, 'You must be logged in to do that.');
  }

  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    throw new ApiError(401, 'Your session has expired. Please log in again.');
  }

  const user = await User.findById(payload.sub);
  if (!user) {
    throw new ApiError(401, 'Your account could not be found.');
  }
  if (user.status === 'blocked') {
    throw new ApiError(403, 'This account has been blocked. Contact support for help.');
  }

  req.user = user;
  next();
});
