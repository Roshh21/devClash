import { cn } from '../../lib/utils';

const VARIANTS = {
  default: 'bg-surface-strong text-secondary border border-glass',
  accent: 'bg-[var(--tint-accent)] text-accent border border-[var(--border-accent)]',
  success: 'bg-[var(--tint-success)] text-success border border-[var(--border-success)]',
  warning: 'bg-[var(--tint-warning)] text-warning border border-[var(--border-warning)]',
  danger: 'bg-[var(--tint-danger)] text-danger border border-[var(--border-danger)]',
  sage: 'bg-[var(--tint-sage)] text-sage border border-[var(--border-sage)]',
};

export default function Badge({ variant = 'default', className, children, ...rest }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium',
        VARIANTS[variant],
        className
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
