"use client";

import { Button } from "@plexui/ui/components/Button";
import { EmptyMessage } from "@plexui/ui/components/EmptyMessage";
import { ExclamationMarkCircleFilled } from "@plexui/ui/components/Icon";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex h-full items-center justify-center p-8">
      <EmptyMessage>
        <EmptyMessage.Icon color="danger">
          <ExclamationMarkCircleFilled />
        </EmptyMessage.Icon>
        <EmptyMessage.Title>Something went wrong</EmptyMessage.Title>
        <EmptyMessage.Description>
          {error.message || "An unexpected error occurred."}
        </EmptyMessage.Description>
        <EmptyMessage.ActionRow>
          <Button color="primary" onClick={reset}>
            Try again
          </Button>
        </EmptyMessage.ActionRow>
      </EmptyMessage>
    </div>
  );
}
