export default function EmptyTabState({ icon: Icon, label, description }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-glass-strong px-6 py-14 text-center">
      {Icon && (
        <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--tint-accent)] text-accent">
          <Icon size={22} />
        </span>
      )}
      <p className="font-semibold text-primary">{label}</p>
      {description && <p className="mt-1.5 max-w-xs text-sm text-secondary">{description}</p>}
    </div>
  );
}
