import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ShieldOff, ShieldCheck, UserX } from 'lucide-react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import InlineNotice from '../components/ui/InlineNotice';
import ConfirmActionModal from '../components/admin/ConfirmActionModal';
import AdminTableSkeleton from '../components/admin/AdminTableSkeleton';
import { useMockLoading } from '../lib/useMockLoading';
import { ADMIN_USERS } from '../lib/mockAdminUsers';
import { slideUp, staggerContainer } from '../lib/motion';

const ROLE_VARIANT = { admin: 'accent', user: 'default' };
const STATUS_VARIANT = { active: 'success', blocked: 'danger' };

export default function AdminUsersPage() {
  const loading = useMockLoading();
  const [search, setSearch] = useState('');
  const [pendingAction, setPendingAction] = useState(null);
  const [notice, setNotice] = useState(null);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return ADMIN_USERS;
    return ADMIN_USERS.filter(
      (u) => u.name.toLowerCase().includes(query) || u.email.toLowerCase().includes(query)
    );
  }, [search]);

  function showNotice(message) {
    setNotice(message);
    window.setTimeout(() => setNotice(null), 3500);
  }

  function openAction(user, type) {
    setPendingAction({ user, type });
  }

  const actionCopy = {
    block: {
      title: 'Block user',
      confirmLabel: 'Block',
      danger: true,
      description: (u) => `Block ${u.name}? They won't be able to log in until unblocked.`,
    },
    unblock: {
      title: 'Unblock user',
      confirmLabel: 'Unblock',
      danger: false,
      description: (u) => `Unblock ${u.name}? They'll be able to log in again.`,
    },
    promote: {
      title: 'Promote to admin',
      confirmLabel: 'Promote',
      danger: false,
      description: (u) => `Give ${u.name} admin access? They'll be able to manage content and users.`,
    },
    demote: {
      title: 'Remove admin access',
      confirmLabel: 'Demote',
      danger: true,
      description: (u) => `Remove ${u.name}'s admin access?`,
    },
    remove: {
      title: 'Remove user',
      confirmLabel: 'Remove',
      danger: true,
      description: (u) => `Permanently remove ${u.name}'s account? This can't be undone.`,
    },
  };

  if (loading) {
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
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </motion.div>

      <InlineNotice message={notice} className="max-w-md" />

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
                {filtered.map((user) => (
                  <tr key={user.id} className="transition-colors hover:bg-surface">
                    <td className="px-4 py-3">
                      <p className="font-medium text-primary">{user.name}</p>
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
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-sm text-secondary">
                      No users match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>

      <ConfirmActionModal
        open={Boolean(pendingAction)}
        onClose={() => setPendingAction(null)}
        title={pendingAction ? actionCopy[pendingAction.type].title : ''}
        description={pendingAction ? actionCopy[pendingAction.type].description(pendingAction.user) : ''}
        confirmLabel={pendingAction ? actionCopy[pendingAction.type].confirmLabel : 'Confirm'}
        danger={pendingAction ? actionCopy[pendingAction.type].danger : false}
        onConfirmed={() => showNotice("User management isn't wired up yet — coming soon. Nothing changed.")}
      />
    </motion.div>
  );
}
