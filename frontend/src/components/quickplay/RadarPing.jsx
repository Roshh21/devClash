import { motion } from 'framer-motion';
import { Code2 } from 'lucide-react';
import { useReducedMotion } from '../../lib/useReducedMotion';

export default function RadarPing() {
  const reduced = useReducedMotion();

  return (
    <div className="relative flex h-40 w-40 items-center justify-center">
      {!reduced &&
        [0, 0.6, 1.2].map((delay) => (
          <motion.span
            key={delay}
            className="absolute inset-0 rounded-full border-2 border-accent"
            initial={{ scale: 0.55, opacity: 0.55 }}
            animate={{ scale: 1.8, opacity: 0 }}
            transition={{ duration: 2, repeat: Infinity, delay, ease: 'easeOut' }}
          />
        ))}
      {reduced && <span className="absolute inset-4 rounded-full border-2 border-[var(--border-accent)]" />}
      <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-accent text-accent-contrast shadow-glass">
        <Code2 size={30} />
      </span>
    </div>
  );
}
