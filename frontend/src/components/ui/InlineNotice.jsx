import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, Info } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useReducedMotion } from '../../lib/useReducedMotion';

// tone='info' (default) keeps every existing call site's exact prior
// appearance. tone='danger' is additive, for genuine error states
// (added in Stage B6) — e.g. "can't remove the only remaining admin",
// login/signup failures.
export default function InlineNotice({ message, tone = 'info', className }) {
  const reduced = useReducedMotion();
  const isDanger = tone === 'danger';

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, height: 0, marginTop: 0 }}
          animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
          exit={{ opacity: 0, height: 0, marginTop: 0 }}
          transition={{ duration: reduced ? 0 : 0.2 }}
          className={cn('overflow-hidden', className)}
        >
          <div
            className={cn(
              'flex items-start gap-2 rounded-xl border px-4 py-3 text-sm',
              isDanger
                ? 'border-[var(--border-danger)] bg-[var(--tint-danger)] text-danger'
                : 'border-[var(--border-accent)] bg-[var(--tint-accent)] text-accent'
            )}
          >
            {isDanger ? (
              <AlertTriangle size={16} className="mt-0.5 shrink-0" />
            ) : (
              <Info size={16} className="mt-0.5 shrink-0" />
            )}
            <span>{message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
