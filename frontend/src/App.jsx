import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import PageTransition from './components/layout/PageTransition';
import AppShell from './components/layout/AppShell';
import RequireAuth from './components/auth/RequireAuth';
import RequireAdmin from './components/auth/RequireAdmin';
import { useAuthStore } from './store/authStore';
import LandingPage from './pages/LandingPage';
import StyleGuidePage from './pages/StyleGuidePage';
import AuthPage from './pages/AuthPage';
import ComingSoonPage from './pages/ComingSoonPage';
import StubPage from './pages/StubPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import PracticePage from './pages/PracticePage';
import ChallengePlayerPage from './pages/ChallengePlayerPage';
import QuickPlayPage from './pages/QuickPlayPage';
import RankingsPage from './pages/RankingsPage';
import FriendsPage from './pages/FriendsPage';
import NotificationsPage from './pages/NotificationsPage';
import AdminContentPage from './pages/AdminContentPage';
import AdminChallengeFormPage from './pages/AdminChallengeFormPage';
import AdminUsersPage from './pages/AdminUsersPage';
import { NAV_ITEMS } from './lib/navigation';

// Routes inside the same group don't retrigger the outer page-fade
// when navigating between them — /app/* keeps its shell mounted
// (the shell animates its own inner content instead), and the two
// auth screens share one group so switching tabs doesn't flash the
// whole screen. The challenge player and the Quick Play flow each
// have their own full-screen layout (no sidebar), so they're
// deliberately excluded from the /app group and get a normal
// full-page transition like any other top-level screen.
function transitionGroup(pathname) {
  if (pathname.startsWith('/app/challenge')) return pathname;
  if (pathname === '/app/quick-play') return pathname;
  if (pathname.startsWith('/app')) return '/app';
  if (pathname === '/login' || pathname === '/signup') return '/auth';
  return pathname;
}

export default function App() {
  const location = useLocation();
  const initialize = useAuthStore((s) => s.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={transitionGroup(location.pathname)}>
        <Route
          path="/"
          element={
            <PageTransition>
              <LandingPage />
            </PageTransition>
          }
        />
        <Route
          path="/styleguide"
          element={
            <PageTransition>
              <StyleGuidePage />
            </PageTransition>
          }
        />
        <Route
          path="/login"
          element={
            <PageTransition>
              <AuthPage />
            </PageTransition>
          }
        />
        <Route
          path="/signup"
          element={
            <PageTransition>
              <AuthPage />
            </PageTransition>
          }
        />

        <Route
          path="/app"
          element={
            <PageTransition>
              <RequireAuth>
                <AppShell />
              </RequireAuth>
            </PageTransition>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="admin" element={<Navigate to="/app/admin/content" replace />} />
          <Route
            path="admin/content"
            element={
              <RequireAdmin>
                <AdminContentPage />
              </RequireAdmin>
            }
          />
          <Route
            path="admin/content/new"
            element={
              <RequireAdmin>
                <AdminChallengeFormPage />
              </RequireAdmin>
            }
          />
          <Route
            path="admin/content/:challengeId/edit"
            element={
              <RequireAdmin>
                <AdminChallengeFormPage />
              </RequireAdmin>
            }
          />
          <Route
            path="admin/users"
            element={
              <RequireAdmin>
                <AdminUsersPage />
              </RequireAdmin>
            }
          />
          {NAV_ITEMS.map((item) => {
            if (item.id === 'quick-play') return null;
            if (item.id === 'dashboard') {
              return <Route key={item.id} path={item.path} element={<DashboardPage />} />;
            }
            if (item.id === 'practice') {
              return <Route key={item.id} path={item.path} element={<PracticePage />} />;
            }
            if (item.id === 'rankings') {
              return <Route key={item.id} path={item.path} element={<RankingsPage />} />;
            }
            if (item.id === 'friends') {
              return <Route key={item.id} path={item.path} element={<FriendsPage />} />;
            }
            if (item.id === 'notifications') {
              return <Route key={item.id} path={item.path} element={<NotificationsPage />} />;
            }
            return <Route key={item.id} path={item.path} element={<StubPage {...item} />} />;
          })}
        </Route>

        <Route
          path="/app/challenge/:challengeId"
          element={
            <PageTransition>
              <RequireAuth>
                <ChallengePlayerPage />
              </RequireAuth>
            </PageTransition>
          }
        />

        <Route
          path="/app/quick-play"
          element={
            <PageTransition>
              <RequireAuth>
                <QuickPlayPage />
              </RequireAuth>
            </PageTransition>
          }
        />

        <Route
          path="*"
          element={
            <PageTransition>
              <ComingSoonPage
                title="Page not found"
                description="This route doesn't exist yet. Head back to the homepage."
              />
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}
