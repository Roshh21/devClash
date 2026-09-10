import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ShieldOff, ShieldCheck, UserX } from 'lucide-react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import InlineNotice from '../components/ui/InlineNotice';
import Pagination from '../components/ui/Pagination';
import ConfirmActionModal from '../components/admin/ConfirmActionModal';
import AdminTableSkeleton from '../components/admin/AdminTableSkeleton';
import { useDebouncedValue } from '../lib/useDebouncedValue';
import { api } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { slideUp, staggerContainer } from '../lib/motion';

const ROLE_VARIANT = { admin: 'accent', user: 'default' };
const STATUS_VARIANT = { active: 'success', blocked: 'danger' };
const PAGE_SIZE = 8;

function formatJoined(dateString) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function toRow(user) {
  return {
    id: user.id,
    name: user.username,
    email: user.email,
    role: user.role,
    status: user.status,
    joined: formatJoined(user.createdAt),
  };
}

const ACTION_COPY = {
  block: {
    title: 'Block user',
    confirmLabel: 'Block',
    danger: true,
    description: (u) => `Block ${u.name}? They won't be able to log in until unblocked.`,
    successMessage: (u) => `${u.name} has been blocked.`,
    request: (id) => api.patch(`/api/admin/users/${id}/block`, undefined),
  },
  unblock: {
    title: 'Unblock user',
    confirmLabel: 'Unblock',
    danger: false,
    description: (u) => `Unblock ${u.name}? They'll be able to log in again.`,
    successMessage: (u) => `${u.name} has been unblocked.`,
    request: (id) => api.patch(`/api/admin/users/${id}/unblock`, undefined),
  },
  promote: {
    title: 'Promote to admin',
    confirmLabel: 'Promote',
    danger: false,
    description: (u) => `Give ${u.name} admin access? They'll be able to manage content and users.`,
    successMessage: (u) => `${u.name} is now an admin.`,
    request: (id) => api.patch(`/api/admin/users/${id}/promote`, undefined),
  },
  demote: {
    title: 'Remove admin access',
    confirmLabel: 'Demote',
    danger: true,
    description: (u) => `Remove ${u.name}'s admin access?`,
    successMessage: (u) => `${u.name} is no longer an admin.`,
    request: (id) => api.patch(`/api/admin/users/${id}/demote`, undefined),
  },
  remove: {
    title: 'Remove user',
    confirmLabel: 'Remove',
    danger: true,
    description: (u) => `Permanently remove ${u.name}'s account? This can't be undone.`,
    successMessage: (u) => `${u.name}'s account has been removed.`,
    request: (id) => api.delete(`/api/admin/users/${id}`),
  },
};

