import React, { useState } from "react";
import { Text, TouchableOpacity } from "react-native";
import { AppInput } from "../../../../shared/ui/AppInput";
import { FilterBrandPickerModal } from "../FilterBrandPickerModal";
import { ChevronRight } from "./catalogFilters.icons";
import { FilterBlock } from "./catalogFilters.shared";
import { catalogFilterStyles as styles } from "./catalogFilters.styles";

type Props = {
  brandQuery: string;
  onChangeBrandQuery: (value: string) => void;
  modelQuery: string;
  onChangeModelQuery: (value: string) => void;
  filteredCount?: number;
};

export function CatalogFiltersVehicleSection({
  brandQuery,
  onChangeBrandQuery,
  modelQuery,
  onChangeModelQuery,
  filteredCount,
}: Props) {
  const [brandPickerVisible, setBrandPickerVisible] = useState(false);

  return (
    <>
      <FilterBlock>
        <Text style={styles.filterLabel}>Автомобиль</Text>
        <TouchableOpacity
          style={[styles.brandTrigger, styles.inputWrap]}
          onPress={() => setBrandPickerVisible(true)}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={brandQuery || "Марка"}
        >
          <Text style={brandQuery ? styles.brandTriggerTextActive : styles.brandTriggerTextPlaceholder}>
            {brandQuery || "Марка"}
          </Text>
          {brandQuery ? (
            <TouchableOpacity
              hitSlop={8}
              onPress={() => onChangeBrandQuery("")}
              accessibilityRole="button"
              accessibilityLabel="Сбросить марку"
            >
              <Text style={styles.brandClearBtn}>✕</Text>
            </TouchableOpacity>
          ) : (
            <ChevronRight />
          )}
        </TouchableOpacity>
        <AppInput placeholder="Модель" value={modelQuery} onChangeText={onChangeModelQuery} />
      </FilterBlock>

      <FilterBrandPickerModal
        visible={brandPickerVisible}
        value={brandQuery}
        onChange={onChangeBrandQuery}
        onClose={() => setBrandPickerVisible(false)}
        filteredCount={filteredCount}
      />
    </>
  );
}
