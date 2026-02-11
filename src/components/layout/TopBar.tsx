import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface TopBarProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  toolbar?: React.ReactNode;
  /** Renders a ← arrow before the title that links back to this href */
  backHref?: string;
}

export function TopBar({ title, description, actions, toolbar, backHref }: TopBarProps) {
  const hasToolbar = !!toolbar;

  return (
    <div className="sticky top-0 z-10 shrink-0 border-b border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-4">
      {/* Row 1: title + actions (when no toolbar) */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {backHref && (
            <Link
              href={backHref}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-text-tertiary)] transition-colors hover:bg-[var(--color-surface-secondary)] hover:text-[var(--color-text)]"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
          )}
          <div>
            <h1 className="text-xl font-semibold text-[var(--color-text)]">
              {title}
            </h1>
            {description && (
              <p className="mt-0.5 text-xs text-[var(--color-text-tertiary)]">
                {description}
              </p>
            )}
          </div>
        </div>
        {!hasToolbar && actions && (
          <div className="flex items-center gap-2">{actions}</div>
        )}
      </div>

      {/* Row 2: toolbar (search left) + actions (right) */}
      {hasToolbar && (
        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            {toolbar}
          </div>
          {actions && (
            <div className="flex items-center gap-2">{actions}</div>
          )}
        </div>
      )}
    </div>
  );
}
