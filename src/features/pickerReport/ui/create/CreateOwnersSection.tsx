import React from "react";
import type { OwnerFieldErrors } from "../../../../shared/validation/formatDdMmYyyy";
import { OwnersForm, type OwnerDraft } from "../OwnersForm";

type Props = {
  value: OwnerDraft[];
  onChange: (next: OwnerDraft[]) => void;
  externalErrorsByOwnerId?: Record<string, OwnerFieldErrors>;
  submitAttempt?: number;
};

export function CreateOwnersSection({
  value,
  onChange,
  externalErrorsByOwnerId,
  submitAttempt,
}: Props) {
  return (
    <OwnersForm
      value={value}
      onChange={onChange}
      externalErrorsByOwnerId={externalErrorsByOwnerId}
      submitAttempt={submitAttempt}
    />
  );
}
