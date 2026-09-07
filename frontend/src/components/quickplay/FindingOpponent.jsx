import { motion } from 'framer-motion';
import Button from '../ui/Button';
import RadarPing from './RadarPing';
import { MATCH_RESULT } from '../../lib/mockQuickPlay';
import { YOUR_RANK } from '../../lib/mockDashboard';
import { pageTransition } from '../../lib/motion';

function Chip({ label, value }) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-glass bg-surface px-5 py-3">
      <span className="text-[11px] font-medium uppercase tracking-wide text-tertiary">{label}</span>
      <span className="mt-0.5 text-sm font-semibold text-primary">{value}</span>
    </div>
  );
}

export default function FindingOpponent({ onCancel }) {
  return (
    <motion.div
      initial={pageTransition.initial}
      animate={pageTransition.animate}
      exit={pageTransition.exit}
      transition={pageTransition.transition}
      className="flex flex-col items-center text-center"
    >
      <RadarPing />
      <h1 className="mt-8 text-2xl font-bold text-primary">Finding Opponent...</h1>
      <p className="mt-1 text-secondary">Matching you with a player around your rating.</p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Chip label="Rating" value={MATCH_RESULT.ratingBefore} />
        <Chip label="League" value={YOUR_RANK.league} />
        <Chip label="Estimated wait" value="< 10s" />
      </div>

      <Button variant="outline" className="mt-10" onClick={onCancel}>
        Cancel
      </Button>
    </motion.div>
  );
}
