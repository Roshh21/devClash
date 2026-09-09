import { forwardRef, useId } from 'react';
import { cn } from '../../lib/utils';

const Textarea = forwardRef(function Textarea(
  { label, error, className, id, rows = 4, mono = false, ...rest },
  ref
) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={textareaId} className="text-sm font-medium text-secondary">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        className={cn(
          'w-full resize-y rounded-xl border bg-surface px-4 py-2.5 text-sm text-primary placeholder:text-tertiary transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent',
          mono && 'font-mono text-[13px]',
          error ? 'border-danger' : 'border-glass',
          className
        )}
        aria-invalid={Boolean(error)}
        {...rest}
      />
      {error && <span className="text-xs text-danger">{error}</span>}
    </div>
  );
});

export default Textarea;
