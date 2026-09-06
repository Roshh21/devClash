import { Clock } from 'lucide-react';
import { useCountdown } from '../../lib/useCountdown';

export default function TimerChip({ initialSeconds = 872 }) {
  const { formatted } = useCountdown(initialSeconds);

  return (
    <span className="flex items-center gap-1.5 rounded-lg border border-glass bg-surface px-3 py-1.5 text-sm font-medium text-primary">
      <Clock size={14} className="text-tertiary" />
      {formatted}
    </span>
  );
}
