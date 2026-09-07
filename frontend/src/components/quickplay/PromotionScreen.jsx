import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import Button from '../ui/Button';
import { PROMOTION, PROMOTION_QUOTE } from '../../lib/mockQuickPlay';
import { pageTransition, staggerContainer, slideUp } from '../../lib/motion';
import { useReducedMotion } from '../../lib/useReducedMotion';

export default function PromotionScreen({ onViewProfile, onContinue }) {
  const reduced = useReducedMotion();
  const delta = PROMOTION.ratingAfter - PROMOTION.ratingBefore;

  return (
    <motion.div
      initial={pageTransition.initial}
      animate={pageTransition.animate}
      exit={pageTransition.exit}
      transition={pageTransition.transition}
      className="flex w-full max-w-sm flex-col items-center text-center"
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer(0.1)}
        className="flex w-full flex-col items-center"
      >
        <motion.div variants={slideUp}>
          <h1 className="text-2xl font-extrabold tracking-tight text-primary sm:text-3xl">
            LEAGUE PROMOTION
          </h1>
          <p className="mt-1 text-secondary">You&rsquo;ve climbed higher!</p>
        </motion.div>

        <motion.span
          variants={slideUp}
          initial={reduced ? undefined : { scale: 0.5, opacity: 0 }}
          animate={reduced ? undefined : { scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.15 }}
          className="mt-8 flex h-28 w-28 items-center justify-center rounded-3xl bg-[var(--tint-accent)] text-accent"
        >
          <Shield size={54} />
        </motion.span>

        <motion.p variants={slideUp} className="mt-6 text-lg font-semibold text-primary">
          {PROMOTION.fromLeague} <span className="text-accent">→</span> {PROMOTION.toLeague}
        </motion.p>

        <motion.div variants={slideUp} className="mt-5 w-full">
          <div className="h-2 w-full overflow-hidden rounded-full bg-surface-strong">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${PROMOTION.progressPercent}%` }}
              transition={{ duration: reduced ? 0 : 1, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="h-full rounded-full bg-accent"
            />
          </div>
          <p className="mt-2 text-sm text-secondary">
            {PROMOTION.ratingBefore} → {PROMOTION.ratingAfter}{' '}
            <span className="font-semibold text-success">(+{delta})</span>
          </p>
        </motion.div>

        <motion.div variants={slideUp} className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button variant="outline" onClick={onViewProfile}>
            View Profile
          </Button>
          <Button onClick={onContinue}>Continue</Button>
        </motion.div>

        <motion.p variants={slideUp} className="mt-8 font-mono text-xs italic text-tertiary">
          &ldquo;{PROMOTION_QUOTE}&rdquo;
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
