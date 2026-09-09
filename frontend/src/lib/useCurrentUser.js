import { useAuthStore } from '../store/authStore';
import { MOCK_USER } from './mockUser';

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

// Stage B3 replaces *who's logged in* (name, initials, role) with the
// real authenticated user. It deliberately does NOT touch rating,
// league, or tagline — the backend has no concept of those yet
// (Stage E adds MMR/leagues, Profile-editing persistence is later
// still), so those three fields keep coming from the Stage A mock
// until a real stage wires them up.
//
// Falls back to MOCK_USER wholesale when there's no authenticated
// user, which in practice only matters for components rendered
// outside the protected /app/* shell (RequireAuth keeps everything
// inside it gated to a real session).
export function useCurrentUser() {
  const user = useAuthStore((s) => s.user);

  if (!user) {
    return MOCK_USER;
  }

  return {
    name: user.username,
    initials: getInitials(user.username),
    role: user.role,
    email: user.email,
    rating: MOCK_USER.rating,
    league: MOCK_USER.league,
    tagline: MOCK_USER.tagline,
  };
}
