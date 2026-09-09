import { AnimatePresence, motion } from 'framer-motion';
import { Info } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useReducedMotion } from '../../lib/useReducedMotion';

export default function InlineNotice({ message, className }) {
  const reduced = useReducedMotion();

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
          <div className="flex items-start gap-2 rounded-xl border border-[var(--border-accent)] bg-[var(--tint-accent)] px-4 py-3 text-sm text-accent">
            <Info size={16} className="mt-0.5 shrink-0" />
            <span>{message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
