import { create } from 'zustand';
import { api, ApiError } from '../lib/api';

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
export const useAuthStore = create((set, get) => ({
  user: null,
  token: getStoredToken(),
  status: 'idle',
  error: null,

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
      set({ user: data.user, status: 'authenticated' });
    } catch {
      // Stored token is invalid/expired/for a deleted account.
      persistToken(null);
      set({ user: null, token: null, status: 'unauthenticated' });
    }
  },

  async signup({ username, email, password }) {
    set({ error: null });
    try {
      const data = await api.post('/api/auth/signup', { username, email, password });
      persistToken(data.token);
      set({ user: data.user, token: data.token, status: 'authenticated' });
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
      set({ user: data.user, token: data.token, status: 'authenticated' });
      return { ok: true };
    } catch (err) {
      const { message, fieldErrors } = readError(err);
      set({ error: message });
      return { ok: false, message, fieldErrors };
    }
  },

  logout() {
    // Stateless JWT — nothing meaningful to await on the server yet
    // (see backend authController.logout). Clearing local state is
    // what actually ends the session from the browser's perspective.
    persistToken(null);
    set({ user: null, token: null, status: 'unauthenticated', error: null });
  },
}));
