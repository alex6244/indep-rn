import React from "react";
import { Text, View } from "react-native";
import { MarkButton } from "../MarkButton";
import { FEATURE_OPTIONS } from "./catalogFilters.constants";
import { FilterBlock } from "./catalogFilters.shared";
import { catalogFilterStyles as styles } from "./catalogFilters.styles";

type Props = {
  selected: string[];
  onToggle: (label: string) => void;
};

export function CatalogFiltersFeaturesSection({ selected, onToggle }: Props) {
  return (
    <FilterBlock>
      <Text style={styles.filterLabel}>Особенности</Text>
      <View style={styles.marksRow}>
        {FEATURE_OPTIONS.map((label) => (
          <MarkButton
            key={label}
            label={label}
            selected={selected.includes(label)}
            onToggle={() => onToggle(label)}
          />
        ))}
      </View>
    </FilterBlock>
  );
}
