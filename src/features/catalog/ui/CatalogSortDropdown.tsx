import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import type { SortOption } from "../hooks/useCatalogFiltersController";

type CatalogStyles = typeof import("./Catalog.styles").catalogStyles;

type CatalogSortDropdownProps = {
  visible: boolean;
  sortOption: SortOption;
  dropdownTop: number;
  dropdownLeft: number;
  dropdownWidth: number;
  onClose: () => void;
  onSelect: (next: SortOption) => void;
  styles: CatalogStyles;
};

export function CatalogSortDropdown({
  visible,
  sortOption,
  dropdownTop,
  dropdownLeft,
  dropdownWidth,
  onClose,
  onSelect,
  styles,
}: CatalogSortDropdownProps) {
  if (!visible) return null;

  return (
    <>
      <TouchableOpacity style={styles.sortOverlay} activeOpacity={1} onPress={onClose} />
      <View
        style={[
          styles.sortDropdown,
          {
            top: dropdownTop,
            left: dropdownLeft,
            width: dropdownWidth,
          },
        ]}
      >
        <TouchableOpacity style={styles.sortItem} onPress={() => onSelect("priceAsc")}>
          <Text style={[styles.sortItemText, sortOption === "priceAsc" && styles.sortItemTextActive]}>
            По возрастанию цены
          </Text>
        </TouchableOpacity>

        <View style={styles.sortDivider} />

        <TouchableOpacity style={styles.sortItem} onPress={() => onSelect("priceDesc")}>
          <Text style={[styles.sortItemText, sortOption === "priceDesc" && styles.sortItemTextActive]}>
            По убыванию цены
          </Text>
        </TouchableOpacity>

        <View style={styles.sortDivider} />

        <TouchableOpacity style={styles.sortItem} onPress={() => onSelect("mileageDesc")}>
          <Text style={[styles.sortItemText, sortOption === "mileageDesc" && styles.sortItemTextActive]}>
            С большим пробегом
          </Text>
        </TouchableOpacity>

        <View style={styles.sortDivider} />

        <TouchableOpacity style={styles.sortItem} onPress={() => onSelect("mileageAsc")}>
          <Text style={[styles.sortItemText, sortOption === "mileageAsc" && styles.sortItemTextActive]}>
            С меньшим пробегом
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
