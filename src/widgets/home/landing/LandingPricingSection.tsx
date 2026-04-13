import { Image } from "expo-image";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

import type { landingStyles } from "../../../shared/styles/landing.styles";

type Props = {
  styles: typeof landingStyles;
  onOpenAuto: () => void;
  onBuyReport: () => void;
  onOpenCatalog: () => void;
};

export function LandingPricingSection({ styles, onOpenAuto, onBuyReport, onOpenCatalog }: Props) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Лучшие предложения</Text>
      <View style={styles.carsGrid}>
        <TouchableOpacity style={styles.carCard} onPress={onOpenAuto}>
          <View style={styles.carImagesRow}>
            <Image source={require("../../../assets/cars1.jpg")} style={styles.carImage} contentFit="cover" />
            <Image source={require("../../../assets/cars2.jpg")} style={styles.carImage} contentFit="cover" />
          </View>
          <View style={styles.carInfo}>
            <View style={styles.carPriceRow}>
              <Text style={styles.carPrice}>6 700 000 ₽</Text>
              <Text style={styles.carMileage}>200 000 км</Text>
            </View>
            <Text style={styles.carName}>Mercedes‑Benz GLC AMG 43 AMG II (X254)</Text>
          </View>
          <View style={styles.carButtonsRow}>
            <TouchableOpacity style={styles.primaryButton} onPress={onBuyReport}>
              <Text style={styles.primaryButtonText}>Купить отчёт</Text>
            </TouchableOpacity>
            <View style={styles.favButton}>
              <Text>★</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={[styles.primaryButton, { marginTop: 16 }]} onPress={onOpenCatalog}>
        <Text style={styles.primaryButtonText}>Смотреть все</Text>
      </TouchableOpacity>
    </View>
  );
}

