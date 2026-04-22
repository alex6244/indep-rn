import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Animated, Dimensions, TouchableOpacity, View } from "react-native";
import type { View as RNView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../../contexts/AuthContext";
import { useFavorites } from "../../../contexts/FavoritesContext";
import type { Car } from "../../../types/car";
import { useCatalogFiltersController, type SortOption } from "../hooks/useCatalogFiltersController";
import { scrollBottomPaddingBelowTabBar } from "../../../shared/navigation/tabBarMetrics";
import { getMainBurgerMenuItems, MainBurgerMenuFooter } from "../../../shared/config/mainBurgerMenu";
import { BurgerMenu } from "../../../shared/ui/BurgerMenu";
import { CatalogSortDropdown } from "./CatalogSortDropdown";
import { CatalogFiltersOverlay } from "../../filters/ui/CatalogFiltersOverlay";
import { catalogStyles as styles } from "./Catalog.styles";
import { CatalogHeaderSection } from "./CatalogHeaderSection";
import { CatalogContentSection } from "./CatalogContentSection";
import { CatalogCallbackRequestModal } from "./CatalogCallbackRequestModal";
import { carService } from "../../../services/carService";
import { createRequestVersionTracker } from "../../../shared/async/requestVersion";

type SortAnchor = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type MeasureInWindowRef = RNView & {
  measureInWindow: (callback: (x: number, y: number, width: number, height: number) => void) => void;
};

const { width: SCREEN_WIDTH } = Dimensions.get("window");
/** Минимальная ширина dropdown сортировки — достаточна, чтобы вместить все варианты без переноса. */
const SORT_DROPDOWN_MIN_WIDTH = 260;

export default function CatalogScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { logout } = useAuth();
  const { isFavorite, setFavorite, favoritesError, clearFavoritesError } = useFavorites();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [sortAnchor, setSortAnchor] = useState<SortAnchor | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [callbackModalOpen, setCallbackModalOpen] = useState(false);
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);
  const loadRequestTrackerRef = useRef(createRequestVersionTracker());
  const sortButtonRef = useRef<MeasureInWindowRef | null>(null);
  const filtersX = useRef<Animated.Value>(new Animated.Value(-SCREEN_WIDTH)).current;
  const controller = useCatalogFiltersController(cars);

  const loadCars = useCallback(async (signal?: AbortSignal): Promise<void> => {
    const requestId = loadRequestTrackerRef.current.next();
    setLoading(true);
    setDataError(null);
    try {
      const fetchedCars = await carService.getAll(undefined, signal);
      if (signal?.aborted || !loadRequestTrackerRef.current.isActive(requestId)) return;
      setCars(Array.isArray(fetchedCars) ? fetchedCars : []);
    } catch (error) {
      if (signal?.aborted || !loadRequestTrackerRef.current.isActive(requestId)) return;
      const message =
        error instanceof Error
          ? error.message
          : "Не удалось загрузить каталог. Проверьте подключение и попробуйте снова.";
      setDataError(message);
    } finally {
      if (!signal?.aborted && loadRequestTrackerRef.current.isActive(requestId)) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    void loadCars(abortController.signal);
    return () => abortController.abort();
  }, [loadCars]);

  useEffect(() => {
    return () => {
      clearFavoritesError();
    };
  }, [clearFavoritesError]);

  const openFilters = useCallback((): void => {
    setFiltersOpen(true);
    setSortOpen(false);
    Animated.timing(filtersX, { toValue: 0, duration: 300, useNativeDriver: true }).start();
  }, [filtersX]);

  const closeFilters = useCallback((): void => {
    Animated.timing(filtersX, { toValue: -SCREEN_WIDTH, duration: 300, useNativeDriver: true }).start(
      () => setFiltersOpen(false),
    );
  }, [filtersX]);

  const toggleSort = useCallback((): void => {
    if (filtersOpen) return;
    if (sortOpen) {
      setSortOpen(false);
      return;
    }
    const node = sortButtonRef.current;
    if (node && typeof node.measureInWindow === "function") {
      node.measureInWindow((x, y, width, height) => {
        setSortAnchor({ x, y, width, height });
        setSortOpen(true);
      });
      return;
    }
    setSortAnchor(null);
    setSortOpen(true);
  }, [filtersOpen, sortOpen]);

  const dropdownWidth = Math.max(sortAnchor?.width || 0, SORT_DROPDOWN_MIN_WIDTH);
  const dropdownLeft = sortAnchor
    ? Math.max(16, Math.min(sortAnchor.x, SCREEN_WIDTH - dropdownWidth - 16))
    : 0;
  const dropdownTop = sortAnchor ? sortAnchor.y + sortAnchor.height + 8 : 0;
  const contentError = dataError ?? controller.error;
  const contentErrorTitle = dataError ? "Не удалось загрузить каталог" : "Не удалось применить фильтры";
  const resetFilters = controller.resetFilters;

  const handleRetry = useCallback((): void => {
    if (dataError) {
      void loadCars();
      return;
    }
    resetFilters();
  }, [dataError, loadCars, resetFilters]);

  const handleCallbackSubmit = useCallback(async (_payload: { name: string; phone: string }) => {
    // Placeholder for future backend integration.
    await new Promise((resolve) => {
      setTimeout(resolve, 500);
    });
  }, []);

  return (
    <View style={styles.root}>
      <CatalogHeaderSection
        styles={styles}
        onLogoPress={() => router.push("/(tabs)")}
        onOpenBurger={() => setMenuOpen(true)}
      />
      <CatalogContentSection
        styles={styles}
        loading={loading}
        errorTitle={contentErrorTitle}
        error={contentError}
        cars={controller.displayedCars}
        isFavorite={isFavorite}
        setFavorite={setFavorite}
        onRetry={handleRetry}
        onOpenCallbackRequest={() => setCallbackModalOpen(true)}
        favoritesError={favoritesError}
        sortButtonRef={sortButtonRef}
        toggleSort={toggleSort}
        openFilters={openFilters}
        contentPadBottom={scrollBottomPaddingBelowTabBar(insets.bottom)}
      />

      <CatalogSortDropdown
        visible={sortOpen && !filtersOpen}
        sortOption={controller.sortOption}
        dropdownTop={dropdownTop}
        dropdownLeft={dropdownLeft}
        dropdownWidth={dropdownWidth}
        onClose={() => setSortOpen(false)}
        onSelect={(next: SortOption) => {
          controller.setSortOption(next);
          setSortOpen(false);
        }}
        styles={styles}
      />

      {filtersOpen && (
        <View style={[styles.filtersOverlay, { pointerEvents: "box-none" }]}>
          <TouchableOpacity style={styles.filtersBackdrop} activeOpacity={1} onPress={closeFilters} />
          <Animated.View style={[styles.filtersPanel, { transform: [{ translateX: filtersX }] }]}>
            <CatalogFiltersOverlay
              brandQuery={controller.brandQuery}
              onChangeBrandQuery={controller.setBrandQuery}
              modelQuery={controller.modelQuery}
              onChangeModelQuery={controller.setModelQuery}
              paymentType={controller.paymentType}
              onChangePaymentType={controller.setPaymentType}
              priceFromText={controller.priceFromText}
              onChangePriceFromText={controller.setPriceFromText}
              priceToText={controller.priceToText}
              onChangePriceToText={controller.setPriceToText}
              yearFromText={controller.yearFromText}
              onChangeYearFromText={controller.setYearFromText}
              yearToText={controller.yearToText}
              onChangeYearToText={controller.setYearToText}
              mileageFromText={controller.mileageFromText}
              onChangeMileageFromText={controller.setMileageFromText}
              mileageToText={controller.mileageToText}
              onChangeMileageToText={controller.setMileageToText}
              hasDiscount={controller.hasDiscount}
              onToggleHasDiscount={() => controller.setHasDiscount((v) => !v)}
              vatReturn={controller.vatReturn}
              onToggleVatReturn={() => controller.setVatReturn((v) => !v)}
              weeklyOffer={controller.weeklyOffer}
              onToggleWeeklyOffer={() => controller.setWeeklyOffer((v) => !v)}
              bodyTypes={controller.bodyTypes}
              onToggleBodyType={controller.toggleBodyType}
              features={controller.features}
              onToggleFeature={controller.toggleFeature}
              filteredCount={controller.filteredCars.length}
              error={controller.error}
              onReset={controller.resetFilters}
              onApply={controller.applyFilters}
              onClose={closeFilters}
            />
          </Animated.View>
        </View>
      )}

      <CatalogCallbackRequestModal
        visible={callbackModalOpen}
        onClose={() => setCallbackModalOpen(false)}
        onSubmit={handleCallbackSubmit}
      />

      <BurgerMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        items={getMainBurgerMenuItems()}
        footer={<MainBurgerMenuFooter onLogout={logout} />}
      />
    </View>
  );
}

