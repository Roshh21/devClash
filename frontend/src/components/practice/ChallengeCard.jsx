import { Link } from 'react-router-dom';
import { CheckCircle2, ChevronRight, FileCode2 } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

const DIFFICULTY_VARIANT = {
  Easy: 'success',
  Medium: 'warning',
  Hard: 'danger',
};

export default function ChallengeCard({ challenge }) {
  return (
    <Link to={`/app/challenge/${challenge.id}`} className="block">
      <Card hover className="flex items-center gap-4 p-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--tint-accent)] text-accent">
          {challenge.completed ? <CheckCircle2 size={18} /> : <FileCode2 size={18} />}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-semibold text-primary">{challenge.title}</h3>
            {challenge.completed && <Badge variant="sage">Solved</Badge>}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-secondary">
            <Badge variant={DIFFICULTY_VARIANT[challenge.difficulty]}>{challenge.difficulty}</Badge>
            <span>{challenge.type}</span>
            <span>· {challenge.estimatedTime}</span>
          </div>
        </div>
        <ChevronRight size={16} className="shrink-0 text-tertiary" />
      </Card>
    </Link>
  );
}
