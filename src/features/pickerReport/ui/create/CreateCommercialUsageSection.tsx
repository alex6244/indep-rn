import React from "react";
import {
  CommercialUsageForm,
  type CommercialUsageState,
} from "../CommercialUsageForm";

type Props = {
  value: CommercialUsageState;
  onChange: (next: CommercialUsageState) => void;
};

export function CreateCommercialUsageSection({
  value,
  onChange,
}: Props) {
  return <CommercialUsageForm value={value} onChange={onChange} />;
}

