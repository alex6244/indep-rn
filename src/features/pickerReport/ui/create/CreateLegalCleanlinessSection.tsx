import React from "react";
import {
  LegalCleanlinessForm,
  type LegalCleanlinessState,
} from "../LegalCleanlinessForm";

type Props = {
  value: LegalCleanlinessState;
  onChange: (next: LegalCleanlinessState) => void;
};

export function CreateLegalCleanlinessSection({ value, onChange }: Props) {
  return <LegalCleanlinessForm value={value} onChange={onChange} />;
}

