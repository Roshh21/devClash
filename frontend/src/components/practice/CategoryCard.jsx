import { ChevronRight } from 'lucide-react';
import Card from '../ui/Card';
import { cn } from '../../lib/utils';

export default function CategoryCard({ category, active, onClick }) {
  const Icon = category.icon;

  return (
    <button type="button" onClick={onClick} className="text-left">
      <Card
        hover
        className={cn(
          'flex items-center gap-3 p-4',
          active && 'border-[var(--border-accent)] bg-[var(--tint-accent)]'
        )}
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--tint-accent)] text-accent">
          <Icon size={18} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-primary">{category.label}</p>
          <p className="text-xs text-secondary">{category.count} challenges</p>
        </div>
        <ChevronRight size={16} className="shrink-0 text-tertiary" />
      </Card>
    </button>
  );
}
