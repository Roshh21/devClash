import Card from '../ui/Card';
import Skeleton from '../ui/Skeleton';

export default function FriendsSkeleton() {
  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="space-y-2">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-4 w-72" />
      </div>
      <Skeleton className="mt-6 h-11 w-full max-w-md" />
      <div className="mt-8 max-w-xl">
        <Skeleton className="h-9 w-48" />
        <div className="mt-4 flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="flex items-center gap-3 p-3">
              <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-9 w-24 rounded-lg" />
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
