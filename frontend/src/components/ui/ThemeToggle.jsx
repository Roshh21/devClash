import { Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '../../store/themeStore';
import { useReducedMotion } from '../../lib/useReducedMotion';

export default function ThemeToggle({ className = '' }) {
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const reduced = useReducedMotion();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-glass bg-surface text-primary transition-colors hover:bg-surface-strong ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ opacity: 0, rotate: reduced ? 0 : -90, scale: reduced ? 1 : 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: reduced ? 0 : 90, scale: reduced ? 1 : 0.6 }}
          transition={{ duration: reduced ? 0 : 0.2 }}
          className="flex"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
