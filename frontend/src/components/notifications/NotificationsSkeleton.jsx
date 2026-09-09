import Card from '../ui/Card';
import Skeleton from '../ui/Skeleton';

export default function NotificationsSkeleton() {
  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <Skeleton className="h-7 w-48" />
      <Card className="mt-6 max-w-2xl overflow-hidden">
        <div className="divide-y divide-glass">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3 px-4 py-3">
              <Skeleton className="h-8 w-8 shrink-0 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
