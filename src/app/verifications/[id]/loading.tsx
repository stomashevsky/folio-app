import { Skeleton } from "@plexui/ui/components/Skeleton";

function SidebarInfoRow() {
  return (
    <div className="py-2">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="mt-1.5 h-4 w-48" />
    </div>
  );
}

function TableSkeletonRow() {
  return (
    <div className="flex border-b border-[var(--color-border)] px-4 py-2.5">
      <div className="w-2/5">
        <Skeleton className="h-4 w-28" />
      </div>
      <div className="flex-1">
        <Skeleton className="h-4 w-40" />
      </div>
    </div>
  );
}

export default function VerificationDetailLoading() {
  return (
    <div className="flex h-full flex-col">
      {/* TopBar skeleton */}
      <div className="sticky top-0 z-10 shrink-0 border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 md:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-6 w-20" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-[72px] rounded-lg" />
            <Skeleton className="h-8 w-[60px] rounded-lg" />
          </div>
        </div>
      </div>

      {/* Content + Sidebar */}
      <div className="flex flex-1 flex-col overflow-auto md:flex-row md:overflow-hidden">
        {/* Main content */}
        <div className="flex shrink-0 flex-col md:min-w-0 md:flex-1 md:overflow-auto">
          <div className="flex-1 overflow-auto px-4 py-6 md:px-6">
            <div className="space-y-6">
              {/* Photos section */}
              <div>
                <Skeleton className="mb-3 h-5 w-24" />
                <div className="flex gap-4">
                  <Skeleton className="h-[160px] w-[120px] rounded-xl" />
                  <Skeleton className="h-[160px] w-[120px] rounded-xl" />
                  <Skeleton className="h-[160px] w-[160px] rounded-xl" />
                </div>
              </div>

              {/* Verification data section */}
              <div>
                <Skeleton className="mb-3 h-5 w-24" />
                <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
                  <TableSkeletonRow />
                  <TableSkeletonRow />
                  <TableSkeletonRow />
                  <TableSkeletonRow />
                </div>
              </div>

              {/* Checks section */}
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <Skeleton className="h-5 w-24" />
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-[120px] rounded-lg" />
                    <Skeleton className="h-8 w-[100px] rounded-lg" />
                  </div>
                </div>
                <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
                  <TableSkeletonRow />
                  <TableSkeletonRow />
                  <TableSkeletonRow />
                  <TableSkeletonRow />
                  <TableSkeletonRow />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right sidebar skeleton */}
        <div className="w-full border-t border-[var(--color-border)] bg-[var(--color-surface)] md:w-[440px] md:min-w-[280px] md:shrink md:overflow-auto md:border-l md:border-t-0">
          <div className="px-5 py-5">
            <Skeleton className="h-5 w-12" />
            <div className="mt-3 space-y-1">
              <SidebarInfoRow />
              <SidebarInfoRow />
              <SidebarInfoRow />
              <SidebarInfoRow />
            </div>
          </div>

          {/* Tags skeleton */}
          <div className="border-t border-[var(--color-border)] px-5 py-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-12" />
              <Skeleton className="h-7 w-10" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
