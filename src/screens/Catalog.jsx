import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SortIcon from "../assets/icons/sort.svg";
import { scrollBottomPaddingBelowTabBar } from "../shared/navigation/tabBarMetrics";
import { useAuth } from "../contexts/AuthContext";
import { useFavorites } from "../contexts/FavoritesContext";
import { cars as catalogCars } from "../data/cars";
import { useCatalogFiltersController } from "../features/catalog/hooks/useCatalogFiltersController";
import { catalogStyles as styles } from "../features/catalog/ui/Catalog.styles";
import { CatalogCarsList } from "../features/catalog/ui/CatalogCarsList";
import { CatalogFooter } from "../features/catalog/ui/CatalogFooter";
import { CatalogSortDropdown } from "../features/catalog/ui/CatalogSortDropdown";
import { CatalogFiltersOverlay } from "../features/filters/ui/CatalogFiltersOverlay";
import {
  getMainBurgerMenuItems,
  MainBurgerMenuFooter,
} from "../shared/config/mainBurgerMenu";
import { BurgerMenu } from "../shared/ui/BurgerMenu";
import { Header } from "../widgets/header/Header";
const { width: SCREEN_WIDTH } = Dimensions.get("window");

const Catalog = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { logout } = useAuth();
  const { isFavorite, setFavorite } = useFavorites();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [sortAnchor, setSortAnchor] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const sortButtonRef = useRef(null);
  const filtersX = useRef(new Animated.Value(-SCREEN_WIDTH)).current;

  const controller = useCatalogFiltersController(catalogCars);

  const openFilters = () => {
    setFiltersOpen(true);
    setSortOpen(false);
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

  const toggleSort = () => {
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
  };

  const SORT_DROPDOWN_MIN_WIDTH = 260;
  const dropdownWidth = Math.max(
    sortAnchor?.width || 0,
    SORT_DROPDOWN_MIN_WIDTH,
  );
  const dropdownLeft = sortAnchor
    ? Math.max(16, Math.min(sortAnchor.x, SCREEN_WIDTH - dropdownWidth - 16))
    : 0;
  const dropdownTop = sortAnchor ? sortAnchor.y + sortAnchor.height + 8 : 0;

  const catalogScrollBottom = scrollBottomPaddingBelowTabBar(insets.bottom);

  return (
    <View style={styles.root}>
      <Header
        title={null}
        showLogo
        onLogoPress={() => router.push("/(tabs)")}
        onOpenBurger={() => setMenuOpen(true)}
        rightAction="favorites"
      />

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: catalogScrollBottom },
        ]}
      >
        <View style={styles.breadcrumbs}>
          <Text style={styles.breadcrumbText}>Главная {">"} Каталог</Text>
        </View>

        <View style={styles.filtersBar}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              ref={sortButtonRef}
              style={styles.sortButton}
              activeOpacity={0.9}
              onPress={toggleSort}
            >
              <SortIcon width={18} height={18} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.allFiltersButton}
              onPress={openFilters}
            >
              <Text style={styles.allFiltersText}>Все фильтры</Text>
            </TouchableOpacity>

            {["от 2023 до 2025 г.", "Со скидками", "Седан"].map((label) => (
              <View key={label} style={styles.filterChip}>
                <Text style={styles.filterChipText}>{label}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <Text style={styles.sectionTitle}>Лучшие предложения</Text>

        <View style={styles.carsGrid}>
          <CatalogCarsList
            displayedCars={controller.displayedCars}
            isFavorite={isFavorite}
            setFavorite={setFavorite}
            styles={styles}
          />
        </View>

        <TouchableOpacity
          style={[styles.btn, styles.btnPrimary, styles.seeAllBtn]}
        >
          <Text style={styles.btnTextPrimary}>Смотреть все</Text>
        </TouchableOpacity>

        <CatalogFooter styles={styles} />
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
};

export default Catalog;
