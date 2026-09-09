import { Bell, Swords, Trophy, UserPlus } from 'lucide-react';
import { NOTIFICATION_TYPES } from '../../lib/mockNotifications';
import { cn } from '../../lib/utils';

const TYPE_ICON = {
  [NOTIFICATION_TYPES.FRIEND_REQUEST]: UserPlus,
  [NOTIFICATION_TYPES.INVITE]: Swords,
  [NOTIFICATION_TYPES.RESULT]: Trophy,
  [NOTIFICATION_TYPES.SYSTEM]: Bell,
};

export default function NotificationRow({ notification, compact = false }) {
  const Icon = TYPE_ICON[notification.type] ?? Bell;

  return (
    <div
      className={cn(
        'flex items-start gap-3 px-4 py-3 transition-colors hover:bg-surface',
        compact && 'px-3 py-2.5'
      )}
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--tint-accent)] text-accent">
        <Icon size={15} />
      </span>
      <div className="min-w-0 flex-1">
        <p className={cn('text-sm text-primary', !notification.read && 'font-semibold')}>
          {notification.title}
        </p>
        <p className="mt-0.5 text-xs text-tertiary">{notification.time}</p>
      </div>
      {!notification.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent" />}
    </div>
  );
}
