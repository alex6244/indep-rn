import type { PaymentType } from "../../../catalog/hooks/useCatalogFiltersController";

export type CatalogFiltersTextField = {
  value: string;
  onChange: (value: string) => void;
};

export type CatalogFiltersRangeFields = {
  from: CatalogFiltersTextField;
  to: CatalogFiltersTextField;
};

export type CatalogFiltersOverlayProps = {
  vehicle: {
    brandQuery: string;
    onChangeBrandQuery: (value: string) => void;
    modelQuery: string;
    onChangeModelQuery: (value: string) => void;
    filteredCount?: number;
  };
  payment: {
    type: PaymentType;
    onChange: (value: PaymentType) => void;
  };
  price: CatalogFiltersRangeFields;
  marks: {
    hasDiscount: boolean;
    onToggleHasDiscount: () => void;
    vatReturn: boolean;
    onToggleVatReturn: () => void;
    weeklyOffer: boolean;
    onToggleWeeklyOffer: () => void;
  };
  year: CatalogFiltersRangeFields;
  mileage: CatalogFiltersRangeFields & { filteredCount?: number };
  tech: {
    bodyType: string | null;
    onChangeBodyType: (value: string | null) => void;
    engineType: string | null;
    onChangeEngineType: (value: string | null) => void;
    transmissionType: string | null;
    onChangeTransmissionType: (value: string | null) => void;
    driveTypeFilter: string | null;
    onChangeDriveTypeFilter: (value: string | null) => void;
  };
  power: CatalogFiltersRangeFields;
  features: {
    selected: string[];
    onToggle: (label: string) => void;
  };
  footer: {
    filteredCount?: number;
    error: string | null;
    onReset: () => void;
    onApply: () => boolean;
    onClose: () => void;
  };
};
