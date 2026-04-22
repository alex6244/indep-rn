import React from "react";
import type { Car } from "../../../types/car";
import { Text, TouchableOpacity, View } from "react-native";
import { InlineMessage } from "../../../shared/ui/InlineMessage";
import { ScreenStateEmpty } from "../../../shared/ui/ScreenStateEmpty";
import { ScreenStateError } from "../../../shared/ui/ScreenStateError";
import { ScreenStateLoading } from "../../../shared/ui/ScreenStateLoading";
import { CatalogCarsList } from "./CatalogCarsList";
import { CatalogFooter } from "./CatalogFooter";
import { CatalogFiltersBar } from "./CatalogFiltersBar";

type CatalogStyles = typeof import("./Catalog.styles").catalogStyles;

type CatalogContentSectionProps = {
  styles: CatalogStyles;
  loading: boolean;
  errorTitle?: string;
  error: string | null;
  cars: Car[];
  isFavorite: (carId: string) => boolean;
  setFavorite: (carId: string, next: boolean) => void;
  onRetry: () => void;
  onOpenCallbackRequest: () => void;
  favoritesError?: string | null;
  sortButtonRef: React.RefObject<
    (View & {
      measureInWindow: (callback: (x: number, y: number, width: number, height: number) => void) => void;
    }) | null
  >;
  toggleSort: () => void;
  openFilters: () => void;
  contentPadBottom: number;
};

export function CatalogContentSection({
  styles,
  loading,
  errorTitle,
  error,
  cars,
  isFavorite,
  setFavorite,
  onRetry,
  onOpenCallbackRequest,
  favoritesError,
  sortButtonRef,
  toggleSort,
  openFilters,
  contentPadBottom,
}: CatalogContentSectionProps) {
  const Header = (
    <>
      {favoritesError ? <InlineMessage tone="error" message={favoritesError} /> : null}
      <CatalogFiltersBar
        styles={styles}
        sortButtonRef={sortButtonRef}
        toggleSort={toggleSort}
        openFilters={openFilters}
      />
      <Text style={styles.sectionTitle}>Лучшие предложения</Text>
    </>
  );

  const EmptyState = loading ? (
    <ScreenStateLoading message="Загружаем каталог..." />
  ) : error ? (
    <ScreenStateError
      title={errorTitle || "Не удалось загрузить каталог"}
      message={error}
      onRetry={onRetry}
    />
  ) : (
    <ScreenStateEmpty
      title="Ничего не найдено"
      subtitle="Попробуйте ослабить фильтры или сбросить условия."
      actionLabel="Сбросить фильтры"
      onAction={onRetry}
    />
  );

  const Footer = cars.length > 0 ? (
    <>
      <TouchableOpacity
        style={styles.orderReportBtn}
        onPress={onOpenCallbackRequest}
        accessibilityRole="button"
        accessibilityLabel="Заказать отчёт"
      >
        <Text style={styles.orderReportBtnText}>Заказать отчёт</Text>
      </TouchableOpacity>
      <CatalogFooter styles={styles} />
    </>
  ) : null;

  return (
    <CatalogCarsList
      displayedCars={cars}
      isFavorite={isFavorite}
      setFavorite={setFavorite}
      styles={styles}
      ListHeaderComponent={Header}
      ListEmptyComponent={EmptyState}
      ListFooterComponent={Footer}
      contentContainerStyle={[styles.content, { paddingBottom: contentPadBottom }]}
    />
  );
}
