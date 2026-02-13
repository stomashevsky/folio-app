import { ButtonLink } from "@plexui/ui/components/Button";
import { ChevronLeftLg } from "@plexui/ui/components/Icon";

interface TopBarProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  toolbar?: React.ReactNode;
  /** Tab bar rendered tight below the title — its underline replaces the header border */
  tabs?: React.ReactNode;
  /** Renders a "< Title" back link (OpenAI-style) that links to this href */
  backHref?: string;
}

export function TopBar({ title, description, actions, toolbar, tabs, backHref }: TopBarProps) {
  const hasToolbar = !!toolbar;
  const hasTabs = !!tabs;

  return (
    <div
      className={`sticky top-0 z-10 shrink-0 border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4 md:px-6 ${
        hasTabs ? "pb-0 pt-3" : "py-3"
      }`}
    >
      {/* Row 1: title + actions — min-h-9 keeps height stable with or without action buttons */}
      <div className="flex min-h-9 items-center justify-between">
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
            <h1 className="heading-md text-[var(--color-text)]">
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

      {/* Row 2: tabs — tight spacing, tab underline replaces header border */}
      {hasTabs && <div className="mt-1 translate-y-px">{tabs}</div>}

      {/* Row 2: toolbar (filters only) */}
      {hasToolbar && (
        <div className="mt-3 flex min-w-0 flex-wrap items-center gap-2">
          {toolbar}
        </div>
      )}
    </div>
  );
}
