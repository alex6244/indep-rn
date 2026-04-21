import React from "react";
import {
  FlatList,
  Image,
  ListRenderItem,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import type { Car } from "../../../types/car";
import { FavoriteButton } from "../../favorites/ui/FavoriteButton";
import { buildCarModelLine, buildCarSpecsLine } from "../utils/buildCarSpecsLine";

type CatalogStyles = typeof import("./Catalog.styles").catalogStyles;

type CatalogCarCardProps = {
  car: Car;
  isFavorite: boolean;
  setFavorite: (carId: string, next: boolean) => void;
  styles: CatalogStyles;
  cardImageWidth: number;
};

type CatalogCarsListProps = {
  displayedCars: Car[];
  isFavorite: (carId: string) => boolean;
  setFavorite: (carId: string, next: boolean) => void;
  styles: CatalogStyles;
};

/** ru-RU форматтер цен: создаётся один раз на модуль, а не при каждом рендере. */
const ruPriceFormat = new Intl.NumberFormat("ru-RU");

function CatalogCarCard({ car, isFavorite, setFavorite, styles, cardImageWidth }: CatalogCarCardProps) {
  const specsLine = buildCarSpecsLine(car);
  const modelLine = buildCarModelLine(car);

  return (
    <View style={styles.carCard}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.carImagesScroll}
        decelerationRate="fast"
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

      <View style={styles.carInfo}>
        <Text style={styles.carPrice}>{ruPriceFormat.format(car.price)} ₽</Text>
        <Text style={styles.carSpecsLine} numberOfLines={2}>
          {specsLine}
        </Text>
        <Text style={styles.carModelLine} numberOfLines={2}>
          {modelLine}
        </Text>
      </View>

      <View style={styles.carButtonsRow}>
        <TouchableOpacity style={[styles.btn, styles.btnPrimary, { flex: 1 }]}>
          <Text style={styles.btnTextPrimary}>Купить отчёт</Text>
        </TouchableOpacity>
        <View style={styles.carFavWrap}>
          <FavoriteButton
            initialActive={isFavorite}
            onChange={(next: boolean) => setFavorite(String(car.id), next)}
          />
        </View>
      </View>

      <View style={styles.carAddressRow}>
        <Feather name="map-pin" size={12} color="#9A9A9A" style={styles.carAddressIcon} />
        <Text style={styles.carAddress}>{car.address}</Text>
      </View>
    </View>
  );
}

const MemoCatalogCarCard = React.memo(CatalogCarCard, (prev, next) =>
  prev.car === next.car &&
  prev.isFavorite === next.isFavorite &&
  prev.setFavorite === next.setFavorite &&
  prev.styles === next.styles &&
  prev.cardImageWidth === next.cardImageWidth,
);

export function CatalogCarsList({ displayedCars, isFavorite, setFavorite, styles }: CatalogCarsListProps) {
  const { width: screenW } = useWindowDimensions();
  /** Экран минус отступы экрана (16×2) и карточки (14×2) — ширина галереи ≈ ширине скролла для paging. */
  const cardImageWidth = screenW - 60;

  if (displayedCars.length === 0) {
    return <Text style={styles.emptyStateText}>Ничего не найдено</Text>;
  }

  const renderItem: ListRenderItem<Car> = ({ item: car }) => (
    <MemoCatalogCarCard
      car={car}
      isFavorite={isFavorite(String(car.id))}
      setFavorite={setFavorite}
      styles={styles}
      cardImageWidth={cardImageWidth}
    />
  );

  return (
    <FlatList
      data={displayedCars}
      keyExtractor={(car) => String(car.id)}
      renderItem={renderItem}
      ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      initialNumToRender={6}
      maxToRenderPerBatch={6}
      windowSize={7}
      removeClippedSubviews
      scrollEnabled={false}
    />
  );
}
