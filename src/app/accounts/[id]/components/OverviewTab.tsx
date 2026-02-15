import Image from "next/image";
import { Avatar } from "@plexui/ui/components/Avatar";
import { SectionHeading } from "@/components/shared";
import { formatDate, toTitleCase } from "@/lib/utils/format";
import type { Account, Inquiry, Verification } from "@/lib/types";
import { InquiriesTab } from "./InquiriesTab";

export function OverviewTab({
  account,
  inquiries,
  verifications,
}: {
  account: Account;
  inquiries: Inquiry[];
  verifications: Verification[];
}) {
  // Find a selfie photo for the profile card, fallback to first gov ID photo
  const selfieVer = verifications.find((v) => v.type === "selfie");
  const govIdVer = verifications.find((v) => v.type === "government_id");
  const profilePhoto =
    selfieVer?.photos?.[0] ?? govIdVer?.photos?.[0] ?? null;

  return (
    <div className="space-y-6">
      {/* Profile */}
      <div>
        <SectionHeading>Profile</SectionHeading>
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <div className="flex gap-6">
            {/* Photo */}
            <div className="shrink-0">
              {profilePhoto ? (
                <Image
                  src={profilePhoto.url}
                  alt={profilePhoto.label}
                  width={150}
                  height={150}
                  className="h-[150px] w-[150px] rounded-xl border border-[var(--color-border)] object-cover"
                />
              ) : (
                <Avatar name={account.name} size={150} color="primary" />
              )}
            </div>

            {/* Info grid — 2 columns */}
            <div className="grid flex-1 grid-cols-2 gap-x-8 gap-y-4 self-center">
              <div>
                <p className="text-xs text-[var(--color-text-tertiary)]">
                  Name
                </p>
                <p className="text-sm font-medium text-[var(--color-text)]">
                  {toTitleCase(account.name)}
                </p>
              </div>
              <div>
                <p className="text-xs text-[var(--color-text-tertiary)]">
                  Address
                </p>
                <p className="text-sm text-[var(--color-text)]">
                  {account.address ?? "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-[var(--color-text-tertiary)]">
                  Birthdate
                </p>
                <p className="text-sm text-[var(--color-text)]">
                  {account.birthdate ? formatDate(account.birthdate) : "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-[var(--color-text-tertiary)]">
                  Age
                </p>
                <p className="text-sm text-[var(--color-text)]">
                  {account.age ? `${account.age}` : "—"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inquiries */}
      <div>
        <SectionHeading badge={inquiries.length}>Inquiries</SectionHeading>
        <InquiriesTab inquiries={inquiries} />
      </div>
    </div>
  );
}
