import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Code2 } from 'lucide-react';
import Button from '../ui/Button';
import ThemeToggle from '../ui/ThemeToggle';

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Challenges' },
  { label: 'Leaderboards' },
  { label: 'Pricing' },
];

function NavLink({ label, href, onClick }) {
  const classes = 'text-sm font-medium text-secondary transition-colors hover:text-primary';
  if (href) {
    return (
      <a href={href} onClick={onClick} className={classes}>
        {label}
      </a>
    );
  }
  return (
    <span className={`${classes} cursor-default opacity-70 hover:text-secondary`} title="Coming soon">
      {label}
    </span>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-glass bg-[var(--color-nav-bg)] backdrop-blur-glass">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold text-primary">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-contrast">
            <Code2 size={18} />
          </span>
          DevClash
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.label} {...link} />
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <Button to="/login" variant="outline" size="sm">
            Log in
          </Button>
          <Button to="/signup" variant="primary" size="sm">
            Get Started
          </Button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-primary"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden border-t border-glass md:hidden"
          >
            <div className="flex flex-col gap-4 px-4 py-5">
              {NAV_LINKS.map((link) => (
                <NavLink key={link.label} {...link} onClick={() => setOpen(false)} />
              ))}
              <div className="flex items-center gap-3 pt-2">
                <Button to="/login" variant="outline" size="sm" className="flex-1">
                  Log in
                </Button>
                <Button to="/signup" variant="primary" size="sm" className="flex-1">
                  Get Started
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
