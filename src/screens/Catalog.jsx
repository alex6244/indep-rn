import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useFavorites } from "../contexts/FavoritesContext";
import { cars as catalogCars } from "../data/cars";
import { FavoriteButton } from "../features/favorites/ui/FavoriteButton";
import { Header } from "../widgets/header/Header";
import { CatalogFiltersOverlay } from "../features/filters/ui/CatalogFiltersOverlay";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const YEAR_MIN = 1880;
const YEAR_MAX = new Date().getFullYear();

const Catalog = ({ navigation }) => {
  const { isFavorite, setFavorite } = useFavorites();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filtersX = useRef(new Animated.Value(-SCREEN_WIDTH)).current;
  const [cars] = useState(catalogCars);
  const [filteredCars, setFilteredCars] = useState(catalogCars);

  // Filter criteria (controlled inputs).
  const [brandQuery, setBrandQuery] = useState("");
  const [modelQuery, setModelQuery] = useState("");
  const [paymentType, setPaymentType] = useState(null); // 'cash' | 'credit' | null

  const [priceFromText, setPriceFromText] = useState("");
  const [priceToText, setPriceToText] = useState("");
  const [yearFromText, setYearFromText] = useState("");
  const [yearToText, setYearToText] = useState("");
  const [mileageFromText, setMileageFromText] = useState("");
  const [mileageToText, setMileageToText] = useState("");

  const [bodyTypes, setBodyTypes] = useState([]); // string[]
  const [features, setFeatures] = useState([]); // string[]

  const [hasDiscount, setHasDiscount] = useState(false);
  const [vatReturn, setVatReturn] = useState(false);
  const [weeklyOffer, setWeeklyOffer] = useState(false);

  const [error, setError] = useState(null);

  const openFilters = () => {
    setFiltersOpen(true);
    Animated.timing(filtersX, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeFilters = () => {
    Animated.timing(filtersX, {
      toValue: -SCREEN_WIDTH,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setFiltersOpen(false));
  };

  const parseNumberOrNull = (text) => {
    const raw = text ?? "";
    const trimmed = String(raw).trim();
    if (!trimmed) return null;

    // Remove spaces and any non-number chars (currency, ₽, etc).
    // Allow "." or "," as decimal separator.
    const cleaned = trimmed
      .replace(/\s+/g, "")
      .replace(/[^\d.,-]/g, "")
      .replace(",", ".");

    if (!cleaned) return null;

    const n = Number(cleaned);
    return Number.isFinite(n) ? n : null;
  };

  const toggleInArray = (value, setArr) => {
    setArr((prev) => {
      const exists = prev.includes(value);
      return exists ? prev.filter((x) => x !== value) : [...prev, value];
    });
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

    // Intersection: at least one selected feature must match.
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

  const applyFilters = () => {
    setError(null);

    const priceFrom = parseNumberOrNull(priceFromText);
    const priceTo = parseNumberOrNull(priceToText);
    const yearFrom = parseNumberOrNull(yearFromText);
    const yearTo = parseNumberOrNull(yearToText);
    const mileageFrom = parseNumberOrNull(mileageFromText);
    const mileageTo = parseNumberOrNull(mileageToText);

    // Error handling: if user entered non-empty but parsing failed -> show error.
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

  return (
    <View style={styles.root}>
      <Header title="Каталог" />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Хлебные крошки */}
        <View style={styles.breadcrumbs}>
          <Text style={styles.breadcrumbText}>Главная {">"} Каталог</Text>
        </View>

        {/* Полоса фильтров над списком */}
        <View style={styles.filtersBar}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {/* сортировка */}
            <View style={styles.sortButton}>
              <Text style={styles.sortIcon}>⇅</Text>
            </View>

            {/* кнопка "Все фильтры" */}
            <TouchableOpacity
              style={styles.allFiltersButton}
              onPress={openFilters}
            >
              <Text style={styles.allFiltersText}>Все фильтры</Text>
            </TouchableOpacity>

            {/* активные фильтры – просто чипы */}
            {["от 2023 до 2025 г.", "Со скидками", "Седан"].map((label) => (
              <View key={label} style={styles.filterChip}>
                <Text style={styles.filterChipText}>{label}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Заголовок списка */}
        <Text style={styles.sectionTitle}>Лучшие предложения</Text>

        {/* Список машин */}
        <View style={styles.carsGrid}>
          {filteredCars.length === 0 ? (
            <Text style={styles.emptyStateText}>Ничего не найдено</Text>
          ) : (
            filteredCars.map((car) => (
              <View key={car.id} style={styles.carCard}>
                {/* Карусель фоток (простая прокрутка) */}
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.carImagesScroll}
                >
                  {car.images.map((uri, idx) => (
                    <Image key={idx} source={{ uri }} style={styles.carImage} />
                  ))}
                </ScrollView>

                {/* Инфо по машине */}
                <View style={styles.carInfo}>
                  <View style={styles.carPriceRow}>
                    <Text style={styles.carPrice}>
                      {new Intl.NumberFormat("ru-RU").format(car.price)} ₽
                    </Text>
                    <Text style={styles.carMileage}>
                      {new Intl.NumberFormat("ru-RU").format(car.mileage)} км
                    </Text>
                  </View>
                  <Text style={styles.carTitle}>{car.title}</Text>
                  <Text style={styles.carSub}>
                    {car.engine} л ({car.power} л.с.) {car.driveType} -{" "}
                    {car.year} г.
                  </Text>
                </View>

                {/* Кнопки */}
                <View style={styles.carButtonsRow}>
                  <TouchableOpacity
                    style={[styles.btn, styles.btnPrimary, { flex: 1 }]}
                  >
                    <Text style={styles.btnTextPrimary}>Купить отчет</Text>
                  </TouchableOpacity>
                  <FavoriteButton
                    initialActive={isFavorite(String(car.id))}
                    onChange={(next) => setFavorite(String(car.id), next)}
                  />
                </View>

                <Text style={styles.carAddress}>{car.address}</Text>
              </View>
            ))
          )}
        </View>

        {/* CTA "Смотреть все" */}
        <TouchableOpacity
          style={[styles.btn, styles.btnPrimary, styles.seeAllBtn]}
        >
          <Text style={styles.btnTextPrimary}>Смотреть все</Text>
        </TouchableOpacity>

        {/* Простой футер */}
        <View style={styles.footer}>
          <Text style={styles.footerLogo}>INDEP</Text>
          <View style={styles.footerLinks}>
            <Text style={styles.footerLink}>Каталог</Text>
            <Text style={styles.footerLink}>Подбор авто</Text>
            <Text style={styles.footerLink}>Сотрудничество</Text>
            <Text style={styles.footerLink}>О нас</Text>
          </View>
          <Text style={styles.footerCopyright}>
            Все права защищены. ООО EXAMPLE.
          </Text>
        </View>
      </ScrollView>

      {/* Панель фильтров поверх всего */}
      {filtersOpen && (
        <View style={styles.filtersOverlay} pointerEvents="box-none">
          <TouchableOpacity
            style={styles.filtersBackdrop}
            activeOpacity={1}
            onPress={closeFilters}
          />
          <Animated.View
            style={[
              styles.filtersPanel,
              { transform: [{ translateX: filtersX }] },
            ]}
          >
            <CatalogFiltersOverlay
              brandQuery={brandQuery}
              onChangeBrandQuery={setBrandQuery}
              modelQuery={modelQuery}
              onChangeModelQuery={setModelQuery}
              paymentType={paymentType}
              onChangePaymentType={setPaymentType}
              priceFromText={priceFromText}
              onChangePriceFromText={setPriceFromText}
              priceToText={priceToText}
              onChangePriceToText={setPriceToText}
              yearFromText={yearFromText}
              onChangeYearFromText={setYearFromText}
              yearToText={yearToText}
              onChangeYearToText={setYearToText}
              mileageFromText={mileageFromText}
              onChangeMileageFromText={setMileageFromText}
              mileageToText={mileageToText}
              onChangeMileageToText={setMileageToText}
              hasDiscount={hasDiscount}
              onToggleHasDiscount={() => setHasDiscount((v) => !v)}
              vatReturn={vatReturn}
              onToggleVatReturn={() => setVatReturn((v) => !v)}
              weeklyOffer={weeklyOffer}
              onToggleWeeklyOffer={() => setWeeklyOffer((v) => !v)}
              bodyTypes={bodyTypes}
              onToggleBodyType={(label) => toggleInArray(label, setBodyTypes)}
              features={features}
              onToggleFeature={(label) => toggleInArray(label, setFeatures)}
              filteredCount={filteredCars.length}
              error={error}
              onReset={resetFilters}
              onApply={applyFilters}
              onClose={closeFilters}
            />
          </Animated.View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    padding: 16,
    paddingBottom: 140,
  },
  breadcrumbs: {
    marginBottom: 12,
  },
  breadcrumbText: {
    fontSize: 12,
    color: "#979797",
  },
  filtersBar: {
    marginBottom: 16,
  },
  sortButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F7F7F7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  sortIcon: {
    fontSize: 18,
    color: "#080717",
  },
  allFiltersButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#DB4431",
    marginRight: 8,
  },
  allFiltersText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "#F7F7F7",
    marginRight: 8,
  },
  filterChipText: {
    fontSize: 12,
    color: "#807E7E",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
  },
  carsGrid: {
    gap: 12,
  },
  carCard: {
    backgroundColor: "#F7F7F7",
    borderRadius: 16,
    padding: 12,
  },
  carImagesScroll: {
    marginBottom: 10,
  },
  carImage: {
    width: 220,
    height: 140,
    borderRadius: 16,
    marginRight: 8,
  },
  carInfo: {
    marginBottom: 8,
  },
  carPriceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  carPrice: {
    fontSize: 20,
    fontWeight: "600",
  },
  carMileage: {
    fontSize: 10,
    color: "#FFFFFF",
    backgroundColor: "#DB4431",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  carTitle: {
    fontSize: 12,
    opacity: 0.8,
  },
  carSub: {
    fontSize: 12,
    color: "#808080",
  },
  carButtonsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  carAddress: {
    fontSize: 10,
    marginTop: 6,
  },
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  btnPrimary: {
    backgroundColor: "#DB4431",
  },
  btnDark: {
    backgroundColor: "#080717",
  },
  btnTextPrimary: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
  seeAllBtn: {
    marginTop: 16,
  },
  footer: {
    marginTop: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#DEDEDE",
  },
  footerLogo: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  footerLinks: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 8,
  },
  footerLink: {
    fontSize: 12,
    textDecorationLine: "underline",
  },
  footerCopyright: {
    fontSize: 10,
    color: "#888",
  },
  bottomArea: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#F7F7F7",
  },
  bottomCtaWrapper: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  filtersOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-start",
  },
  filtersBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  filtersPanel: {
    position: "absolute",
    top: 0,
    left: 0,
    width: SCREEN_WIDTH,
    backgroundColor: "#FFFFFF",
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    overflow: "visible",
    bottom: 0,
  },
  filtersContent: {
    padding: 16,
    paddingBottom: 16,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    marginBottom: 12,
  },
  backBtnText: {
    color: "#DB4431",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 8,
  },
  filtersTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
  },
  filterBlock: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 8,
  },
  input: {
    borderRadius: 8,
    backgroundColor: "#F8F8F8",
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: "#000",
    marginBottom: 8,
  },
  inputsRow: {
    flexDirection: "row",
    gap: 8,
  },
  inputHalf: {
    flex: 1,
  },
  marksRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  filtersBottom: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
    backgroundColor: "#FFFFFF",
  },
  filtersFound: {
    fontSize: 12,
    color: "#979797",
    textAlign: "center",
    marginBottom: 8,
  },
  filtersError: {
    fontSize: 12,
    color: "#DB4431",
    textAlign: "center",
    marginBottom: 8,
  },
  emptyStateText: {
    color: "#979797",
    fontSize: 14,
    textAlign: "center",
    paddingVertical: 24,
  },
  filtersButtonsRow: {
    flexDirection: "row",
    gap: 8,
  },
  filtersBtnHalf: {
    flex: 1,
  },
});

export default Catalog;
