// A thrown ApiError carries everything errorHandler.js needs to shape
// a clean JSON response — a status code, a human message, optionally
// per-field validation errors the frontend's <Input> components can
// render inline (matching Stage A3/B2's error shape), and optionally
// a machine-readable `code` for cases where the frontend needs to
// react differently to two errors that share a status code — e.g.
// requireAdmin's plain 403 ("you're logged in, just not an admin")
// vs requireAuth's blocked-account 403 ("your session is no longer
// valid at all") need very different frontend handling even though
// both are 403s.
export class ApiError extends Error {
  constructor(statusCode, message, errors, code) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errors = errors;
    this.code = code;
  }
}
