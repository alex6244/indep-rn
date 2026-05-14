import { useCallback, useEffect, useMemo, useState, type Dispatch, type SetStateAction } from "react";
import type { Car } from "../../../types/car";

const YEAR_MIN = 1880;
const YEAR_MAX = new Date().getFullYear();

export type SortOption = "priceAsc" | "priceDesc" | "mileageAsc" | "mileageDesc" | null;
export type PaymentType = "cash" | "credit" | null;

export type CatalogFilterCriteria = {
  brandQuery: string;
  modelQuery: string;
  paymentType: PaymentType;
  priceFrom: number | null;
  priceTo: number | null;
  yearFrom: number | null;
  yearTo: number | null;
  mileageFrom: number | null;
  mileageTo: number | null;
  bodyType: string | null;
  engineType: string | null;
  transmissionType: string | null;
  driveTypeFilter: string | null;
  powerFrom: number | null;
  powerTo: number | null;
  features: string[];
  hasDiscount: boolean;
  vatReturn: boolean;
  weeklyOffer: boolean;
};

export type CatalogFiltersController = {
  displayedCars: Car[];
  filteredCars: Car[];
  sortOption: SortOption;
  setSortOption: Dispatch<SetStateAction<SortOption>>;
  brandQuery: string;
  setBrandQuery: Dispatch<SetStateAction<string>>;
  modelQuery: string;
  setModelQuery: Dispatch<SetStateAction<string>>;
  paymentType: PaymentType;
  setPaymentType: Dispatch<SetStateAction<PaymentType>>;
  priceFromText: string;
  setPriceFromText: Dispatch<SetStateAction<string>>;
  priceToText: string;
  setPriceToText: Dispatch<SetStateAction<string>>;
  yearFromText: string;
  setYearFromText: Dispatch<SetStateAction<string>>;
  yearToText: string;
  setYearToText: Dispatch<SetStateAction<string>>;
  mileageFromText: string;
  setMileageFromText: Dispatch<SetStateAction<string>>;
  mileageToText: string;
  setMileageToText: Dispatch<SetStateAction<string>>;
  bodyType: string | null;
  setBodyType: (v: string | null) => void;
  engineType: string | null;
  setEngineType: (v: string | null) => void;
  transmissionType: string | null;
  setTransmissionType: (v: string | null) => void;
  driveTypeFilter: string | null;
  setDriveTypeFilter: (v: string | null) => void;
  powerFromText: string;
  setPowerFromText: Dispatch<SetStateAction<string>>;
  powerToText: string;
  setPowerToText: Dispatch<SetStateAction<string>>;
  features: string[];
  hasDiscount: boolean;
  setHasDiscount: Dispatch<SetStateAction<boolean>>;
  vatReturn: boolean;
  setVatReturn: Dispatch<SetStateAction<boolean>>;
  weeklyOffer: boolean;
  setWeeklyOffer: Dispatch<SetStateAction<boolean>>;
  error: string | null;
  applyFilters: () => boolean;
  resetFilters: () => void;
  toggleFeature: (label: string) => void;
};

