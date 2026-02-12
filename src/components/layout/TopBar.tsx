import { ButtonLink } from "@plexui/ui/components/Button";
import { ChevronLeftLg } from "@plexui/ui/components/Icon";

interface TopBarProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  toolbar?: React.ReactNode;
  /** Renders a "< Title" back link (OpenAI-style) that links to this href */
  backHref?: string;
}

export function TopBar({ title, description, actions, toolbar, backHref }: TopBarProps) {
  const hasToolbar = !!toolbar;

  return (
    <div className="sticky top-0 z-10 shrink-0 border-b border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-3">
      {/* Row 1: title + actions (always in title row) */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {backHref && (
            <ButtonLink
              href={backHref}
              color="secondary"
              variant="ghost"
              size="md"
              pill={false}
              data-uniform=""
            >
              <ChevronLeftLg />
            </ButtonLink>
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
        {actions && (
          <div className="flex shrink-0 items-center gap-2">{actions}</div>
        )}
      </div>

      {/* Row 2: toolbar (filters only) */}
      {hasToolbar && (
        <div className="mt-3 flex min-w-0 flex-wrap items-center gap-2">
          {toolbar}
        </div>
      )}
    </div>
  );
}
