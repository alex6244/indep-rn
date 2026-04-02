import React from "react";
import { DefectsForm, type DefectsState } from "../DefectsForm";

type Props = {
  value: DefectsState;
  onChange: (next: DefectsState) => void;
};

export function CreateDefectsSection({ value, onChange }: Props) {
  return <DefectsForm value={value} onChange={onChange} />;
}

