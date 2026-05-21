import React, { useState } from "react";
import { Text, TouchableOpacity } from "react-native";
import { MileageBottomSheet } from "../MileageBottomSheet";
import { formatMileageRange } from "../mileagePickerUtils";
import { ChevronRight } from "./catalogFilters.icons";
import { FilterBlock } from "./catalogFilters.shared";
import { catalogFilterStyles as styles } from "./catalogFilters.styles";
import type { CatalogFiltersRangeFields } from "./catalogFilters.types";

type Props = CatalogFiltersRangeFields & {
  filteredCount?: number;
};

export function CatalogFiltersMileageSection({
  from,
  to,
  filteredCount,
}: Props) {
  const [sheetVisible, setSheetVisible] = useState(false);
  const mileageLabel = formatMileageRange(from.value, to.value);
  const hasMileageFilter = from.value.trim() !== "" || to.value.trim() !== "";

  return (
    <>
      <FilterBlock>
        <Text style={styles.filterLabel}>Пробег, км</Text>
        <TouchableOpacity
          style={styles.mileageRow}
          onPress={() => setSheetVisible(true)}
          accessibilityLabel={`Пробег: ${mileageLabel}. Нажмите для выбора.`}
          accessibilityRole="button"
        >
          <Text style={[styles.mileageRowText, hasMileageFilter && styles.mileageRowTextActive]}>
            {mileageLabel}
          </Text>
          <ChevronRight />
        </TouchableOpacity>
      </FilterBlock>

      <MileageBottomSheet
        visible={sheetVisible}
        mileageFromText={from.value}
        mileageToText={to.value}
        filteredCount={filteredCount}
        onApply={(fromText, toText) => {
          from.onChange(fromText);
          to.onChange(toText);
        }}
        onReset={() => {
          from.onChange("");
          to.onChange("");
        }}
        onClose={() => setSheetVisible(false)}
      />
    </>
  );
}
