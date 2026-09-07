import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Card from '../components/ui/Card';
import Tabs from '../components/ui/Tabs';
import Pagination from '../components/ui/Pagination';
import LeaderboardTable from '../components/rankings/LeaderboardTable';
import RankingsSkeleton from '../components/rankings/RankingsSkeleton';
import { useMockLoading } from '../lib/useMockLoading';
import { GLOBAL_LEADERBOARD, FRIENDS_LEADERBOARD, SEASON_LEADERBOARD } from '../lib/mockLeaderboard';
import { slideUp, staggerContainer } from '../lib/motion';

const TABS = [
  { id: 'global', label: 'Global' },
  { id: 'friends', label: 'Friends' },
  { id: 'season', label: 'This Season' },
];

const DATASETS = {
  global: GLOBAL_LEADERBOARD,
  friends: FRIENDS_LEADERBOARD,
  season: SEASON_LEADERBOARD,
};

const PAGE_SIZE = 10;

export default function RankingsPage() {
  const loading = useMockLoading();
  const [activeTab, setActiveTab] = useState('global');
  const [page, setPage] = useState(1);

  const dataset = DATASETS[activeTab];
  const totalPages = Math.max(1, Math.ceil(dataset.length / PAGE_SIZE));
  const pageItems = dataset.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleTabChange(id) {
    setActiveTab(id);
    setPage(1);
  }

  if (loading) return <RankingsSkeleton />;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer(0.08)}
      className="px-4 py-6 sm:px-6 lg:px-8"
    >
      <motion.div variants={slideUp}>
        <h1 className="text-2xl font-bold text-primary sm:text-3xl">Rankings</h1>
        <p className="mt-1 text-secondary">See how you stack up against other developers.</p>
      </motion.div>

      <motion.div variants={slideUp}>
        <Card className="mt-6 overflow-hidden">
          <div className="px-4 pt-4 sm:px-5">
            <Tabs tabs={TABS} active={activeTab} onChange={handleTabChange} />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <div className="p-4 sm:p-5">
                <LeaderboardTable players={pageItems} />
              </div>
              {totalPages > 1 && (
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  onPrev={() => setPage((p) => Math.max(1, p - 1))}
                  onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </Card>
      </motion.div>
    </motion.div>
  );
}
