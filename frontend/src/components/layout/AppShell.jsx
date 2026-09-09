import { useState } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import PageTransition from './PageTransition';
import { cn } from '../../lib/utils';
import { drawerSlide, modalBackdrop } from '../../lib/motion';

// A mock "logged in as Roshni" state is hardcoded (see lib/mockUser.js)
// so every screen inside this shell can be built without real auth.
// This shell is not yet linked from the auth flow — it's reachable
// directly at /app/* until real sessions exist.
export default function AppShell() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const location = useLocation();
  const outlet = useOutlet();

  return (
    <div className="flex min-h-screen bg-bg text-primary">
      <aside
        className={cn(
          'hidden shrink-0 border-r border-glass transition-[width] duration-300 ease-standard lg:block',
          collapsed ? 'w-20' : 'w-64'
        )}
      >
        <div className="sticky top-0 h-screen">
          <Sidebar collapsed={collapsed} onToggleCollapse={() => setCollapsed((v) => !v)} />
        </div>
      </aside>

      <AnimatePresence>
        {mobileNavOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={modalBackdrop.initial}
              animate={modalBackdrop.animate}
              exit={modalBackdrop.exit}
              transition={modalBackdrop.transition}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={() => setMobileNavOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              key="drawer"
              initial={drawerSlide.initial}
              animate={drawerSlide.animate}
              exit={drawerSlide.exit}
              transition={drawerSlide.transition}
              className="fixed inset-y-0 left-0 z-50 w-72 border-r border-glass bg-bg-elevated lg:hidden"
            >
              <Sidebar onNavigate={() => setMobileNavOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenMobileNav={() => setMobileNavOpen(true)} />
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <PageTransition key={location.pathname}>{outlet}</PageTransition>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
