import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { BackCaretBlack } from "./catalogFilters.icons";
import { catalogFilterStyles as styles } from "./catalogFilters.styles";

type Props = {
  onClose: () => void;
};

export function CatalogFiltersHeader({ onClose }: Props) {
  return (
    <>
      <TouchableOpacity onPress={onClose} style={styles.backBtn}>
        <BackCaretBlack width={18} height={18} />
        <Text style={styles.backBtnText}>Назад</Text>
      </TouchableOpacity>
      <Text style={styles.filtersTitle}>Фильтры</Text>
    </>
  );
}