function parseNumberOrNull(text: string): number | null {
  const raw = text ?? "";
  const trimmed = String(raw).trim();
  if (!trimmed) return null;

  const cleaned = trimmed.replace(/\s+/g, "").replace(/[^\d.,-]/g, "").replace(",", ".");
  if (!cleaned) return null;

  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

function matchesCriteria(car: Car, criteria: CatalogFilterCriteria): boolean {
  const norm = (s: unknown) => (s ?? "").toString().trim().toLowerCase();

  const brandNeed = norm(criteria.brandQuery);
  const modelNeed = norm(criteria.modelQuery);

  const brandOk = !brandNeed || norm(car.brand).includes(brandNeed) || norm(car.title).includes(brandNeed);
  const modelOk = !modelNeed || norm(car.title).includes(modelNeed);

  const priceOk =
    (criteria.priceFrom == null || car.price >= criteria.priceFrom) &&
    (criteria.priceTo == null || car.price <= criteria.priceTo);

  const yearOk =
    (criteria.yearFrom == null || car.year >= criteria.yearFrom) &&
    (criteria.yearTo == null || car.year <= criteria.yearTo);

  const mileageOk =
    (criteria.mileageFrom == null || car.mileage >= criteria.mileageFrom) &&
    (criteria.mileageTo == null || car.mileage <= criteria.mileageTo);

  const bodyOk =
    criteria.bodyType == null ||
    (car.bodyType != null && car.bodyType === criteria.bodyType);

  const engineOk =
    criteria.engineType == null ||
    (car.fuelType != null && car.fuelType === criteria.engineType);

  const transmissionOk =
    criteria.transmissionType == null ||
    (car.transmission != null && car.transmission === criteria.transmissionType);

  const driveOk =
    criteria.driveTypeFilter == null ||
    (car.driveType != null && car.driveType === criteria.driveTypeFilter);

  const powerOk =
    (criteria.powerFrom == null || car.power >= criteria.powerFrom) &&
    (criteria.powerTo == null || car.power <= criteria.powerTo);

  const featuresOk =
    criteria.features.length === 0 ||
    (Array.isArray(car.features) && car.features.some((f) => criteria.features.includes(f)));

  const paymentOk =
    criteria.paymentType == null ||
    (car.paymentType != null && car.paymentType === criteria.paymentType);

  const discountOk = criteria.hasDiscount ? car.hasDiscount === true : true;
  const vatOk = criteria.vatReturn ? car.vatReturn === true : true;
  const weeklyOk = criteria.weeklyOffer ? car.weeklyOffer === true : true;

  return (
    brandOk &&
    modelOk &&
    priceOk &&
    yearOk &&
    mileageOk &&
    bodyOk &&
    engineOk &&
    transmissionOk &&
    driveOk &&
    powerOk &&
    featuresOk &&
    paymentOk &&
    discountOk &&
    vatOk &&
    weeklyOk
  );
}

export function useCatalogFiltersController(cars: Car[]): CatalogFiltersController {
  const [filteredCars, setFilteredCars] = useState<Car[]>(cars);
  const [sortOption, setSortOption] = useState<SortOption>(null);

  const [brandQuery, setBrandQuery] = useState("");
  const [modelQuery, setModelQuery] = useState("");
  const [paymentType, setPaymentType] = useState<PaymentType>(null);
  const [priceFromText, setPriceFromText] = useState("");
  const [priceToText, setPriceToText] = useState("");
  const [yearFromText, setYearFromText] = useState("");
  const [yearToText, setYearToText] = useState("");
  const [mileageFromText, setMileageFromText] = useState("");
  const [mileageToText, setMileageToText] = useState("");
  const [bodyType, setBodyType] = useState<string | null>(null);
  const [engineType, setEngineType] = useState<string | null>(null);
  const [transmissionType, setTransmissionType] = useState<string | null>(null);
  const [driveTypeFilter, setDriveTypeFilter] = useState<string | null>(null);
  const [powerFromText, setPowerFromText] = useState("");
  const [powerToText, setPowerToText] = useState("");
  const [features, setFeatures] = useState<string[]>([]);
  const [hasDiscount, setHasDiscount] = useState(false);
  const [vatReturn, setVatReturn] = useState(false);
  const [weeklyOffer, setWeeklyOffer] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFilteredCars(cars);
  }, [cars]);

  const toggleInArray = useCallback((value: string, setArr: Dispatch<SetStateAction<string[]>>) => {
    setArr((prev) => {
      const exists = prev.includes(value);
      return exists ? prev.filter((x) => x !== value) : [...prev, value];
    });
  }, []);

  const applyFilters = useCallback(() => {
    setError(null);

    const priceFrom = parseNumberOrNull(priceFromText);
    const priceTo = parseNumberOrNull(priceToText);
    const yearFrom = parseNumberOrNull(yearFromText);
    const yearTo = parseNumberOrNull(yearToText);
    const mileageFrom = parseNumberOrNull(mileageFromText);
    const mileageTo = parseNumberOrNull(mileageToText);
    const powerFrom = parseNumberOrNull(powerFromText);
    const powerTo = parseNumberOrNull(powerToText);

    if (priceFromText.trim() !== "" && priceFrom == null) {
      setError("Некорректный ввод цены (От).");
      return false;
    }
    if (priceToText.trim() !== "" && priceTo == null) {
      setError("Некорректный ввод цены (До).");
      return false;
    }
    if (yearFromText.trim() !== "" && yearFrom == null) {
      setError("Некорректный ввод года (От).");
      return false;
    }
    if (yearToText.trim() !== "" && yearTo == null) {
      setError("Некорректный ввод года (До).");
      return false;
    }
    if (mileageFromText.trim() !== "" && mileageFrom == null) {
      setError("Некорректный ввод пробега (От).");
      return false;
    }
    if (mileageToText.trim() !== "" && mileageTo == null) {
      setError("Некорректный ввод пробега (До).");
      return false;
    }
    if (powerFromText.trim() !== "" && powerFrom == null) {
      setError("Некорректный ввод мощности (От).");
      return false;
    }
    if (powerToText.trim() !== "" && powerTo == null) {
      setError("Некорректный ввод мощности (До).");
      return false;
    }
    if (powerFrom != null && powerTo != null && powerFrom > powerTo) {
      setError("Мощность (От) не должна быть больше мощности (До).");
      return false;
    }

    if (yearFrom != null && yearFrom < YEAR_MIN) {
      setError(`Год (От) должен быть не меньше ${YEAR_MIN}.`);
      return false;
    }
    if (yearTo != null && yearTo > YEAR_MAX) {
      setError(`Год (До) не должен быть больше ${YEAR_MAX}.`);
      return false;
    }
    if (yearFrom != null && yearTo != null && yearFrom > yearTo) {
      setError("Год (От) не должен быть больше года (До).");
      return false;
    }

    if (mileageFrom != null && mileageTo != null && mileageFrom > mileageTo) {
      setError("Пробег (От) не должен быть больше пробега (До).");
      return false;
    }
    if (priceFrom != null && priceTo != null && priceFrom > priceTo) {
      setError("Цена (От) не должна быть больше цены (До).");
      return false;
    }

    const criteria: CatalogFilterCriteria = {
      brandQuery,
      modelQuery,
      paymentType,
      priceFrom,
      priceTo,
      yearFrom,
      yearTo,
      mileageFrom,
      mileageTo,
      bodyType,
      engineType,
      transmissionType,
      driveTypeFilter,
      powerFrom,
      powerTo,
      features,
      hasDiscount,
      vatReturn,
      weeklyOffer,
    };

    const next = cars.filter((car) => matchesCriteria(car, criteria));
    setFilteredCars(next);
    return true;
  }, [
    cars, brandQuery, modelQuery, paymentType,
    priceFromText, priceToText, yearFromText, yearToText,
    mileageFromText, mileageToText,
    bodyType, engineType, transmissionType, driveTypeFilter,
    powerFromText, powerToText,
    features, hasDiscount, vatReturn, weeklyOffer,
  ]);

  const resetFilters = useCallback(() => {
    setError(null);
    setBrandQuery("");
    setModelQuery("");
    setPaymentType(null);
    setPriceFromText("");
    setPriceToText("");
    setYearFromText("");
    setYearToText("");
    setMileageFromText("");
    setMileageToText("");
    setBodyType(null);
    setEngineType(null);
    setTransmissionType(null);
    setDriveTypeFilter(null);
    setPowerFromText("");
    setPowerToText("");
    setFeatures([]);
    setHasDiscount(false);
    setVatReturn(false);
    setWeeklyOffer(false);
    setFilteredCars(cars);
  }, [cars]);

  const displayedCars = useMemo(() => {
    const next = [...filteredCars];
    if (!sortOption) return next;

    next.sort((a, b) => {
      switch (sortOption) {
        case "priceAsc":
          return a.price - b.price;
        case "priceDesc":
          return b.price - a.price;
        case "mileageAsc":
          return a.mileage - b.mileage;
        case "mileageDesc":
          return b.mileage - a.mileage;
        default:
          return 0;
      }
    });

    return next;
  }, [filteredCars, sortOption]);

  return {
    displayedCars,
    filteredCars,
    sortOption,
    setSortOption,
    brandQuery,
    setBrandQuery,
    modelQuery,
    setModelQuery,
    paymentType,
    setPaymentType,
    priceFromText,
    setPriceFromText,
    priceToText,
    setPriceToText,
    yearFromText,
    setYearFromText,
    yearToText,
    setYearToText,
    mileageFromText,
    setMileageFromText,
    mileageToText,
    setMileageToText,
    bodyType,
    setBodyType,
    engineType,
    setEngineType,
    transmissionType,
    setTransmissionType,
    driveTypeFilter,
    setDriveTypeFilter,
    powerFromText,
    setPowerFromText,
    powerToText,
    setPowerToText,
    features,
    hasDiscount,
    setHasDiscount,
    vatReturn,
    setVatReturn,
    weeklyOffer,
    setWeeklyOffer,
    error,
    applyFilters,
    resetFilters,
    toggleFeature: useCallback((label: string) => toggleInArray(label, setFeatures), [toggleInArray]),
  };
}

