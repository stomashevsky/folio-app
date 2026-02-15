import { TopBar } from "@/components/layout/TopBar";
import { EmptyMessage } from "@plexui/ui/components/EmptyMessage";
import { Grid } from "@plexui/ui/components/Icon";

export default function ReportTemplatesPage() {
  return (
    <div className="flex min-h-full flex-col">
      <TopBar
        title="Report Templates"
        description="Configure AML screening and watchlist report templates"
      />
      <div className="flex flex-1 items-center justify-center py-12">
        <EmptyMessage>
          <EmptyMessage.Icon color="secondary"><Grid /></EmptyMessage.Icon>
          <EmptyMessage.Title>No templates yet</EmptyMessage.Title>
          <EmptyMessage.Description>
            Report templates define AML screening rules and watchlist
            configurations. This feature is coming soon.
          </EmptyMessage.Description>
        </EmptyMessage>
      </div>
    </div>
  );
}
