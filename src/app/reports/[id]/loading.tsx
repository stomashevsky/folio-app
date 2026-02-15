import { Skeleton } from "@plexui/ui/components/Skeleton";

export default function ReportDetailLoading() {
  return (
    <div className="flex h-full flex-col">
      {/* TopBar skeleton */}
      <div className="sticky top-0 z-10 shrink-0 border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 md:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-6 w-20" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-4 py-6 md:px-6">
        <div className="space-y-6">
          {/* Summary cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
                <Skeleton className="mb-3 h-4 w-20" />
                <Skeleton className="h-6 w-32" />
              </div>
            ))}
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
                <Skeleton className="mb-4 h-5 w-24" />
                <div className="space-y-3">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-4 w-44" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
