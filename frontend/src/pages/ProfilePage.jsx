import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Award, BarChart3, Clock, Pencil, Shield } from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Tabs from '../components/ui/Tabs';
import Skeleton from '../components/ui/Skeleton';
import StatTile from '../components/ui/StatTile';
import InlineNotice from '../components/ui/InlineNotice';
import EditProfileModal from '../components/profile/EditProfileModal';
import EmptyTabState from '../components/ui/EmptyTabState';
import { useMockLoading } from '../lib/useMockLoading';
import { useCountUp } from '../lib/useCountUp';
import { MOCK_USER } from '../lib/mockUser';
import { PROFILE_STATS, FAVORITE_CATEGORIES, PROFILE_QUOTE } from '../lib/mockProfile';
import { slideUp, staggerContainer, tabContentTransition } from '../lib/motion';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'statistics', label: 'Statistics' },
  { id: 'history', label: 'Match History' },
  { id: 'achievements', label: 'Achievements' },
];

function ProfileSkeleton() {
  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <Card className="p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-5">
          <Skeleton className="h-20 w-20 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-28" />
          </div>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      </Card>
    </div>
  );
}

export default function ProfilePage() {
  const loading = useMockLoading();
  const [editOpen, setEditOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [savedNotice, setSavedNotice] = useState(false);

  const totalMatches = useCountUp(PROFILE_STATS.totalMatches);
  const winRate = useCountUp(PROFILE_STATS.winRate);

  if (loading) return <ProfileSkeleton />;

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <motion.div initial="hidden" animate="visible" variants={staggerContainer(0.08)}>
        <motion.div variants={slideUp}>
          <Card className="p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center gap-5">
                <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-accent text-2xl font-bold text-accent-contrast">
                  {MOCK_USER.initials}
                </span>
                <div>
                  <h1 className="text-2xl font-bold text-primary">{MOCK_USER.name}</h1>
                  <div className="mt-1 flex items-center gap-2 text-sm text-secondary">
                    <Shield size={14} className="text-accent" />
                    {MOCK_USER.league} · {MOCK_USER.rating}
                  </div>
                  <p className="mt-2 max-w-sm font-mono text-sm italic text-tertiary">
                    &ldquo;{MOCK_USER.tagline}&rdquo;
                  </p>
                </div>
              </div>
              <Button variant="outline" leftIcon={<Pencil size={15} />} onClick={() => setEditOpen(true)}>
                Edit Profile
              </Button>
            </div>

            <InlineNotice
              message={
                savedNotice ? "Profile editing isn't wired up yet — nothing was actually saved." : null
              }
            />

            <div className="mt-8">
              <Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} />

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={tabContentTransition.initial}
                  animate={tabContentTransition.animate}
                  exit={tabContentTransition.exit}
                  transition={tabContentTransition.transition}
                  className="pt-6"
                >
                  {activeTab === 'overview' && (
                    <>
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                        <StatTile label="Total Matches" value={totalMatches} />
                        <StatTile label="Win Rate" value={`${winRate}%`} />
                        <StatTile label="Current Streak" value={PROFILE_STATS.currentStreak} />
                        <StatTile label="Highest Rating" value={PROFILE_STATS.highestRating} />
                      </div>

                      <div className="mt-8">
                        <p className="text-sm font-semibold text-primary">Favorite Categories</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {FAVORITE_CATEGORIES.map((category) => (
                            <Badge key={category} variant="accent">
                              {category}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <p className="mt-8 font-mono text-xs italic text-tertiary">&ldquo;{PROFILE_QUOTE}&rdquo;</p>
                    </>
                  )}

                  {activeTab === 'statistics' && (
                    <EmptyTabState
                      icon={BarChart3}
                      label="Detailed statistics are on the way"
                      description="Category breakdowns and performance trends will show up here once real match data exists."
                    />
                  )}

                  {activeTab === 'history' && (
                    <EmptyTabState
                      icon={Clock}
                      label="Match history is on the way"
                      description="Every match you play will be listed here, most recent first."
                    />
                  )}

                  {activeTab === 'achievements' && (
                    <EmptyTabState
                      icon={Award}
                      label="Achievements are on the way"
                      description="Badges for milestones and streaks will appear here as you earn them."
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </Card>
        </motion.div>
      </motion.div>

      <EditProfileModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSaved={() => {
          setSavedNotice(true);
          window.setTimeout(() => setSavedNotice(false), 4000);
        }}
      />
    </div>
  );
}
