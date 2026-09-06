import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Card from '../ui/Card';
import { cn } from '../../lib/utils';

export default function ActionCard({ to, icon: Icon, title, description, featured = false }) {
  return (
    <Link to={to} className="block">
      <Card
        hover
        className={cn(
          'flex h-full items-start gap-4 p-5',
          featured && 'border-[var(--border-accent)] bg-[var(--tint-accent)]'
        )}
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--tint-accent)] text-accent">
          <Icon size={20} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-semibold text-primary">{title}</h3>
            <ArrowRight size={16} className="shrink-0 text-tertiary" />
          </div>
          <p className="mt-1 text-sm text-secondary">{description}</p>
        </div>
      </Card>
    </Link>
  );
}
