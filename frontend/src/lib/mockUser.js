// The original Stage A "logged in as Roshni" identity. As of Stage B3
// this is no longer the source of truth for who's logged in — that's
// real now (see store/authStore.js, lib/useCurrentUser.js). This file
// lives on only as the fallback for fields the backend still doesn't
// have: rating/league/tagline (Stage E/K). `role` below is no longer
// read anywhere — Stage B4 replaced every use of it with the real,
// server-enforced role (see components/layout/Sidebar.jsx and
// components/auth/RequireAdmin.jsx) — kept here in case a future
// logged-out fallback needs it again.
export const MOCK_USER = {
  name: 'Roshni',
  initials: 'R',
  rating: 1523,
  league: 'Diamond II',
  tagline: 'Building. Learning. Competing.',
  role: 'admin',
};
