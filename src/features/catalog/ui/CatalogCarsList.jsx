import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { FavoriteButton } from "../../favorites/ui/FavoriteButton";

function CatalogCarCard({ car, isFavorite, setFavorite, styles }) {
  return (
    <View style={styles.carCard}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carImagesScroll}>
        {car.images.map((uri, idx) => (
          <Image key={idx} source={{ uri }} style={styles.carImage} />
        ))}
      </ScrollView>

      <View style={styles.carInfo}>
        <View style={styles.carPriceRow}>
          <Text style={styles.carPrice}>{new Intl.NumberFormat("ru-RU").format(car.price)} ₽</Text>
          <Text style={styles.carMileage}>
            {new Intl.NumberFormat("ru-RU").format(car.mileage)} км
          </Text>
        </View>
        <Text style={styles.carTitle}>{car.title}</Text>
        <Text style={styles.carSub}>
          {car.engine} л ({car.power} л.с.) {car.driveType} - {car.year} г.
        </Text>
      </View>

      <View style={styles.carButtonsRow}>
        <TouchableOpacity style={[styles.btn, styles.btnPrimary, { flex: 1 }]}>
          <Text style={styles.btnTextPrimary}>Купить отчет</Text>
        </TouchableOpacity>
        <FavoriteButton
          initialActive={isFavorite(String(car.id))}
          onChange={(next) => setFavorite(String(car.id), next)}
        />
      </View>

      <Text style={styles.carAddress}>{car.address}</Text>
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
