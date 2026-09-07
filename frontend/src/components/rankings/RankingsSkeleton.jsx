import Card from '../ui/Card';
import Skeleton from '../ui/Skeleton';

export default function RankingsSkeleton() {
  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="space-y-2">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-4 w-64" />
      </div>
      <Card className="mt-6 p-5">
        <Skeleton className="h-9 w-64" />
        <div className="mt-5 space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </Card>
    </div>
  );
}
