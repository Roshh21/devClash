import { motion } from 'framer-motion';
import { useReducedMotion } from '../../lib/useReducedMotion';
import { cn } from '../../lib/utils';

export default function ProgressBar({ value = 0, delay = 0, className }) {
  const reduced = useReducedMotion();
  const clamped = Math.min(Math.max(value, 0), 100);

  return (
    <div className={cn('h-2 w-full overflow-hidden rounded-full bg-surface-strong', className)}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${clamped}%` }}
        transition={{ duration: reduced ? 0 : 1, delay: reduced ? 0 : delay, ease: [0.4, 0, 0.2, 1] }}
        className="h-full rounded-full bg-accent"
      />
    </div>
  );
}
