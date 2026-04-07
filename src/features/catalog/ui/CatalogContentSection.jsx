import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ScreenStateEmpty } from "../../../shared/ui/ScreenStateEmpty";
import { ScreenStateError } from "../../../shared/ui/ScreenStateError";
import { ScreenStateLoading } from "../../../shared/ui/ScreenStateLoading";
import { CatalogCarsList } from "./CatalogCarsList";
import { CatalogFooter } from "./CatalogFooter";

export function CatalogContentSection({
  styles,
  loading,
  error,
  cars,
  isFavorite,
  setFavorite,
  onRetry,
}) {
  return (
    <>
      <Text style={styles.sectionTitle}>Лучшие предложения</Text>
      {loading ? (
        <ScreenStateLoading message="Загружаем каталог..." />
      ) : error ? (
        <ScreenStateError
          title="Не удалось применить фильтры"
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
          <TouchableOpacity style={[styles.btn, styles.btnPrimary, styles.seeAllBtn]}>
            <Text style={styles.btnTextPrimary}>Смотреть все</Text>
          </TouchableOpacity>
          <CatalogFooter styles={styles} />
        </>
      )}
    </>
  );
}

