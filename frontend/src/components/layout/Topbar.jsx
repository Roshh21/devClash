import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, ChevronDown, LogOut, Menu, Search, Settings } from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';
import { MOCK_USER } from '../../lib/mockUser';
import { cn } from '../../lib/utils';

export default function Topbar({ onOpenMobileNav }) {
  const [menuOpen, setMenuOpen] = useState(false);

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

        <NavLink
          to="notifications"
          aria-label="Notifications"
          className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-glass bg-surface text-primary transition-colors hover:bg-surface-strong"
        >
          <Bell size={16} />
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-contrast">
            3
          </span>
        </NavLink>

        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-lg border border-glass bg-surface py-1.5 pl-1.5 pr-2.5 text-sm font-medium text-primary transition-colors hover:bg-surface-strong"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-contrast">
              {MOCK_USER.initials}
            </span>
            <span className="hidden sm:inline">{MOCK_USER.name}</span>
            <ChevronDown size={14} className={cn('transition-transform', menuOpen && 'rotate-180')} />
          </button>

          <AnimatePresence>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 z-20 mt-2 w-48 rounded-xl border border-glass bg-bg-elevated p-1.5 shadow-glass backdrop-blur-glass"
                >
                  <NavLink
                    to="settings"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-secondary transition-colors hover:bg-surface hover:text-primary"
                  >
                    <Settings size={15} /> Settings
                  </NavLink>
                  <Link
                    to="/"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-secondary transition-colors hover:bg-surface hover:text-primary"
                  >
                    <LogOut size={15} /> Log out
                  </Link>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
