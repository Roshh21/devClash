import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Archive, Pencil, Plus, Search } from 'lucide-react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import StatTile from '../components/ui/StatTile';
import InlineNotice from '../components/ui/InlineNotice';
import ConfirmActionModal from '../components/admin/ConfirmActionModal';
import AdminTableSkeleton from '../components/admin/AdminTableSkeleton';
import { useMockLoading } from '../lib/useMockLoading';
import { ADMIN_CHALLENGES, CONTENT_STATUS_COUNTS, STATUS_VARIANT } from '../lib/mockAdminContent';
import { slideUp, staggerContainer } from '../lib/motion';

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'draft', label: 'Draft' },
  { value: 'review', label: 'In Review' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
];

export default function AdminContentPage() {
  const loading = useMockLoading();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [archiveTarget, setArchiveTarget] = useState(null);
  const [notice, setNotice] = useState(null);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return ADMIN_CHALLENGES.filter((c) => {
      if (status !== 'all' && c.status !== status) return false;
      if (query && !c.title.toLowerCase().includes(query)) return false;
      return true;
    });
  }, [search, status]);

  function showNotice(message) {
    setNotice(message);
    window.setTimeout(() => setNotice(null), 3500);
  }

  if (loading) {
    return <AdminTableSkeleton />;
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer(0.08)}
      className="px-4 py-6 sm:px-6 lg:px-8"
    >
      <motion.div variants={slideUp} className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary sm:text-3xl">Content</h1>
          <p className="mt-1 text-secondary">Manage the challenge library.</p>
        </div>
        <Button leftIcon={<Plus size={16} />} onClick={() => navigate('new')}>
          New Challenge
        </Button>
      </motion.div>

      <motion.div variants={slideUp} className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatTile label="Draft" value={CONTENT_STATUS_COUNTS.draft} />
        <StatTile label="In Review" value={CONTENT_STATUS_COUNTS.review} />
        <StatTile label="Published" value={CONTENT_STATUS_COUNTS.published} />
        <StatTile label="Archived" value={CONTENT_STATUS_COUNTS.archived} />
      </motion.div>

      <motion.div variants={slideUp} className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Input
          icon={<Search size={16} />}
          placeholder="Search challenges..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
        />
        <Select options={STATUS_OPTIONS} value={status} onChange={(e) => setStatus(e.target.value)} className="sm:w-52" />
      </motion.div>

      <InlineNotice message={notice} />

      <motion.div variants={slideUp}>
        <Card className="mt-6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface-strong text-left text-xs font-medium uppercase tracking-wide text-secondary">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Updated</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-glass">
                {filtered.map((challenge) => (
                  <tr key={challenge.id} className="transition-colors hover:bg-surface">
                    <td className="px-4 py-3 font-medium text-primary">{challenge.title}</td>
                    <td className="px-4 py-3 text-secondary">{challenge.type}</td>
                    <td className="px-4 py-3 text-secondary">{challenge.category}</td>
                    <td className="px-4 py-3">
                      <Badge variant={STATUS_VARIANT[challenge.status]}>{challenge.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-tertiary">{challenge.updatedAt}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => navigate(`${challenge.id}/edit`)}
                          aria-label={`Edit ${challenge.title}`}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-glass text-secondary transition-colors hover:bg-surface hover:text-primary"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setArchiveTarget(challenge)}
                          aria-label={`Archive ${challenge.title}`}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-glass text-secondary transition-colors hover:border-[var(--border-danger)] hover:text-danger"
                        >
                          <Archive size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-sm text-secondary">
                      No challenges match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>

      <ConfirmActionModal
        open={Boolean(archiveTarget)}
        onClose={() => setArchiveTarget(null)}
        title="Archive challenge"
        description={
          archiveTarget
            ? `Archive "${archiveTarget.title}"? It will stop appearing in Practice for players.`
            : ''
        }
        confirmLabel="Archive"
        danger
        onConfirmed={() => showNotice('Archiving isn\u2019t wired up yet — coming soon.')}
      />
    </motion.div>
  );
}
