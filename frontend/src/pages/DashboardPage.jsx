import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ArrowUp, ArrowDown, Flame, Shield } from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import ProgressRing from '../components/ui/ProgressRing';
import ProgressBar from '../components/ui/ProgressBar';
import Sparkline from '../components/ui/Sparkline';
import ActionCard from '../components/dashboard/ActionCard';
import StatCard from '../components/dashboard/StatCard';
import DashboardSkeleton from '../components/dashboard/DashboardSkeleton';
import { useMockLoading } from '../lib/useMockLoading';
import { useCountUp } from '../lib/useCountUp';
import { MOCK_USER } from '../lib/mockUser';
import { NAV_ITEMS } from '../lib/navigation';
import {
  DASHBOARD_STATS,
  YOUR_RANK,
  RECENT_MATCHES,
  CHALLENGE_OF_DAY,
  DASHBOARD_QUOTE,
} from '../lib/mockDashboard';
import { slideUp, staggerContainer } from '../lib/motion';

const navIcon = (id) => NAV_ITEMS.find((item) => item.id === id)?.icon;

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function DashboardPage() {
  const loading = useMockLoading();
  const rating = useCountUp(DASHBOARD_STATS.rating.value);
  const winRate = useCountUp(DASHBOARD_STATS.winRate.value);
  const totalMatches = useCountUp(DASHBOARD_STATS.totalMatches.value);
  const rankProgress = Math.round((YOUR_RANK.points / YOUR_RANK.nextThreshold) * 100);

  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <motion.div key="skeleton" exit={{ opacity: 0 }}>
          <DashboardSkeleton />
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial="hidden"
          animate="visible"
          variants={staggerContainer(0.08)}
          className="flex flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8"
        >
          <motion.div variants={slideUp} className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-primary sm:text-3xl">
                {greeting()}, {MOCK_USER.name}.
              </h1>
              <p className="mt-1 text-secondary">Ready for another clash?</p>
            </div>
            <p className="mt-1 font-mono text-sm italic text-tertiary">&ldquo;{DASHBOARD_QUOTE}&rdquo;</p>
          </motion.div>

          <motion.div variants={slideUp} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <ActionCard
              to="/app/quick-play"
              icon={navIcon('quick-play')}
              title="Quick Play"
              description="Find an opponent around your rating"
              featured
            />
            <ActionCard
              to="/app/practice"
              icon={navIcon('practice')}
              title="Practice"
              description="Sharpen your skills"
            />
            <ActionCard
              to="/app/team-mode"
              icon={navIcon('team-mode')}
              title="Team Mode"
              description="Solve real engineering scenarios together"
            />
          </motion.div>

          <motion.div variants={slideUp} className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard
              label="Rating"
              value={rating.toLocaleString()}
              footer={`↑ +${DASHBOARD_STATS.rating.deltaWeek} this week`}
            />
            <StatCard label="Win Rate" value={`${winRate}%`}>
              <ProgressRing value={DASHBOARD_STATS.winRate.value} size={48} strokeWidth={5} />
            </StatCard>
            <StatCard
              icon={Flame}
              label="Streak"
              value={DASHBOARD_STATS.streak.value}
              footer={`Best: ${DASHBOARD_STATS.streak.best}`}
            />
            <StatCard label="Total Matches" value={totalMatches}>
              <Sparkline values={DASHBOARD_STATS.totalMatches.trend} height={28} />
            </StatCard>
          </motion.div>

          <motion.div variants={slideUp} className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Card className="flex flex-col items-center p-5 text-center">
              <span className="text-sm font-medium text-secondary">Your Rank</span>
              <span className="mt-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--tint-accent)] text-accent">
                <Shield size={30} />
              </span>
              <p className="mt-3 font-semibold text-primary">{YOUR_RANK.league}</p>
              <ProgressBar value={rankProgress} className="mt-3" />
              <p className="mt-2 text-xs text-secondary">
                {YOUR_RANK.points} / {YOUR_RANK.nextThreshold}
              </p>
            </Card>

            <Card className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-secondary">Recent Matches</span>
                <Link to="/app/statistics" className="text-xs font-medium text-accent hover:underline">
                  View all
                </Link>
              </div>
              <ul className="mt-3 space-y-1">
                {RECENT_MATCHES.map((match) => (
                  <li key={match.id} className="flex items-center gap-3 rounded-xl px-1 py-2">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-strong text-xs font-bold text-secondary">
                      {match.opponent.charAt(0)}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm text-primary">
                      vs {match.opponent}
                    </span>
                    <span
                      className={`flex items-center gap-0.5 text-sm font-semibold ${
                        match.result === 'win' ? 'text-success' : 'text-danger'
                      }`}
                    >
                      {match.result === 'win' ? <ArrowUp size={13} /> : <ArrowDown size={13} />}
                      {Math.abs(match.delta)}
                    </span>
                    <span className="w-14 shrink-0 text-right text-xs text-tertiary">{match.timeAgo}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-5">
              <span className="text-sm font-medium text-secondary">Challenge of the Day</span>
              <h3 className="mt-3 font-semibold text-primary">{CHALLENGE_OF_DAY.title}</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {CHALLENGE_OF_DAY.tags.map((tag) => (
                  <Badge key={tag} variant="sage">
                    {tag}
                  </Badge>
                ))}
              </div>
              <p className="mt-3 text-sm text-secondary">{CHALLENGE_OF_DAY.description}</p>
              <Button to="/app/practice" className="mt-5 w-full" rightIcon={<ArrowRight size={16} />}>
                Start Challenge
              </Button>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
