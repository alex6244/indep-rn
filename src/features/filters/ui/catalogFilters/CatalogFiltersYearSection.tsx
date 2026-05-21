import React from "react";
import { CatalogFiltersNumericRangeSection } from "./CatalogFiltersNumericRangeSection";
import type { CatalogFiltersRangeFields } from "./catalogFilters.types";
import { onlyDigits } from "./catalogFilters.shared";

type Props = {
  range: CatalogFiltersRangeFields;
};

const formatYear = (text: string) => onlyDigits(text).slice(0, 4);

export function CatalogFiltersYearSection({ range }: Props) {
  return (
    <CatalogFiltersNumericRangeSection
      label="Год выпуска"
      range={range}
      formatFrom={formatYear}
      formatTo={formatYear}
      withReset
    />
  );
}
