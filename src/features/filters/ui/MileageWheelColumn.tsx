import React from "react";
import { WheelColumn } from "../../../shared/ui/WheelColumn";
import { formatMileageRu, MILEAGE_VALUES } from "./mileagePickerUtils";

type Props = {
  label: string;
  selectedIndex: number;
  onIndexChange: (idx: number) => void;
};

export function MileageWheelColumn({ label, selectedIndex, onIndexChange }: Props) {
  return (
    <WheelColumn
      label={label}
      values={MILEAGE_VALUES}
      selectedIndex={selectedIndex}
      formatValue={formatMileageRu}
      onIndexChange={onIndexChange}
    />
  );
}

export { WHEEL_ITEM_H } from "../../../shared/ui/WheelColumn";
