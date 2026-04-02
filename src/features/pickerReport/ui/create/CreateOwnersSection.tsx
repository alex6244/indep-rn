import React from "react";
import { OwnersForm, type OwnerDraft } from "../OwnersForm";

type Props = {
  value: OwnerDraft[];
  onChange: (next: OwnerDraft[]) => void;
};

export function CreateOwnersSection({ value, onChange }: Props) {
  return <OwnersForm value={value} onChange={onChange} />;
}

