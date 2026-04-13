import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import SortIcon from "../../../assets/icons/sort.svg";

type CatalogStyles = typeof import("./Catalog.styles").catalogStyles;

type SortButtonRef = View & {
  measureInWindow: (callback: (x: number, y: number, width: number, height: number) => void) => void;
};

type CatalogFiltersBarProps = {
  sortButtonRef: React.RefObject<SortButtonRef | null>;
  toggleSort: () => void;
  openFilters: () => void;
  styles: CatalogStyles;
};

export function CatalogFiltersBar({
  sortButtonRef,
  toggleSort,
  openFilters,
  styles,
}: CatalogFiltersBarProps) {
  return (
    <View style={styles.filtersBar}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <TouchableOpacity
          ref={sortButtonRef}
          style={styles.sortButton}
          activeOpacity={0.9}
          onPress={toggleSort}
        >
          <SortIcon width={18} height={18} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.allFiltersButton} onPress={openFilters}>
          <Text style={styles.allFiltersText}>Все фильтры</Text>
        </TouchableOpacity>

        {["от 2023 до 2025 г.", "Со скидками", "Седан"].map((label) => (
          <View key={label} style={styles.filterChip}>
            <Text style={styles.filterChipText}>{label}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
