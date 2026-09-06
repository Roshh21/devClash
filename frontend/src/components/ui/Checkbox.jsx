import { useId } from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function Checkbox({ label, checked, onChange, id, className, ...rest }) {
  const generatedId = useId();
  const checkboxId = id ?? generatedId;

  return (
    <label
      htmlFor={checkboxId}
      className={cn('flex cursor-pointer items-start gap-2 text-sm text-secondary', className)}
    >
      <span className="relative mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center">
        <input
          id={checkboxId}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="peer absolute inset-0 h-4 w-4 cursor-pointer appearance-none rounded-[5px] border border-glass-strong bg-surface transition-colors checked:border-accent checked:bg-accent"
          {...rest}
        />
        <Check
          size={12}
          strokeWidth={3}
          className="pointer-events-none absolute text-accent-contrast opacity-0 transition-opacity peer-checked:opacity-100"
        />
      </span>
      <span>{label}</span>
    </label>
  );
}
