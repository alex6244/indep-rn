import React from "react";
import { ScrollView, View } from "react-native";
import { CarSearchFiltersBottomPanel } from "./CarSearchFiltersBottomPanel";
import { CatalogFiltersFeaturesSection } from "./catalogFilters/CatalogFiltersFeaturesSection";
import { CatalogFiltersHeader } from "./catalogFilters/CatalogFiltersHeader";
import { CatalogFiltersMarksSection } from "./catalogFilters/CatalogFiltersMarksSection";
import { CatalogFiltersMileageSection } from "./catalogFilters/CatalogFiltersMileageSection";
import { CatalogFiltersNumericRangeSection } from "./catalogFilters/CatalogFiltersNumericRangeSection";
import { CatalogFiltersPaymentSection } from "./catalogFilters/CatalogFiltersPaymentSection";
import { CatalogFiltersPowerSection } from "./catalogFilters/CatalogFiltersPowerSection";
import { CatalogFiltersTechSection } from "./catalogFilters/CatalogFiltersTechSection";
import { CatalogFiltersVehicleSection } from "./catalogFilters/CatalogFiltersVehicleSection";
import { CatalogFiltersYearSection } from "./catalogFilters/CatalogFiltersYearSection";
import { catalogFilterStyles as styles } from "./catalogFilters/catalogFilters.styles";
import type { CatalogFiltersOverlayProps } from "./catalogFilters/catalogFilters.types";

export type { CatalogFiltersOverlayProps } from "./catalogFilters/catalogFilters.types";
export { buildCatalogFiltersOverlayProps } from "./catalogFilters/buildCatalogFiltersOverlayProps";

export function CatalogFiltersOverlay({
  vehicle,
  payment,
  price,
  marks,
  year,
  mileage,
  tech,
  power,
  features,
  footer,
}: CatalogFiltersOverlayProps) {
  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <CatalogFiltersHeader onClose={footer.onClose} />
        <CatalogFiltersVehicleSection {...vehicle} />
        <CatalogFiltersPaymentSection {...payment} />
        <CatalogFiltersNumericRangeSection label="Цена, ₽" range={price} />
        <CatalogFiltersMarksSection {...marks} />
        <CatalogFiltersYearSection range={year} />
        <CatalogFiltersMileageSection {...mileage} />
        <CatalogFiltersTechSection {...tech} />
        <CatalogFiltersPowerSection range={power} />
        <CatalogFiltersFeaturesSection {...features} />
      </ScrollView>

      <CarSearchFiltersBottomPanel
        filteredCount={footer.filteredCount}
        error={footer.error}
        onReset={footer.onReset}
        onApply={footer.onApply}
        onClose={footer.onClose}
      />
    </View>
  );
}
