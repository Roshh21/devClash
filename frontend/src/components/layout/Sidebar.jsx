import { NavLink, Link } from 'react-router-dom';
import { ChevronsLeft, ChevronsRight, Code2, ShieldCheck } from 'lucide-react';
import { NAV_ITEMS, ADMIN_NAV_ITEMS } from '../../lib/navigation';
import { MOCK_USER } from '../../lib/mockUser';
import { useCurrentUser } from '../../lib/useCurrentUser';
import { cn } from '../../lib/utils';

export default function Sidebar({ collapsed = false, onToggleCollapse, onNavigate }) {
  const currentUser = useCurrentUser();

  return (
    <div className="flex h-full flex-col bg-bg-elevated">
      <div className={cn('flex items-center gap-2 px-5 py-5', collapsed && 'justify-center px-2')}>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-contrast">
          <Code2 size={18} />
        </span>
        {!collapsed && <span className="text-lg font-bold text-primary">DevClash</span>}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {NAV_ITEMS.map(({ id, label, path, icon: Icon }) => (
          <NavLink
            key={id}
            to={path}
            onClick={onNavigate}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                collapsed && 'justify-center px-0',
                isActive
                  ? 'bg-[var(--tint-accent)] text-accent'
                  : 'text-secondary hover:bg-surface hover:text-primary'
              )
            }
          >
            <Icon size={18} className="shrink-0" />
            {!collapsed && label}
          </NavLink>
        ))}

        {/* Deliberately still gated on the mock flag, not the real
            authenticated role — Stage B4 ("Roles & admin authorization")
            is what swaps this to a server-verified role and adds a way
            to actually become an admin. Until then every real signup
            defaults to 'user', so leaving this on the mock flag is what
            keeps the Admin panel demoable in the meantime. */}
        {MOCK_USER.role === 'admin' && (
          <div className="mt-4 border-t border-glass pt-4">
            {!collapsed && (
              <p className="flex items-center gap-1.5 px-3 pb-2 text-xs font-semibold uppercase tracking-wide text-tertiary">
                <ShieldCheck size={12} /> Admin
              </p>
            )}
            {ADMIN_NAV_ITEMS.map(({ id, label, path, icon: Icon }) => (
              <NavLink
                key={id}
                to={path}
                onClick={onNavigate}
                title={collapsed ? label : undefined}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                    collapsed && 'justify-center px-0',
                    isActive
                      ? 'bg-[var(--tint-accent)] text-accent'
                      : 'text-secondary hover:bg-surface hover:text-primary'
                  )
                }
              >
                <Icon size={18} className="shrink-0" />
                {!collapsed && label}
              </NavLink>
            ))}
          </div>
        )}
      </nav>

      <div className={cn('border-t border-glass p-3', collapsed && 'flex justify-center')}>
        <Link
          to="profile"
          onClick={onNavigate}
          title={collapsed ? currentUser.name : undefined}
          className={cn(
            'flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-surface-strong',
            !collapsed && 'bg-surface'
          )}
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-contrast">
            {currentUser.initials}
          </span>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-primary">{currentUser.name}</p>
              <p className="truncate text-xs text-secondary">{currentUser.league}</p>
            </div>
          )}
        </Link>
      </div>

      {onToggleCollapse && (
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="hidden items-center justify-center gap-2 border-t border-glass py-3 text-xs font-medium text-secondary transition-colors hover:text-primary lg:flex"
        >
          {collapsed ? (
            <ChevronsRight size={16} />
          ) : (
            <>
              <ChevronsLeft size={16} /> Collapse
            </>
          )}
        </button>
      )}
    </div>
  );
}
