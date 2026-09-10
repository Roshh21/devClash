// A single, tiny fetch wrapper so every screen that talks to the
// backend does it the same way — one place to read the base URL,
// attach a token, and shape errors — rather than hand-rolling fetch
// calls per screen. This is the network layer .env.example's
// VITE_API_BASE_URL was always waiting for.
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

export class ApiError extends Error {
  constructor(message, status, fieldErrors, code) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.fieldErrors = fieldErrors;
    this.code = code;
  }
}

// Stage B6: lets authStore.js react when a request that carried a
// token comes back saying that session is no longer usable — an
// expired/invalid token (401), or an account that got blocked mid-
// session (403 with code 'ACCOUNT_BLOCKED'). Deliberately does NOT
// fire on a plain 403 with no code (e.g. requireAdmin rejecting a
// non-admin) — that means the session is still perfectly valid, just
// not permitted for that one action, so the caller should stay logged
// in and just see the error.
//
// A plain callback registry rather than authStore importing this
// module (which it already does) importing authStore back — that
// circular dependency isn't worth it for one callback.
let unauthorizedHandler = null;
export function setUnauthorizedHandler(fn) {
  unauthorizedHandler = fn;
}

async function request(path, { method = 'GET', body, token, headers = {} } = {}) {
  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: {
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    // Network failure (backend not running, no connection, CORS
    // block, etc.) — fetch throws before we ever get a response.
    throw new ApiError("Can't reach the server right now. Please try again.", 0);
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    // No JSON body (e.g. a 204, or a non-JSON error page) — fine.
  }

  if (!res.ok) {
    const message = data?.message || 'Something went wrong. Please try again.';
    const code = data?.code;

    // Only a request that carried a token can represent "your session
    // died" — an unauthenticated request (e.g. the login form itself)
    // getting a 401 just means wrong credentials, not an invalidated
    // session, so it must never trigger this.
    const sessionInvalidated = Boolean(token) && (res.status === 401 || code === 'ACCOUNT_BLOCKED');
    if (sessionInvalidated && unauthorizedHandler) {
      unauthorizedHandler(message);
    }

    throw new ApiError(message, res.status, data?.errors, code);
  }

  return data;
}

export const api = {
  get: (path, opts) => request(path, { ...opts, method: 'GET' }),
  post: (path, body, opts) => request(path, { ...opts, method: 'POST', body }),
  patch: (path, body, opts) => request(path, { ...opts, method: 'PATCH', body }),
  delete: (path, opts) => request(path, { ...opts, method: 'DELETE' }),
};
