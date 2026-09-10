import { Navigate } from 'react-router-dom';
import { useCurrentUser } from '../../lib/useCurrentUser';

// Wraps the nested /app/admin/* routes. A parent route already runs
// RequireAuth, guaranteeing a real session by the time this renders —
// this only needs to check the role, not loading/redirect-to-login
// states.
//
// This is a UX convenience, not the security boundary: the real
// enforcement is server-side (backend/src/middleware/requireAdmin.js,
// applied to every /api/admin/* route). Without this, a non-admin who
// bookmarked or guessed an admin URL would still just see a page that
// 403s on every action — this sends them back to the dashboard
// instead, which is a better experience but not what's actually
// keeping their data safe.
export default function RequireAdmin({ children }) {
  const currentUser = useCurrentUser();

  if (currentUser.role !== 'admin') {
    return <Navigate to="/app/dashboard" replace />;
  }

  return children;
}
