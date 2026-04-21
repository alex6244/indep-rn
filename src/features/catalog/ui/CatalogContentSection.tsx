import React from "react";
import type { Car } from "../../../types/car";
import { Text, TouchableOpacity, View } from "react-native";
import { ScreenStateEmpty } from "../../../shared/ui/ScreenStateEmpty";
import { ScreenStateError } from "../../../shared/ui/ScreenStateError";
import { ScreenStateLoading } from "../../../shared/ui/ScreenStateLoading";
import { CatalogCarsList } from "./CatalogCarsList";
import { CatalogFooter } from "./CatalogFooter";

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
}: CatalogContentSectionProps) {
  return (
    <>
      <Text style={styles.sectionTitle}>Лучшие предложения</Text>
      {loading ? (
        <ScreenStateLoading message="Загружаем каталог..." />
      ) : error ? (
        <ScreenStateError
          title={errorTitle || "Не удалось загрузить каталог"}
          message={error}
          onRetry={onRetry}
        />
      ) : cars.length === 0 ? (
        <ScreenStateEmpty
          title="Ничего не найдено"
          subtitle="Попробуйте ослабить фильтры или сбросить условия."
          actionLabel="Сбросить фильтры"
          onAction={onRetry}
        />
      ) : (
        <>
          <View style={styles.carsGrid}>
            <CatalogCarsList
              displayedCars={cars}
              isFavorite={isFavorite}
              setFavorite={setFavorite}
              styles={styles}
            />
          </View>
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
      )}
    </>
  );
}