export default function AdminUsersPage() {
  const token = useAuthStore((s) => s.token);
  const currentUser = useAuthStore((s) => s.user);

  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebouncedValue(searchInput, 350);

  const [page, setPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [initialLoading, setInitialLoading] = useState(true);
  const [fetching, setFetching] = useState(true);
  const [loadError, setLoadError] = useState(null);
  // Bumped after a successful block/unblock/promote/demote/remove to
  // force the effect below to re-run against the same page/search —
  // simpler and safer than extracting the fetch into a function called
  // from both the effect and the action handler (which also re-fetches
  // instead of patching state optimistically, so it can't drift from
  // what the server actually did).
  const [refetchIndex, setRefetchIndex] = useState(0);

  const [pendingAction, setPendingAction] = useState(null);
  const [notice, setNotice] = useState(null);

  // Reset to page 1 whenever the (debounced) search term changes —
  // adjusted during render (React's recommended pattern for this)
  // rather than in an effect, so it doesn't cost an extra render pass.
  const [searchAtLastPage, setSearchAtLastPage] = useState(debouncedSearch);
  if (debouncedSearch !== searchAtLastPage) {
    setSearchAtLastPage(debouncedSearch);
    setPage(1);
  }

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setFetching(true);
      setLoadError(null);
      try {
        const params = new URLSearchParams({ page: String(page), limit: String(PAGE_SIZE) });
        if (debouncedSearch.trim()) params.set('search', debouncedSearch.trim());
        const data = await api.get(`/api/admin/users?${params.toString()}`, { token });
        if (cancelled) return;
        setUsers(data.users.map(toRow));
        setTotalPages(data.pagination.totalPages);
      } catch (err) {
        if (cancelled) return;
        setLoadError(err.message || "Couldn't load users. Please try again.");
      } finally {
        if (!cancelled) {
          setFetching(false);
          setInitialLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [page, debouncedSearch, token, refetchIndex]);

  function showNotice(message) {
    setNotice(message);
    window.setTimeout(() => setNotice(null), 3500);
  }

  function openAction(user, type) {
    setPendingAction({ user, type });
  }

  async function handleConfirmedAction() {
    if (!pendingAction) return;
    const { user, type } = pendingAction;

    await ACTION_COPY[type].request(user.id);

    // Removing the only row on a page beyond the first would leave
    // that page empty — back up a page instead (this alone re-fires
    // the fetch effect via its `page` dependency). Every other action
    // (block/unblock/promote/demote) never changes whether a user
    // matches the current search text, so the row count on this page
    // can't change from those — just re-fetch it as-is.
    if (type === 'remove' && users.length === 1 && page > 1) {
      setPage((p) => Math.max(1, p - 1));
    } else {
      setRefetchIndex((i) => i + 1);
    }

    showNotice(ACTION_COPY[type].successMessage(user));
  }

  if (initialLoading) {
    return <AdminTableSkeleton statTiles={0} />;
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer(0.08)}
      className="px-4 py-6 sm:px-6 lg:px-8"
    >
      <motion.div variants={slideUp}>
        <h1 className="text-2xl font-bold text-primary sm:text-3xl">Users</h1>
        <p className="mt-1 text-secondary">Search accounts and manage access.</p>
      </motion.div>

      <motion.div variants={slideUp} className="mt-6 max-w-md">
        <Input
          icon={<Search size={16} />}
          placeholder="Search by username or email..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </motion.div>

      <InlineNotice message={notice} className="max-w-md" />
      <InlineNotice message={loadError} tone="danger" className="max-w-md" />

      <motion.div variants={slideUp}>
        <Card className="mt-6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface-strong text-left text-xs font-medium uppercase tracking-wide text-secondary">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Joined</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-glass">
                {users.map((user) => {
                  const isSelf = currentUser?.id === user.id;
                  return (
                    <tr key={user.id} className="transition-colors hover:bg-surface">
                      <td className="px-4 py-3">
                        <p className="font-medium text-primary">
                          {user.name}
                          {isSelf && <span className="ml-1.5 text-xs font-normal text-tertiary">(you)</span>}
                        </p>
                        <p className="text-xs text-secondary">{user.email}</p>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={ROLE_VARIANT[user.role]}>{user.role}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={STATUS_VARIANT[user.status]}>{user.status}</Badge>
                      </td>
                      <td className="px-4 py-3 text-tertiary">{user.joined}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openAction(user, user.status === 'blocked' ? 'unblock' : 'block')}
                            aria-label={user.status === 'blocked' ? `Unblock ${user.name}` : `Block ${user.name}`}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-glass text-secondary transition-colors hover:bg-surface hover:text-primary"
                          >
                            {user.status === 'blocked' ? <ShieldCheck size={14} /> : <ShieldOff size={14} />}
                          </button>
                          <button
                            type="button"
                            onClick={() => openAction(user, user.role === 'admin' ? 'demote' : 'promote')}
                            aria-label={user.role === 'admin' ? `Remove admin from ${user.name}` : `Promote ${user.name}`}
                            className="rounded-lg border border-glass px-2.5 py-1.5 text-xs font-semibold text-secondary transition-colors hover:bg-surface hover:text-primary"
                          >
                            {user.role === 'admin' ? 'Demote' : 'Promote'}
                          </button>
                          <button
                            type="button"
                            onClick={() => openAction(user, 'remove')}
                            aria-label={`Remove ${user.name}`}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-glass text-secondary transition-colors hover:border-[var(--border-danger)] hover:text-danger"
                          >
                            <UserX size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {users.length === 0 && !fetching && !loadError && (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-sm text-secondary">
                      No users match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <Pagination
              page={page}
              totalPages={totalPages}
              onPrev={() => setPage((p) => Math.max(1, p - 1))}
              onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
            />
          )}
        </Card>
      </motion.div>

      <ConfirmActionModal
        open={Boolean(pendingAction)}
        onClose={() => setPendingAction(null)}
        title={pendingAction ? ACTION_COPY[pendingAction.type].title : ''}
        description={pendingAction ? ACTION_COPY[pendingAction.type].description(pendingAction.user) : ''}
        confirmLabel={pendingAction ? ACTION_COPY[pendingAction.type].confirmLabel : 'Confirm'}
        danger={pendingAction ? ACTION_COPY[pendingAction.type].danger : false}
        onConfirm={handleConfirmedAction}
      />
    </motion.div>
  );
}
