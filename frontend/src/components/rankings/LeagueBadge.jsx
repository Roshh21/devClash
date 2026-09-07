import { Shield } from 'lucide-react';
import { getLeagueForRating } from '../../lib/mockLeaderboard';

export default function LeagueBadge({ rating }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-secondary">
      <Shield size={12} className="text-accent" />
      {getLeagueForRating(rating)}
    </span>
  );
}
