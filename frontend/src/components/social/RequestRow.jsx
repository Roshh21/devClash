import { Check, X } from 'lucide-react';
import Card from '../ui/Card';

export default function RequestRow({ request, onAccept, onDecline }) {
  return (
    <Card className="flex items-center gap-3 p-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-strong text-sm font-bold text-secondary">
        {request.name.charAt(0)}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-primary">{request.name}</p>
        <p className="text-xs text-secondary">{request.rating.toLocaleString()} rating</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={() => onDecline?.(request)}
          aria-label={`Decline ${request.name}`}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-glass text-secondary transition-colors hover:border-[var(--border-danger)] hover:text-danger"
        >
          <X size={15} />
        </button>
        <button
          type="button"
          onClick={() => onAccept?.(request)}
          aria-label={`Accept ${request.name}`}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-contrast transition-colors hover:bg-accent-strong"
        >
          <Check size={15} />
        </button>
      </div>
    </Card>
  );
}
