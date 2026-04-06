import React from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { FavoriteButton } from "../../favorites/ui/FavoriteButton";
import {
  buildCarModelLine,
  buildCarSpecsLine,
} from "../utils/buildCarSpecsLine";

const SCREEN_W = Dimensions.get("window").width;
/** Экран минус отступы экрана (16×2) и карточки (14×2) — ширина галереи ≈ ширине скролла для paging. */
const CARD_IMAGE_WIDTH = SCREEN_W - 60;

function CatalogCarCard({ car, isFavorite, setFavorite, styles }) {
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
            key={idx}
            source={{ uri }}
            style={[
              styles.carImage,
              { width: CARD_IMAGE_WIDTH },
              idx === car.images.length - 1 && styles.carImageLast,
            ]}
            accessibilityLabel={`Фото ${idx + 1} из ${car.images.length}`}
          />
        ))}
      </ScrollView>

      <View style={styles.carInfo}>
        <Text style={styles.carPrice}>
          {new Intl.NumberFormat("ru-RU").format(car.price)} ₽
        </Text>
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
            initialActive={isFavorite(String(car.id))}
            onChange={(next) => setFavorite(String(car.id), next)}
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

export function CatalogCarsList({ displayedCars, isFavorite, setFavorite, styles }) {
  if (displayedCars.length === 0) {
    return <Text style={styles.emptyStateText}>Ничего не найдено</Text>;
  }

  return displayedCars.map((car) => (
    <CatalogCarCard
      key={car.id}
      car={car}
      isFavorite={isFavorite}
      setFavorite={setFavorite}
      styles={styles}
    />
  ));
}
