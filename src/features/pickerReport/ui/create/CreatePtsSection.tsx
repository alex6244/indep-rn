import React from "react";
import type { PtsFormState } from "../../../../types/draftReport";
import type { PtsFormFieldErrors } from "../../../../shared/validation/ptsValidation";
import { PtsForm } from "../PtsForm";

type Props = {
  value: PtsFormState;
  onChange: (next: PtsFormState) => void;
  externalErrors?: PtsFormFieldErrors;
  submitAttempt?: number;
};

export function CreatePtsSection({
  value,
  onChange,
  externalErrors,
  submitAttempt,
}: Props) {
  return (
    <PtsForm
      value={value}
      onChange={onChange}
      externalErrors={externalErrors}
      submitAttempt={submitAttempt}
    />
  );
}
