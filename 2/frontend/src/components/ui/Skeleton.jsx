import { cn } from '../../lib/utils';

export default function Skeleton({ className }) {
  return <div className={cn('skeleton-shimmer rounded-lg', className)} aria-hidden="true" />;
}
