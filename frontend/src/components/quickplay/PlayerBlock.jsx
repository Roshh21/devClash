import { cn } from '../../lib/utils';

export default function PlayerBlock({ name, initials, rating, timeTaken, align = 'left' }) {
  return (
    <div className={cn('flex flex-1 items-center gap-3', align === 'right' && 'flex-row-reverse text-right')}>
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-contrast">
        {initials}
      </span>
      <div className="min-w-0">
        <p className="truncate font-semibold text-primary">{name}</p>
        <p className="text-xs text-secondary">
          {rating} · {timeTaken}
        </p>
      </div>
    </div>
  );
}
