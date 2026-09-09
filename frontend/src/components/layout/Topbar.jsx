import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, LogOut, Menu, Search, Settings, UserRound } from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';
import NotificationBell from './NotificationBell';
import { useCurrentUser } from '../../lib/useCurrentUser';
import { useAuthStore } from '../../store/authStore';
import { cn } from '../../lib/utils';
import { dropdownMenu } from '../../lib/motion';

export default function Topbar({ onOpenMobileNav }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const currentUser = useCurrentUser();
  const logout = useAuthStore((s) => s.logout);

  function handleLogout() {
    setMenuOpen(false);
    logout();
    navigate('/');
  }

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-glass bg-[var(--color-nav-bg)] px-4 py-3 backdrop-blur-glass sm:px-6">
      <button
        type="button"
        onClick={onOpenMobileNav}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-primary lg:hidden"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      <div className="relative hidden max-w-md flex-1 sm:block">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-tertiary"
        />
        <input
          type="search"
          placeholder="Search challenges, players, or topics..."
          className="w-full rounded-xl border border-glass bg-surface py-2 pl-10 pr-4 text-sm text-primary placeholder:text-tertiary transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />

        <NotificationBell />

        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-lg border border-glass bg-surface py-1.5 pl-1.5 pr-2.5 text-sm font-medium text-primary transition-colors hover:bg-surface-strong"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-contrast">
              {currentUser.initials}
            </span>
            <span className="hidden sm:inline">{currentUser.name}</span>
            <ChevronDown size={14} className={cn('transition-transform', menuOpen && 'rotate-180')} />
          </button>

          <AnimatePresence>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <motion.div
                  initial={dropdownMenu.initial}
                  animate={dropdownMenu.animate}
                  exit={dropdownMenu.exit}
                  transition={dropdownMenu.transition}
                  className="absolute right-0 z-20 mt-2 w-48 rounded-xl border border-glass bg-bg-elevated p-1.5 shadow-glass backdrop-blur-glass"
                >
                  <NavLink
                    to="profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-secondary transition-colors hover:bg-surface hover:text-primary"
                  >
                    <UserRound size={15} /> View Profile
                  </NavLink>
                  <NavLink
                    to="settings"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-secondary transition-colors hover:bg-surface hover:text-primary"
                  >
                    <Settings size={15} /> Settings
                  </NavLink>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-secondary transition-colors hover:bg-surface hover:text-primary"
                  >
                    <LogOut size={15} /> Log out
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
