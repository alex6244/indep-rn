import type { CatalogFiltersController } from "../../../catalog/hooks/useCatalogFiltersController";
import type { CatalogFiltersOverlayProps } from "./catalogFilters.types";

export function buildCatalogFiltersOverlayProps(
  controller: CatalogFiltersController,
  onClose: () => void,
): CatalogFiltersOverlayProps {
  return {
    vehicle: {
      brandQuery: controller.brandQuery,
      onChangeBrandQuery: controller.setBrandQuery,
      modelQuery: controller.modelQuery,
      onChangeModelQuery: controller.setModelQuery,
      filteredCount: controller.filteredCars.length,
    },
    payment: {
      type: controller.paymentType,
      onChange: controller.setPaymentType,
    },
    price: {
      from: { value: controller.priceFromText, onChange: controller.setPriceFromText },
      to: { value: controller.priceToText, onChange: controller.setPriceToText },
    },
    marks: {
      hasDiscount: controller.hasDiscount,
      onToggleHasDiscount: () => controller.setHasDiscount((v) => !v),
      vatReturn: controller.vatReturn,
      onToggleVatReturn: () => controller.setVatReturn((v) => !v),
      weeklyOffer: controller.weeklyOffer,
      onToggleWeeklyOffer: () => controller.setWeeklyOffer((v) => !v),
    },
    year: {
      from: { value: controller.yearFromText, onChange: controller.setYearFromText },
      to: { value: controller.yearToText, onChange: controller.setYearToText },
    },
    mileage: {
      from: { value: controller.mileageFromText, onChange: controller.setMileageFromText },
      to: { value: controller.mileageToText, onChange: controller.setMileageToText },
      filteredCount: controller.filteredCars.length,
    },
    tech: {
      bodyType: controller.bodyType,
      onChangeBodyType: controller.setBodyType,
      engineType: controller.engineType,
      onChangeEngineType: controller.setEngineType,
      transmissionType: controller.transmissionType,
      onChangeTransmissionType: controller.setTransmissionType,
      driveTypeFilter: controller.driveTypeFilter,
      onChangeDriveTypeFilter: controller.setDriveTypeFilter,
    },
    power: {
      from: { value: controller.powerFromText, onChange: controller.setPowerFromText },
      to: { value: controller.powerToText, onChange: controller.setPowerToText },
    },
    features: {
      selected: controller.features,
      onToggle: controller.toggleFeature,
    },
    footer: {
      filteredCount: controller.filteredCars.length,
      error: controller.error,
      onReset: controller.resetFilters,
      onApply: controller.applyFilters,
      onClose,
    },
  };
}
