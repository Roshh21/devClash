import Card from '../ui/Card';

export default function StatCard({ icon: Icon, label, value, footer, children }) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-secondary">{label}</span>
        {Icon && <Icon size={16} className="shrink-0 text-tertiary" />}
      </div>
      <div className="mt-3 flex items-end justify-between gap-3">
        <span className="text-2xl font-bold text-primary">{value}</span>
        {children}
      </div>
      {footer && <p className="mt-1 text-xs text-secondary">{footer}</p>}
    </Card>
  );
}
