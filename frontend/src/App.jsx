import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import PageTransition from './components/layout/PageTransition';
import AppShell from './components/layout/AppShell';
import LandingPage from './pages/LandingPage';
import StyleGuidePage from './pages/StyleGuidePage';
import AuthPage from './pages/AuthPage';
import ComingSoonPage from './pages/ComingSoonPage';
import StubPage from './pages/StubPage';
import { NAV_ITEMS } from './lib/navigation';

// Routes inside the same group don't retrigger the outer page-fade
// when navigating between them — /app/* keeps its shell mounted
// (the shell animates its own inner content instead), and the two
// auth screens share one group so switching tabs doesn't flash the
// whole screen.
function transitionGroup(pathname) {
  if (pathname.startsWith('/app')) return '/app';
  if (pathname === '/login' || pathname === '/signup') return '/auth';
  return pathname;
}

export default function App() {
  const location = useLocation();

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
              <AppShell />
            </PageTransition>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          {NAV_ITEMS.map((item) => (
            <Route key={item.id} path={item.path} element={<StubPage {...item} />} />
          ))}
        </Route>

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
