import React from "react";
import { View } from "react-native";
import { MarkButton } from "../MarkButton";
import { FilterBlock } from "./catalogFilters.shared";
import { catalogFilterStyles as styles } from "./catalogFilters.styles";

type Props = {
  hasDiscount: boolean;
  onToggleHasDiscount: () => void;
  vatReturn: boolean;
  onToggleVatReturn: () => void;
  weeklyOffer: boolean;
  onToggleWeeklyOffer: () => void;
};

export function CatalogFiltersMarksSection({
  hasDiscount,
  onToggleHasDiscount,
  vatReturn,
  onToggleVatReturn,
  weeklyOffer,
  onToggleWeeklyOffer,
}: Props) {
  return (
    <FilterBlock>
      <View style={styles.marksRow}>
        <MarkButton label="Со скидками" selected={hasDiscount} onToggle={onToggleHasDiscount} />
        <MarkButton label="Возврат НДС" selected={vatReturn} onToggle={onToggleVatReturn} />
        <MarkButton label="Предложение недели" selected={weeklyOffer} onToggle={onToggleWeeklyOffer} />
      </View>
    </FilterBlock>
  );
}
