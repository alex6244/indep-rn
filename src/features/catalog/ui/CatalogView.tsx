import { useRouter, type Href } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import type { View as RNView } from "react-native";
import { Dimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFavorites } from "../../../contexts/FavoritesContext";
import { scrollBottomPaddingBelowTabBar } from "../../../shared/navigation/tabBarMetrics";
import {
  type CatalogFiltersController,
  type SortOption,
} from "../hooks/useCatalogFiltersController";
import { catalogStyles as styles } from "./Catalog.styles";
import { CatalogCallbackRequestModal } from "./CatalogCallbackRequestModal";
import { CatalogContentSection } from "./CatalogContentSection";
import { CatalogHeaderSection } from "./CatalogHeaderSection";
import { CatalogSortDropdown } from "./CatalogSortDropdown";

type SortAnchor = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type MeasureInWindowRef = RNView & {
  measureInWindow: (
    callback: (x: number, y: number, width: number, height: number) => void,
  ) => void;
};

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SORT_DROPDOWN_MIN_WIDTH = 260;

export type CatalogViewProps = {
  loading: boolean;
  dataError: string | null;
  reloadCars: () => void;
  controller: CatalogFiltersController;
  filtersOpen: boolean;
  onOpenBurger: () => void;
  onBuyReport: () => void;
  onOpenFilters: () => void;
  children?: React.ReactNode;
};

export function CatalogView({
  loading,
  dataError,
  reloadCars,
  controller,
  filtersOpen,
  onOpenBurger,
  onBuyReport,
  onOpenFilters,
  children,
}: CatalogViewProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isFavorite, setFavorite, favoritesError, clearFavoritesError } =
    useFavorites();
  const [sortOpen, setSortOpen] = useState(false);
  const [sortAnchor, setSortAnchor] = useState<SortAnchor | null>(null);
  const [callbackModalOpen, setCallbackModalOpen] = useState(false);
  const sortButtonRef = useRef<MeasureInWindowRef | null>(null);

  useEffect(() => {
    return () => {
      clearFavoritesError();
    };
  }, [clearFavoritesError]);

  const openFilters = useCallback((): void => {
    setSortOpen(false);
    onOpenFilters();
  }, [onOpenFilters]);

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

  const dropdownWidth = Math.max(
    sortAnchor?.width || 0,
    SORT_DROPDOWN_MIN_WIDTH,
  );
  const dropdownLeft = sortAnchor
    ? Math.max(16, Math.min(sortAnchor.x, SCREEN_WIDTH - dropdownWidth - 16))
    : 0;
  const dropdownTop = sortAnchor ? sortAnchor.y + sortAnchor.height + 8 : 0;
  const contentError = dataError ?? controller.error;
  const contentErrorTitle = dataError
    ? "Не удалось загрузить каталог"
    : "Не удалось применить фильтры";
  const resetFilters = controller.resetFilters;

  const handleRetry = useCallback((): void => {
    if (dataError) {
      void reloadCars();
      return;
    }
    resetFilters();
  }, [dataError, reloadCars, resetFilters]);

  const handleCallbackSubmit = useCallback(
    async (_payload: { name: string; phone: string }) => {
      // Placeholder for future backend integration.
      await new Promise((resolve) => {
        setTimeout(resolve, 500);
      });
    },
    [],
  );

  const handleLogoPress = useCallback(() => {
    router.push("/(tabs)");
  }, [router]);

  const handleOpenCallbackRequest = useCallback(() => {
    setCallbackModalOpen(true);
  }, []);

  const handleCloseSort = useCallback(() => {
    setSortOpen(false);
  }, []);

  const handleSelectSort = useCallback(
    (next: SortOption) => {
      controller.setSortOption(next);
      setSortOpen(false);
    },
    [controller],
  );

  const handleCloseCallbackModal = useCallback(() => {
    setCallbackModalOpen(false);
  }, []);

  const handleOpenCar = useCallback(
    (carId: string) => {
      router.push(`/auto/${carId}` as Href);
    },
    [router],
  );

  return (
    <View style={styles.root}>
      <CatalogHeaderSection
        styles={styles}
        onLogoPress={handleLogoPress}
        onOpenBurger={onOpenBurger}
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
        onOpenCallbackRequest={handleOpenCallbackRequest}
        onBuyReport={onBuyReport}
        onPressCar={handleOpenCar}
        activeFiltersCount={controller.activeFiltersCount}
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
        onClose={handleCloseSort}
        onSelect={handleSelectSort}
        styles={styles}
      />

      <CatalogCallbackRequestModal
        visible={callbackModalOpen}
        onClose={handleCloseCallbackModal}
        onSubmit={handleCallbackSubmit}
      />

      {children}
    </View>
  );
}
