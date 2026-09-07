import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import StatTile from '../ui/StatTile';
import PlayerBlock from './PlayerBlock';
import { MOCK_USER } from '../../lib/mockUser';
import { OPPONENT, MATCH_RESULT, VICTORY_QUOTE } from '../../lib/mockQuickPlay';
import { pageTransition, staggerContainer, slideUp } from '../../lib/motion';

export default function VictoryScreen({ onRematch, onDashboard }) {
  return (
    <motion.div
      initial={pageTransition.initial}
      animate={pageTransition.animate}
      exit={pageTransition.exit}
      transition={pageTransition.transition}
      className="w-full max-w-xl text-center"
    >
      <motion.div initial="hidden" animate="visible" variants={staggerContainer(0.1)}>
        <motion.div variants={slideUp} className="flex flex-col items-center">
          <Trophy size={36} className="text-accent" />
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-accent">VICTORY</h1>
          <p className="mt-1 text-secondary">You solved it first!</p>
        </motion.div>

        <motion.div variants={slideUp}>
          <Card className="mt-8 flex items-center justify-between gap-4 p-5">
            <PlayerBlock
              name={MOCK_USER.name}
              initials={MOCK_USER.initials}
              rating={MATCH_RESULT.ratingBefore}
              timeTaken={MATCH_RESULT.timeTaken}
            />
            <span className="shrink-0 text-sm font-bold text-tertiary">VS</span>
            <PlayerBlock
              name={OPPONENT.name}
              initials={OPPONENT.name.charAt(0)}
              rating={OPPONENT.rating}
              timeTaken={OPPONENT.timeTaken}
              align="right"
            />
          </Card>
        </motion.div>

        <motion.div variants={slideUp} className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatTile label="Accuracy" value={MATCH_RESULT.accuracy} />
          <StatTile label="Test Cases" value={MATCH_RESULT.testsPassed} />
          <StatTile label="Time Taken" value={MATCH_RESULT.timeTaken} />
          <StatTile label="Rating" value={`${MATCH_RESULT.ratingBefore} → ${MATCH_RESULT.ratingAfter}`} />
        </motion.div>

        <motion.div variants={slideUp} className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button variant="outline" onClick={onRematch}>
            Rematch
          </Button>
          <Button onClick={onDashboard}>Back to Dashboard</Button>
        </motion.div>

        <motion.p variants={slideUp} className="mt-8 font-mono text-xs italic text-tertiary">
          &ldquo;{VICTORY_QUOTE}&rdquo;
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
