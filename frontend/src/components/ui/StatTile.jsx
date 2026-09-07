export default function StatTile({ label, value }) {
  return (
    <div className="rounded-xl border border-glass bg-surface p-4 text-center sm:text-left">
      <p className="text-xs font-medium text-secondary">{label}</p>
      <p className="mt-1 text-xl font-bold text-primary">{value}</p>
    </div>
  );
}
