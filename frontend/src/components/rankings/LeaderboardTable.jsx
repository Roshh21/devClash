import Card from '../ui/Card';
import LeagueBadge from './LeagueBadge';
import { cn } from '../../lib/utils';

export default function LeaderboardTable({ players }) {
  return (
    <>
      <div className="hidden overflow-hidden rounded-2xl border border-glass md:block">
        <table className="w-full text-sm">
          <thead className="bg-surface-strong text-left text-xs font-medium uppercase tracking-wide text-secondary">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Player</th>
              <th className="px-4 py-3">League</th>
              <th className="px-4 py-3 text-right">Rating</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-glass">
            {players.map((player) => (
              <tr
                key={player.position}
                className={cn(
                  'transition-colors',
                  player.isCurrentUser ? 'bg-[var(--tint-accent)]' : 'hover:bg-surface'
                )}
              >
                <td className="px-4 py-3 font-semibold text-secondary">{player.position}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-strong text-xs font-bold text-secondary">
                      {player.name.charAt(0)}
                    </span>
                    <span className={cn('font-medium', player.isCurrentUser ? 'text-accent' : 'text-primary')}>
                      {player.name}
                      {player.isCurrentUser && ' (You)'}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <LeagueBadge rating={player.rating} />
                </td>
                <td className="px-4 py-3 text-right font-semibold text-primary">
                  {player.rating.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 md:hidden">
        {players.map((player) => (
          <Card
            key={player.position}
            className={cn(
              'flex items-center gap-3 p-3',
              player.isCurrentUser && 'border-[var(--border-accent)] bg-[var(--tint-accent)]'
            )}
          >
            <span className="w-5 shrink-0 text-center text-sm font-semibold text-secondary">
              {player.position}
            </span>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-strong text-xs font-bold text-secondary">
              {player.name.charAt(0)}
            </span>
            <div className="min-w-0 flex-1">
              <p className={cn('truncate font-medium', player.isCurrentUser ? 'text-accent' : 'text-primary')}>
                {player.name}
                {player.isCurrentUser && ' (You)'}
              </p>
              <LeagueBadge rating={player.rating} />
            </div>
            <span className="shrink-0 font-semibold text-primary">{player.rating.toLocaleString()}</span>
          </Card>
        ))}
      </div>
    </>
  );
}
