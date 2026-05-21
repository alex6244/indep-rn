import React from "react";
import { Text, View } from "react-native";
import { AppInput } from "../../../../shared/ui/AppInput";
import type { CatalogFiltersRangeFields } from "./catalogFilters.types";
import { FilterBlock, SectionHeader } from "./catalogFilters.shared";
import { catalogFilterStyles as styles } from "./catalogFilters.styles";

type Props = {
  label: string;
  range: CatalogFiltersRangeFields;
  fromPlaceholder?: string;
  toPlaceholder?: string;
  formatFrom?: (text: string) => string;
  formatTo?: (text: string) => string;
  withReset?: boolean;
};

export function CatalogFiltersNumericRangeSection({
  label,
  range,
  fromPlaceholder = "От",
  toPlaceholder = "До",
  formatFrom,
  formatTo,
  withReset = false,
}: Props) {
  const hasFilter = range.from.value.trim() !== "" || range.to.value.trim() !== "";

  return (
    <FilterBlock>
      {withReset ? (
        <SectionHeader
          label={label}
          showReset={hasFilter}
          onReset={() => {
            range.from.onChange("");
            range.to.onChange("");
          }}
        />
      ) : (
        <Text style={styles.filterLabel}>{label}</Text>
      )}
      <View style={styles.inputsRow}>
        <AppInput
          placeholder={fromPlaceholder}
          keyboardType="numeric"
          value={range.from.value}
          onChangeText={(text) => range.from.onChange(formatFrom ? formatFrom(text) : text)}
          containerStyle={styles.inputHalf}
        />
        <AppInput
          placeholder={toPlaceholder}
          keyboardType="numeric"
          value={range.to.value}
          onChangeText={(text) => range.to.onChange(formatTo ? formatTo(text) : text)}
          containerStyle={styles.inputHalf}
        />
      </View>
    </FilterBlock>
  );
}
