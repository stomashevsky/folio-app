import { TopBar } from "@/components/layout/TopBar";
import { EmptyMessage } from "@plexui/ui/components/EmptyMessage";
import { Grid } from "@plexui/ui/components/Icon";

export default function VerificationTemplatesPage() {
  return (
    <div className="flex min-h-full flex-col">
      <TopBar
        title="Verification Templates"
        description="Configure verification check types and requirements"
      />
      <div className="flex flex-1 items-center justify-center py-12">
        <EmptyMessage>
          <EmptyMessage.Icon color="secondary"><Grid /></EmptyMessage.Icon>
          <EmptyMessage.Title>No templates yet</EmptyMessage.Title>
          <EmptyMessage.Description>
            Verification templates define check types like government ID and
            selfie. This feature is coming soon.
          </EmptyMessage.Description>
        </EmptyMessage>
      </div>
    </div>
  );
}
