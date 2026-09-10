import { create } from 'zustand';
import { api, ApiError, setUnauthorizedHandler } from '../lib/api';

const TOKEN_KEY = 'devclash-token';

function getStoredToken() {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function persistToken(token) {
  try {
    if (token) window.localStorage.setItem(TOKEN_KEY, token);
    else window.localStorage.removeItem(TOKEN_KEY);
  } catch {
    // localStorage unavailable (private browsing, etc.) — the session
    // just won't survive a refresh, same failure mode as themeStore.js.
  }
}

function readError(err) {
  if (err instanceof ApiError) {
    return { message: err.message, fieldErrors: err.fieldErrors };
  }
  return { message: 'Something went wrong. Please try again.' };
}

// Real session state — this is what Stage A4's hardcoded "logged in
// as Roshni" flag becomes. `status` drives RequireAuth:
//   'idle'          — haven't checked for a stored token yet
//   'loading'       — checking a stored token against GET /me
//   'authenticated' — real user, real token
//   'unauthenticated' — no valid session; protected routes redirect
export const useAuthStore = create((set, get) => {
  // Stage B6: registered once, at module load. Fires when ANY request
  // that carried a token comes back saying that session is no longer
  // usable (expired/invalid token, or an account blocked mid-session)
  // — see lib/api.js for exactly what triggers it. This is what makes
  // token expiry/blocking handled everywhere a token-bearing request
  // happens, not just on the login page.
  setUnauthorizedHandler((message) => {
    get().logout(message);
  });

  return {
    user: null,
    token: getStoredToken(),
    status: 'idle',
    error: null,
    // Set by logout() when it was triggered by the server rejecting an
    // existing session (vs. the user clicking "Log out" themselves, which
    // passes no message) — AuthPage shows this once, then clears it.
    sessionMessage: null,

    // Called once on app mount (see App.jsx). Idempotent — safe under
    // React StrictMode's double-invoked effects.
    async initialize() {
      if (get().status !== 'idle') return;

      const token = get().token;
      if (!token) {
        set({ status: 'unauthenticated' });
        return;
      }

      set({ status: 'loading' });
      try {
        const data = await api.get('/api/auth/me', { token });
        set({ user: data.user, status: 'authenticated', sessionMessage: null });
      } catch (err) {
        // A network failure (server unreachable, dropped connection)
        // doesn't mean the session is invalid — don't discard a
        // possibly-still-good token over a momentary blip. Leaving the
        // token in place means the next app load (or an explicit
        // retry) tries it again instead of forcing a fresh login.
        if (err instanceof ApiError && err.status === 0) {
          set({ status: 'unauthenticated' });
          return;
        }
        // Any other failure (401, blocked, or an unexpected 500): the
        // unauthorizedHandler above already ran logout() for the
        // 401/blocked cases. This covers the rest — better to ask for
        // a fresh login than keep treating a possibly-broken token as
        // good.
        persistToken(null);
        set({ user: null, token: null, status: 'unauthenticated' });
      }
    },

    async signup({ username, email, password }) {
      set({ error: null });
      try {
        const data = await api.post('/api/auth/signup', { username, email, password });
        persistToken(data.token);
        set({ user: data.user, token: data.token, status: 'authenticated', sessionMessage: null });
        return { ok: true };
      } catch (err) {
        const { message, fieldErrors } = readError(err);
        set({ error: message });
        return { ok: false, message, fieldErrors };
      }
    },

    async login({ email, password }) {
      set({ error: null });
      try {
        const data = await api.post('/api/auth/login', { email, password });
        persistToken(data.token);
        set({ user: data.user, token: data.token, status: 'authenticated', sessionMessage: null });
        return { ok: true };
      } catch (err) {
        const { message, fieldErrors } = readError(err);
        set({ error: message });
        return { ok: false, message, fieldErrors };
      }
    },

    // `message` is set when this was triggered by the server (session
    // expired, account blocked mid-session) rather than the user
    // clicking "Log out" themselves (Topbar passes none).
    logout(message) {
      // Stateless JWT — nothing meaningful to await on the server yet
      // (see backend authController.logout). Clearing local state is
      // what actually ends the session from the browser's perspective.
      persistToken(null);
      set({ user: null, token: null, status: 'unauthenticated', error: null, sessionMessage: message || null });
    },
  };
});
