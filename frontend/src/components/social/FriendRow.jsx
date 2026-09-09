import { MessageCircle, Swords } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import PresenceDot from './PresenceDot';

export default function FriendRow({ friend, onChallenge, onMessage }) {
  return (
    <Card className="flex items-center gap-3 p-3">
      <div className="relative shrink-0">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-strong text-sm font-bold text-secondary">
          {friend.name.charAt(0)}
        </span>
        <PresenceDot status={friend.presence} className="absolute -bottom-0.5 -right-0.5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-primary">{friend.name}</p>
        <p className="text-xs text-secondary">{friend.rating.toLocaleString()} rating</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={() => onMessage?.(friend)}
          aria-label={`Message ${friend.name}`}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-glass text-secondary transition-colors hover:bg-surface hover:text-primary"
        >
          <MessageCircle size={15} />
        </button>
        <Button size="sm" leftIcon={<Swords size={14} />} onClick={() => onChallenge?.(friend)}>
          Challenge
        </Button>
      </div>
    </Card>
  );
}
