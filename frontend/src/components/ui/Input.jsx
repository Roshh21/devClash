import { forwardRef, useId } from 'react';
import { cn } from '../../lib/utils';

const Input = forwardRef(function Input(
  { label, error, icon, rightElement, className, id, ...rest },
  ref
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-secondary">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-tertiary">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full rounded-xl border bg-surface px-4 py-2.5 text-sm text-primary placeholder:text-tertiary transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent',
            icon && 'pl-10',
            rightElement && 'pr-10',
            error ? 'border-danger' : 'border-glass',
            className
          )}
          aria-invalid={Boolean(error)}
          {...rest}
        />
        {rightElement && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2">{rightElement}</span>
        )}
      </div>
      {error && <span className="text-xs text-danger">{error}</span>}
    </div>
  );
});

export default Input;
