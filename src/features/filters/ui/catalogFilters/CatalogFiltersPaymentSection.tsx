import React from "react";
import { Text } from "react-native";
import { EntitiesToggle } from "../../../../widgets/entitiesToggle/EntitiesToggle";
import type { PaymentType } from "../../../catalog/hooks/useCatalogFiltersController";
import { FilterBlock } from "./catalogFilters.shared";
import { catalogFilterStyles as styles } from "./catalogFilters.styles";

type Props = {
  type: PaymentType;
  onChange: (value: PaymentType) => void;
};

export function CatalogFiltersPaymentSection({ type, onChange }: Props) {
  return (
    <FilterBlock>
      <Text style={styles.filterLabel}>Способ оплаты</Text>
      <EntitiesToggle
        leftLabel="Наличные"
        rightLabel="В кредит"
        value={type}
        onChange={onChange}
      />
    </FilterBlock>
  );
}
