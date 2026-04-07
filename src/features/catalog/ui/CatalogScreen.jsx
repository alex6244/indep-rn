import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Animated, Dimensions, ScrollView, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../../contexts/AuthContext";
import { useFavorites } from "../../../contexts/FavoritesContext";
import { useCatalogFiltersController } from "../hooks/useCatalogFiltersController";
import { scrollBottomPaddingBelowTabBar } from "../../../shared/navigation/tabBarMetrics";
import { getMainBurgerMenuItems, MainBurgerMenuFooter } from "../../../shared/config/mainBurgerMenu";
import { BurgerMenu } from "../../../shared/ui/BurgerMenu";
import { CatalogSortDropdown } from "./CatalogSortDropdown";
import { CatalogFiltersOverlay } from "../../filters/ui/CatalogFiltersOverlay";
import { catalogStyles as styles } from "./Catalog.styles";
import { CatalogHeaderSection } from "./CatalogHeaderSection";
import { CatalogFiltersBar } from "./CatalogFiltersBar";
import { CatalogContentSection } from "./CatalogContentSection";
import { carService } from "../../../services/carService";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function CatalogScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { logout } = useAuth();
  const { isFavorite, setFavorite } = useFavorites();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [sortAnchor, setSortAnchor] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataError, setDataError] = useState(null);
  const sortButtonRef = useRef(null);
  const filtersX = useRef(new Animated.Value(-SCREEN_WIDTH)).current;
  const controller = useCatalogFiltersController(cars);

  const loadCars = useCallback(async () => {
    setLoading(true);
    setDataError(null);
    try {
      const fetchedCars = await carService.getAll();
      setCars(Array.isArray(fetchedCars) ? fetchedCars : []);
    } catch {
      setDataError("Не удалось загрузить каталог. Проверьте подключение и попробуйте снова.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCars();
  }, [loadCars]);

  const openFilters = () => {
    setFiltersOpen(true);
    setSortOpen(false);
    Animated.timing(filtersX, { toValue: 0, duration: 300, useNativeDriver: true }).start();
  };

  const closeFilters = () => {
    Animated.timing(filtersX, { toValue: -SCREEN_WIDTH, duration: 300, useNativeDriver: true }).start(
      () => setFiltersOpen(false),
    );
  };

  const toggleSort = () => {
    if (filtersOpen) return;
    if (sortOpen) return setSortOpen(false);
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
  };

  const SORT_DROPDOWN_MIN_WIDTH = 260;
  const dropdownWidth = Math.max(sortAnchor?.width || 0, SORT_DROPDOWN_MIN_WIDTH);
  const dropdownLeft = sortAnchor
    ? Math.max(16, Math.min(sortAnchor.x, SCREEN_WIDTH - dropdownWidth - 16))
    : 0;
  const dropdownTop = sortAnchor ? sortAnchor.y + sortAnchor.height + 8 : 0;
  const contentError = dataError ?? controller.error;
  const handleRetry = () => {
    if (dataError) {
      void loadCars();
      return;
    }
    controller.resetFilters();
  };

  return (
    <View style={styles.root}>
      <CatalogHeaderSection
        styles={styles}
        onLogoPress={() => router.push("/(tabs)")}
        onOpenBurger={() => setMenuOpen(true)}
      />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: scrollBottomPaddingBelowTabBar(insets.bottom) },
        ]}
      >
        <CatalogFiltersBar
          styles={styles}
          sortButtonRef={sortButtonRef}
          toggleSort={toggleSort}
          openFilters={openFilters}
        />
        <CatalogContentSection
          styles={styles}
          loading={loading}
          error={contentError}
          cars={controller.displayedCars}
          isFavorite={isFavorite}
          setFavorite={setFavorite}
          onRetry={handleRetry}
        />
      </ScrollView>

      <CatalogSortDropdown
        visible={sortOpen && !filtersOpen}
        sortOption={controller.sortOption}
        dropdownTop={dropdownTop}
        dropdownLeft={dropdownLeft}
        dropdownWidth={dropdownWidth}
        onClose={() => setSortOpen(false)}
        onSelect={(next) => {
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

      <BurgerMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        items={getMainBurgerMenuItems()}
        footer={<MainBurgerMenuFooter onLogout={logout} />}
      />
    </View>
  );
}

