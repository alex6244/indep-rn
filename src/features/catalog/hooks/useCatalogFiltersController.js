import { useMemo, useState } from "react";

const YEAR_MIN = 1880;
const YEAR_MAX = new Date().getFullYear();

const parseNumberOrNull = (text) => {
  const raw = text ?? "";
  const trimmed = String(raw).trim();
  if (!trimmed) return null;

  const cleaned = trimmed
    .replace(/\s+/g, "")
    .replace(/[^\d.,-]/g, "")
    .replace(",", ".");

  if (!cleaned) return null;

  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
};

const matchesCriteria = (car, criteria) => {
  const norm = (s) => (s ?? "").toString().trim().toLowerCase();

  const brandNeed = norm(criteria.brandQuery);
  const modelNeed = norm(criteria.modelQuery);

  const brandOk =
    !brandNeed ||
    norm(car.brand).includes(brandNeed) ||
    norm(car.title).includes(brandNeed);

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
    criteria.bodyTypes.length === 0 ||
    (car.bodyType && criteria.bodyTypes.includes(car.bodyType));

  const featuresOk =
    criteria.features.length === 0 ||
    (car.features && car.features.some((f) => criteria.features.includes(f)));

  const paymentOk =
    criteria.paymentType == null ||
    (car.paymentType && car.paymentType === criteria.paymentType);

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
    featuresOk &&
    paymentOk &&
    discountOk &&
    vatOk &&
    weeklyOk
  );
};

export function useCatalogFiltersController(cars) {
  const [filteredCars, setFilteredCars] = useState(cars);
  const [sortOption, setSortOption] = useState(null);

  const [brandQuery, setBrandQuery] = useState("");
  const [modelQuery, setModelQuery] = useState("");
  const [paymentType, setPaymentType] = useState(null);
  const [priceFromText, setPriceFromText] = useState("");
  const [priceToText, setPriceToText] = useState("");
  const [yearFromText, setYearFromText] = useState("");
  const [yearToText, setYearToText] = useState("");
  const [mileageFromText, setMileageFromText] = useState("");
  const [mileageToText, setMileageToText] = useState("");
  const [bodyTypes, setBodyTypes] = useState([]);
  const [features, setFeatures] = useState([]);
  const [hasDiscount, setHasDiscount] = useState(false);
  const [vatReturn, setVatReturn] = useState(false);
  const [weeklyOffer, setWeeklyOffer] = useState(false);
  const [error, setError] = useState(null);

  const toggleInArray = (value, setArr) => {
    setArr((prev) => {
      const exists = prev.includes(value);
      return exists ? prev.filter((x) => x !== value) : [...prev, value];
    });
  };

  const applyFilters = () => {
    setError(null);

    const priceFrom = parseNumberOrNull(priceFromText);
    const priceTo = parseNumberOrNull(priceToText);
    const yearFrom = parseNumberOrNull(yearFromText);
    const yearTo = parseNumberOrNull(yearToText);
    const mileageFrom = parseNumberOrNull(mileageFromText);
    const mileageTo = parseNumberOrNull(mileageToText);

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

    const criteria = {
      brandQuery,
      modelQuery,
      paymentType,
      priceFrom,
      priceTo,
      yearFrom,
      yearTo,
      mileageFrom,
      mileageTo,
      bodyTypes,
      features,
      hasDiscount,
      vatReturn,
      weeklyOffer,
    };

    const next = cars.filter((car) => matchesCriteria(car, criteria));
    setFilteredCars(next);
    return true;
  };

  const resetFilters = () => {
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
    setBodyTypes([]);
    setFeatures([]);
    setHasDiscount(false);
    setVatReturn(false);
    setWeeklyOffer(false);
    setFilteredCars(cars);
  };

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
    bodyTypes,
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
    toggleBodyType: (label) => toggleInArray(label, setBodyTypes),
    toggleFeature: (label) => toggleInArray(label, setFeatures),
  };
}
