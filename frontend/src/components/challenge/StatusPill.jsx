import { CheckCircle2, Circle, Loader2, XCircle } from 'lucide-react';

const STATUS_MAP = {
  passed: { icon: CheckCircle2, label: 'Passed', className: 'text-success' },
  running: { icon: Loader2, label: 'Running...', className: 'text-accent', spin: true },
  failed: { icon: XCircle, label: 'Failed', className: 'text-danger' },
  idle: { icon: Circle, label: 'Not run', className: 'text-tertiary' },
};

export default function StatusPill({ status = 'idle' }) {
  const { icon: Icon, label, className, spin } = STATUS_MAP[status] ?? STATUS_MAP.idle;

  return (
    <span className={`flex items-center gap-1.5 text-xs font-semibold ${className}`}>
      <Icon size={14} className={spin ? 'animate-spin' : undefined} />
      {label}
    </span>
  );
}
