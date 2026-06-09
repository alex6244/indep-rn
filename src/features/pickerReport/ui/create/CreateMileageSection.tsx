import React from "react";
import { MileageSection } from "../MileageSection";

type Props = {
  value: string;
  onChange: (next: string) => void;
  externalError?: string;
  submitAttempt?: number;
};

export function CreateMileageSection({
  value,
  onChange,
  externalError,
  submitAttempt,
}: Props) {
  return (
    <MileageSection
      value={value}
      onChange={onChange}
      externalError={externalError}
      submitAttempt={submitAttempt}
    />
  );
}
