import { Navigate, useLocation } from 'react-router-dom';
import { Code2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

// Wraps the /app/* shell (and the two full-screen flows outside it —
// the challenge player and Quick Play). Stage B3's replacement for
// "there's no route guard yet, /app/* is just reachable directly."
//
// While a stored token is being checked against GET /me, this shows
// a brief branded loading state rather than flashing the login page
// and then yanking the user into the app a moment later.
export default function RequireAuth({ children }) {
  const status = useAuthStore((s) => s.status);
  const location = useLocation();

  if (status === 'idle' || status === 'loading') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-bg">
        <span className="flex h-10 w-10 animate-pulse items-center justify-center rounded-lg bg-accent text-accent-contrast">
          <Code2 size={20} />
        </span>
        <p className="text-sm text-secondary">Checking your session…</p>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
