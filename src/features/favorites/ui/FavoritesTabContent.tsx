import { type Href, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useFavorites } from "../../../contexts/FavoritesContext";
import { catalogStyles } from "../../catalog/ui/Catalog.styles";
import { CatalogCarsList } from "../../catalog/ui/CatalogCarsList";
import { scrollBottomPaddingBelowTabBar } from "../../../shared/navigation/tabBarMetrics";
import { colors } from "../../../shared/theme/colors";
import { spacing } from "../../../shared/theme/spacing";
import { InlineMessage } from "../../../shared/ui/InlineMessage";
import { ScreenStateEmpty } from "../../../shared/ui/ScreenStateEmpty";
import { ScreenStateLoading } from "../../../shared/ui/ScreenStateLoading";
import type { Car } from "../../../types/car";
import { resolveFavoriteCars } from "../lib/resolveFavoriteCars";
import { ReportsPackageSelectModal } from "../../../widgets/reports/ReportsPackageSelectModal";
import { useReportsPackagePurchaseModal } from "../../../widgets/reports/useReportsPackagePurchaseModal";

type Props = {
  bottomInset: number;
};

export function FavoritesTabContent({ bottomInset }: Props) {
  const router = useRouter();
  const { favoriteIds, isFavorite, setFavorite, loading: favoritesLoading, favoritesError, clearFavoritesError } =
    useFavorites();
  const reportsPackageModal = useReportsPackagePurchaseModal();

  const [cars, setCars] = useState<Car[]>([]);
  const [resolving, setResolving] = useState(false);

  useEffect(() => {
    let active = true;
    setResolving(true);
    void resolveFavoriteCars(favoriteIds).then((resolved) => {
      if (active) setCars(resolved);
    }).finally(() => {
      if (active) setResolving(false);
    });
    return () => {
      active = false;
    };
  }, [favoriteIds]);

  const handleOpenCar = useCallback(
    (carId: string) => {
      router.push(`/auto/${carId}` as Href);
    },
    [router],
  );

  const loading = favoritesLoading || resolving;
  const isEmpty = !loading && favoriteIds.length === 0;

  return (
    <View style={styles.root}>
      {favoritesError ? (
        <View style={styles.noticeWrap}>
          <InlineMessage tone="error" message={favoritesError} />
        </View>
      ) : null}

      {loading ? (
        <ScreenStateLoading message="Загружаем избранное..." />
      ) : isEmpty ? (
        <ScreenStateEmpty
          title="Список избранного пуст"
          subtitle="Добавляйте понравившиеся автомобили в избранное — они будут храниться здесь."
          actionLabel="Перейти в каталог"
          onAction={() => router.push("/(tabs)/catalog" as Href)}
        />
      ) : cars.length === 0 ? (
        <ScreenStateEmpty
          title="Не удалось показать избранное"
          subtitle="Попробуйте обновить список или добавьте автомобили из каталога."
          actionLabel="Перейти в каталог"
          onAction={() => router.push("/(tabs)/catalog" as Href)}
        />
      ) : (
        <CatalogCarsList
          displayedCars={cars}
          isFavorite={isFavorite}
          setFavorite={setFavorite}
          onBuyReport={reportsPackageModal.open}
          onPressCar={handleOpenCar}
          styles={catalogStyles}
          ListHeaderComponent={
            <Text style={styles.headerTitle}>
              {cars.length} {cars.length === 1 ? "автомобиль" : cars.length < 5 ? "автомобиля" : "автомобилей"}
            </Text>
          }
          contentContainerStyle={[
            catalogStyles.content,
            { paddingBottom: scrollBottomPaddingBelowTabBar(bottomInset) },
          ]}
        />
      )}

      <ReportsPackageSelectModal
        visible={reportsPackageModal.visible}
        onClose={reportsPackageModal.close}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  noticeWrap: {
    marginBottom: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text.tertiary,
    marginBottom: spacing.md,
  },
});
