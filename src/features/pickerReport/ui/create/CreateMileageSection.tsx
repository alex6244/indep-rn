import React from "react";
import { MileageSection } from "../MileageSection";

type Props = {
  value: string;
  onChange: (next: string) => void;
};

export function CreateMileageSection({ value, onChange }: Props) {
  return <MileageSection value={value} onChange={onChange} />;
}

