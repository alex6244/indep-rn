import React from "react";
import { CatalogFiltersNumericRangeSection } from "./CatalogFiltersNumericRangeSection";
import type { CatalogFiltersRangeFields } from "./catalogFilters.types";

type Props = {
  range: CatalogFiltersRangeFields;
};

export function CatalogFiltersPowerSection({ range }: Props) {
  return (
    <CatalogFiltersNumericRangeSection
      label="Мощность, л.с."
      range={range}
      fromPlaceholder="49 л.с."
      toPlaceholder="898 л.с."
      withReset
    />
  );
}
