import { cn } from '../../lib/utils';
import { PRESENCE } from '../../lib/mockSocial';

const PRESENCE_STYLES = {
  [PRESENCE.ONLINE]: 'bg-success',
  [PRESENCE.IN_MATCH]: 'bg-accent',
  [PRESENCE.OFFLINE]: 'bg-tertiary',
};

const PRESENCE_LABELS = {
  [PRESENCE.ONLINE]: 'Online',
  [PRESENCE.IN_MATCH]: 'In match',
  [PRESENCE.OFFLINE]: 'Offline',
};

export default function PresenceDot({ status, className }) {
  return (
    <span
      className={cn(
        'block h-2.5 w-2.5 rounded-full ring-2 ring-bg-elevated',
        PRESENCE_STYLES[status],
        className
      )}
      role="img"
      aria-label={PRESENCE_LABELS[status]}
      title={PRESENCE_LABELS[status]}
    />
  );
}
