import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, SearchX } from 'lucide-react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import CategoryCard from '../components/practice/CategoryCard';
import ChallengeCard from '../components/practice/ChallengeCard';
import PracticeSkeleton from '../components/practice/PracticeSkeleton';
import { useMockLoading } from '../lib/useMockLoading';
import { CATEGORIES, CHALLENGES, DIFFICULTIES } from '../lib/mockChallenges';
import { slideUp, staggerContainer } from '../lib/motion';

const CATEGORY_OPTIONS = [
  { value: 'all', label: 'All Categories' },
  ...CATEGORIES.map((c) => ({ value: c.id, label: c.label })),
];

const DIFFICULTY_OPTIONS = [
  { value: 'all', label: 'All Difficulties' },
  ...DIFFICULTIES.map((d) => ({ value: d, label: d })),
];

export default function PracticePage() {
  const loading = useMockLoading();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [difficulty, setDifficulty] = useState('all');

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return CHALLENGES.filter((c) => {
      if (category !== 'all' && c.category !== category) return false;
      if (difficulty !== 'all' && c.difficulty !== difficulty) return false;
      if (query && !c.title.toLowerCase().includes(query)) return false;
      return true;
    });
  }, [search, category, difficulty]);

  function toggleCategory(id) {
    setCategory((current) => (current === id ? 'all' : id));
  }

  function clearFilters() {
    setSearch('');
    setCategory('all');
    setDifficulty('all');
  }

  const hasActiveFilters = search !== '' || category !== 'all' || difficulty !== 'all';

  if (loading) return <PracticeSkeleton />;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer(0.08)}
      className="flex flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8"
    >
      <motion.div variants={slideUp}>
        <h1 className="text-2xl font-bold text-primary sm:text-3xl">Practice</h1>
        <p className="mt-1 text-secondary">Sharpen your skills with curated challenges.</p>
      </motion.div>

      <motion.div variants={slideUp} className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {CATEGORIES.map((cat) => (
          <CategoryCard
            key={cat.id}
            category={cat}
            active={category === cat.id}
            onClick={() => toggleCategory(cat.id)}
          />
        ))}
      </motion.div>

      <motion.div variants={slideUp} className="flex flex-col gap-3 sm:flex-row">
        <Input
          icon={<Search size={16} />}
          placeholder="Search challenges..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
        />
        <Select
          options={CATEGORY_OPTIONS}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="sm:w-52"
        />
        <Select
          options={DIFFICULTY_OPTIONS}
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="sm:w-48"
        />
      </motion.div>

      <motion.div variants={slideUp} className="flex flex-col gap-3">
        {filtered.length === 0 ? (
          <Card className="flex flex-col items-center gap-2 p-10 text-center">
            <span className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--tint-accent)] text-accent">
              <SearchX size={22} />
            </span>
            <p className="font-semibold text-primary">No challenges match your filters</p>
            <p className="max-w-xs text-sm text-secondary">
              Try a different search term, or reset your filters to see the full catalogue.
            </p>
            {hasActiveFilters && (
              <Button variant="outline" size="sm" className="mt-3" onClick={clearFilters}>
                Clear filters
              </Button>
            )}
          </Card>
        ) : (
          filtered.map((challenge) => <ChallengeCard key={challenge.id} challenge={challenge} />)
        )}
      </motion.div>
    </motion.div>
  );
}
