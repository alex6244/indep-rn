import React from "react";
import { PtsForm, type PtsFormState } from "../PtsForm";

type Props = {
  value: PtsFormState;
  onChange: (next: PtsFormState) => void;
};

export function CreatePtsSection({ value, onChange }: Props) {
  return <PtsForm value={value} onChange={onChange} />;
}

