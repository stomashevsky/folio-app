import { Skeleton } from "@plexui/ui/components/Skeleton";

export default function AccountDetailLoading() {
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
          {/* Profile header */}
          <div className="flex items-center gap-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <Skeleton className="h-16 w-16 rounded-full" circle />
            <div className="flex-1">
              <Skeleton className="mb-2 h-5 w-32" />
              <Skeleton className="mb-2 h-4 w-40" />
              <Skeleton className="h-4 w-48" />
            </div>
            <div className="flex items-center gap-4">
              <Skeleton className="h-6 w-20 rounded-lg" />
              <div className="flex gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i}>
                    <Skeleton className="mb-1 h-5 w-8" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-[var(--color-border)]">
            <div className="flex gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-5 w-20" />
              ))}
            </div>
          </div>

          {/* Tab content - cards grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
                <Skeleton className="mb-3 h-5 w-24" />
                <Skeleton className="mb-2 h-4 w-32" />
                <Skeleton className="h-4 w-28" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
