import { NavLink, Link } from 'react-router-dom';
import { ChevronsLeft, ChevronsRight, Code2 } from 'lucide-react';
import { NAV_ITEMS } from '../../lib/navigation';
import { MOCK_USER } from '../../lib/mockUser';
import { cn } from '../../lib/utils';

export default function Sidebar({ collapsed = false, onToggleCollapse, onNavigate }) {
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
      </nav>

      <div className={cn('border-t border-glass p-3', collapsed && 'flex justify-center')}>
        <Link
          to="profile"
          onClick={onNavigate}
          title={collapsed ? MOCK_USER.name : undefined}
          className={cn(
            'flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-surface-strong',
            !collapsed && 'bg-surface'
          )}
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-contrast">
            {MOCK_USER.initials}
          </span>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-primary">{MOCK_USER.name}</p>
              <p className="truncate text-xs text-secondary">{MOCK_USER.league}</p>
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
