import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function Select({ options, className, ...rest }) {
  return (
    <div className={cn('relative', className)}>
      <select
        className="w-full appearance-none rounded-xl border border-glass bg-surface px-4 py-2.5 pr-9 text-sm text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
        {...rest}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-tertiary"
      />
    </div>
  );
}
