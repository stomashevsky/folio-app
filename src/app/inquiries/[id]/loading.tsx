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

export default function InquiryDetailLoading() {
  return (
    <div className="flex h-full flex-col">
      {/* TopBar skeleton */}
      <div className="sticky top-0 z-10 shrink-0 border-b border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-3">
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
      <div className="flex flex-1 overflow-hidden">
        {/* Main content */}
        <div className="flex flex-1 flex-col overflow-auto">
          {/* Tabs skeleton */}
          <div className="shrink-0 border-b border-[var(--color-border)] px-6 pt-4 pb-0">
            <div className="flex gap-4 pb-3">
              <Skeleton className="h-5 w-[72px]" />
              <Skeleton className="h-5 w-[108px]" />
              <Skeleton className="h-5 w-[80px]" />
              <Skeleton className="h-5 w-[60px]" />
              <Skeleton className="h-5 w-[72px]" />
            </div>
          </div>

          {/* Overview tab content skeleton */}
          <div className="flex-1 overflow-auto px-6 py-6">
            <div className="space-y-6">
              {/* Summary section */}
              <div>
                <Skeleton className="mb-3 h-5 w-24" />
                <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
                  <TableSkeletonRow />
                  <TableSkeletonRow />
                  <TableSkeletonRow />
                </div>
              </div>

              {/* Collected photos */}
              <div>
                <Skeleton className="mb-1 h-5 w-24" />
                <Skeleton className="mb-3 h-4 w-48" />
                <div className="flex gap-4">
                  <Skeleton className="h-[160px] w-[120px] rounded-xl" />
                  <Skeleton className="h-[160px] w-[120px] rounded-xl" />
                  <Skeleton className="h-[160px] w-[160px] rounded-xl" />
                  <Skeleton className="h-[160px] w-[160px] rounded-xl" />
                  <Skeleton className="h-[160px] w-[160px] rounded-xl" />
                </div>
              </div>

              {/* Attributes */}
              <div>
                <Skeleton className="mb-3 h-5 w-24" />
                <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
                  <TableSkeletonRow />
                  <TableSkeletonRow />
                  <TableSkeletonRow />
                  <TableSkeletonRow />
                  <TableSkeletonRow />
                </div>
              </div>

              {/* Location */}
              <div>
                <Skeleton className="mb-3 h-5 w-24" />
                <Skeleton className="h-[300px] w-full rounded-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Right sidebar skeleton */}
        <div className="w-[440px] shrink-0 overflow-auto border-l border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className="px-5 py-5">
            <Skeleton className="h-5 w-12" />
            <div className="mt-3 space-y-1">
              <SidebarInfoRow />
              <SidebarInfoRow />
              <SidebarInfoRow />
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

          {/* Event timeline skeleton */}
          <div className="border-t border-[var(--color-border)] px-5 py-4">
            <Skeleton className="h-5 w-40" />
            <div className="mt-4 space-y-4">
              <Skeleton className="h-4 w-24" />
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Skeleton className="mt-0.5 h-3 w-12" />
                  <Skeleton className="h-2.5 w-2.5 shrink-0" circle />
                  <Skeleton className="h-4 w-48" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
