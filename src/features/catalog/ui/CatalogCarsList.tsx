import React, { useCallback, useState } from "react";
import {
  FlatList,
  ListRenderItem,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleProp,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  ViewStyle,
  View,
} from "react-native";
import { Image } from "expo-image";
import type { Car } from "../../../types/car";
import { FavoriteButton } from "../../favorites/ui/FavoriteButton";
import { buildCarModelLine, buildCarSpecsLine } from "../utils/buildCarSpecsLine";
import { colors } from "../../../shared/theme/colors";

type CatalogStyles = typeof import("./Catalog.styles").catalogStyles;

type CatalogCarCardProps = {
  car: Car;
  isFavorite: boolean;
  setFavorite: (carId: string, next: boolean) => void;
  onBuyReport?: () => void;
  onPressCar?: (carId: string) => void;
  styles: CatalogStyles;
  cardImageWidth: number;
};

type CatalogCarsListProps = {
  displayedCars: Car[];
  isFavorite: (carId: string) => boolean;
  setFavorite: (carId: string, next: boolean) => void;
  onBuyReport?: () => void;
  onPressCar?: (carId: string) => void;
  styles: CatalogStyles;
  ListHeaderComponent?: React.ComponentType<unknown> | React.ReactElement | null;
  ListFooterComponent?: React.ComponentType<unknown> | React.ReactElement | null;
  ListEmptyComponent?: React.ComponentType<unknown> | React.ReactElement | null;
  contentContainerStyle?: StyleProp<ViewStyle>;
};

/** ru-RU форматтер цен: создаётся один раз на модуль, а не при каждом рендере. */
const ruPriceFormat = new Intl.NumberFormat("ru-RU");

function CatalogCarCard({
  car,
  isFavorite,
  setFavorite,
  onBuyReport,
  onPressCar,
  styles,
  cardImageWidth,
}: CatalogCarCardProps) {
  const specsLine = buildCarSpecsLine(car);
  const modelLine = buildCarModelLine(car);
  const imageCount = car.images.length;
  const [photoIndex, setPhotoIndex] = useState(0);

  const handleImageScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (imageCount <= 1) return;
    const index = Math.round(event.nativeEvent.contentOffset.x / cardImageWidth);
    const clamped = Math.max(0, Math.min(index, imageCount - 1));
    setPhotoIndex(clamped);
  };

  return (
    <View style={styles.carCard}>
      <Pressable
        onPress={() => onPressCar?.(String(car.id))}
        accessibilityRole="button"
        accessibilityLabel={`Открыть ${car.title}`}
      >
        <View style={styles.carGalleryWrap}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.carImagesScroll}
            decelerationRate="fast"
            snapToInterval={cardImageWidth}
            onScroll={handleImageScroll}
            scrollEventThrottle={16}
            contentContainerStyle={styles.carImagesScrollContent}
          >
            {car.images.map((uri, idx) => (
              <Image
                key={uri}
                source={{ uri }}
                style={[
                  styles.carImage,
                  { width: cardImageWidth },
                  idx === car.images.length - 1 && styles.carImageLast,
                ]}
                accessibilityLabel={`Фото ${idx + 1} из ${car.images.length}`}
              />
            ))}
          </ScrollView>
          {imageCount > 1 ? (
            <View style={styles.photoBadge}>
              <Text style={styles.photoBadgeText}>
                {photoIndex + 1}/{imageCount}
              </Text>
            </View>
          ) : null}
        </View>

        <View style={styles.carInfo}>
          <Text style={styles.carPrice}>{ruPriceFormat.format(car.price)} ₽</Text>
          <Text style={styles.carSpecsLine} numberOfLines={2}>
            {specsLine}
          </Text>
          <Text style={styles.carModelLine} numberOfLines={2}>
            {modelLine}
          </Text>
        </View>
      </Pressable>

      <View style={styles.carButtonsRow}>
        <TouchableOpacity
          style={[styles.btn, styles.btnPrimary, { flex: 1 }]}
          onPress={onBuyReport}
          accessibilityRole="button"
          accessibilityLabel="Купить отчёт"
        >
          <Text style={styles.btnTextPrimary}>Купить отчёт</Text>
        </TouchableOpacity>
        <View style={styles.carFavWrap}>
          <FavoriteButton
            initialActive={isFavorite}
            onChange={(next: boolean) => setFavorite(String(car.id), next)}
          />
        </View>
      </View>
    </View>
  );
}

const MemoCatalogCarCard = React.memo(CatalogCarCard, (prev, next) =>
  prev.car === next.car &&
  prev.isFavorite === next.isFavorite &&
  prev.setFavorite === next.setFavorite &&
  prev.onBuyReport === next.onBuyReport &&
  prev.onPressCar === next.onPressCar &&
  prev.styles === next.styles &&
  prev.cardImageWidth === next.cardImageWidth,
);

export function CatalogCarsList({
  displayedCars,
  isFavorite,
  setFavorite,
  onBuyReport,
  onPressCar,
  styles,
  ListHeaderComponent,
  ListFooterComponent,
  ListEmptyComponent,
  contentContainerStyle,
}: CatalogCarsListProps) {
  const { width: screenW } = useWindowDimensions();
  /** Экран минус отступы экрана (16×2) и карточки (14×2) — ширина галереи ≈ ширине скролла для paging. */
  const cardImageWidth = screenW - 60;

  const renderItem = useCallback<ListRenderItem<Car>>(
    ({ item: car }) => (
      <MemoCatalogCarCard
        car={car}
        isFavorite={isFavorite(String(car.id))}
        setFavorite={setFavorite}
        onBuyReport={onBuyReport}
        onPressCar={onPressCar}
        styles={styles}
        cardImageWidth={cardImageWidth}
      />
    ),
    [cardImageWidth, isFavorite, onBuyReport, onPressCar, setFavorite, styles],
  );
  const keyExtractor = useCallback((car: Car) => String(car.id), []);
  const ItemSeparatorComponent = useCallback(() => <View style={{ height: 12 }} />, []);

  return (
    <FlatList
      data={displayedCars}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      ItemSeparatorComponent={ItemSeparatorComponent}
      initialNumToRender={8}
      maxToRenderPerBatch={5}
      windowSize={5}
      removeClippedSubviews
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={ListFooterComponent}
      ListEmptyComponent={ListEmptyComponent}
      contentContainerStyle={contentContainerStyle}
    />
  );
}
