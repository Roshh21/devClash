import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import PageTransition from './components/layout/PageTransition';
import LandingPage from './pages/LandingPage';
import StyleGuidePage from './pages/StyleGuidePage';
import ComingSoonPage from './pages/ComingSoonPage';

export default function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
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
          path="/signup"
          element={
            <PageTransition>
              <ComingSoonPage
                title="Sign up"
                description="Account creation is on the way. Real signup will be wired up in an upcoming build."
              />
            </PageTransition>
          }
        />
        <Route
          path="/login"
          element={
            <PageTransition>
              <ComingSoonPage
                title="Log in"
                description="Authentication is on the way. Real login will be wired up in an upcoming build."
              />
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
