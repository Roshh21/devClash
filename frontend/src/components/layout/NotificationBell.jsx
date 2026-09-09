import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell } from 'lucide-react';
import NotificationRow from '../notifications/NotificationRow';
import { NOTIFICATIONS } from '../../lib/mockNotifications';
import { dropdownMenu } from '../../lib/motion';

const PREVIEW_COUNT = 4;

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const unreadCount = NOTIFICATIONS.filter((n) => !n.read).length;
  const preview = NOTIFICATIONS.slice(0, PREVIEW_COUNT);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifications"
        className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-glass bg-surface text-primary transition-colors hover:bg-surface-strong"
      >
        <Bell size={16} />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-contrast">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <motion.div
              initial={dropdownMenu.initial}
              animate={dropdownMenu.animate}
              exit={dropdownMenu.exit}
              transition={dropdownMenu.transition}
              className="absolute right-0 z-20 mt-2 w-80 overflow-hidden rounded-xl border border-glass bg-bg-elevated shadow-glass backdrop-blur-glass"
            >
              <div className="flex items-center justify-between border-b border-glass px-4 py-3">
                <p className="font-semibold text-primary">Notifications</p>
                {unreadCount > 0 && (
                  <span className="text-xs font-medium text-accent">{unreadCount} new</span>
                )}
              </div>
              <div className="max-h-80 divide-y divide-glass overflow-y-auto">
                {preview.map((notification) => (
                  <NotificationRow key={notification.id} notification={notification} compact />
                ))}
              </div>
              <Link
                to="notifications"
                onClick={() => setOpen(false)}
                className="block border-t border-glass px-4 py-3 text-center text-sm font-medium text-accent transition-colors hover:bg-surface"
              >
                View all
              </Link>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
