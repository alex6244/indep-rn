import React from "react";
import { GeneralInfoCheckboxes } from "../GeneralInfoCheckboxes";

type Props = {
  value: Record<string, boolean>;
  onChange: (next: Record<string, boolean>) => void;
};

export function CreateGeneralInfoSection({ value, onChange }: Props) {
  return <GeneralInfoCheckboxes value={value} onChange={onChange} />;
}

