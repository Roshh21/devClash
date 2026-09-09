// The original Stage A "logged in as Roshni" identity. As of Stage B3
// this is no longer the source of truth for who's logged in — that's
// real now (see store/authStore.js, lib/useCurrentUser.js). This file
// lives on as the fallback for fields the backend doesn't have yet:
// rating/league/tagline (Stage E/K), and — deliberately, until Stage
// B4 adds real admin enforcement — the `role` flag that gates the
// Admin sidebar section in components/layout/Sidebar.jsx.
export const MOCK_USER = {
  name: 'Roshni',
  initials: 'R',
  rating: 1523,
  league: 'Diamond II',
  tagline: 'Building. Learning. Competing.',
  // Set to 'user' to verify the admin section correctly disappears —
  // Stage B4 ("Roles & admin authorization") replaces this with a
  // real, server-enforced role.
  role: 'admin',
};
