import Card from '../ui/Card';
import Skeleton from '../ui/Skeleton';

export default function AdminFormSkeleton() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="mt-3 h-8 w-56" />
      <Skeleton className="mt-2 h-4 w-72" />

      <Card className="mt-6 flex flex-col gap-4 p-5 sm:p-6">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-11 w-full" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-11 w-full" />
        </div>
        <Skeleton className="h-24 w-full" />
      </Card>
    </div>
  );
}
