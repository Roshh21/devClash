import Card from '../ui/Card';
import Skeleton from '../ui/Skeleton';

export default function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-7 w-56" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="hidden h-4 w-48 sm:block" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="p-5">
            <Skeleton className="h-11 w-11 rounded-xl" />
            <Skeleton className="mt-4 h-4 w-24" />
            <Skeleton className="mt-2 h-3 w-32" />
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="p-5">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="mt-4 h-7 w-16" />
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="p-5">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="mx-auto mt-6 h-24 w-24 rounded-full" />
        </Card>
        <Card className="p-5 lg:col-span-1">
          <Skeleton className="h-4 w-32" />
          <div className="mt-4 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="mt-4 h-5 w-full" />
          <Skeleton className="mt-2 h-4 w-3/4" />
          <Skeleton className="mt-6 h-10 w-full" />
        </Card>
      </div>
    </div>
  );
}
