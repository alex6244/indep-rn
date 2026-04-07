import React from "react";
import { ImageBackground, Text, TouchableOpacity, View } from "react-native";

type Props = {
  styles: any;
  onOpenCatalog: () => void;
};

export function LandingHeroSection({ styles, onOpenCatalog }: Props) {
  return (
    <View style={styles.heroContainer}>
      <ImageBackground
        source={require("../../../assets/chat/bg.jpg")}
        style={styles.heroBackground}
        imageStyle={styles.heroBackgroundImage}
      >
        <View style={styles.heroOverlay}>
          <Text style={styles.heroTitle}>
            <Text style={styles.heroTitleAccent}>Честный </Text>
            подбор — спокойная покупка
          </Text>
          <Text style={styles.heroSubtitle}>
            Подберём автомобиль без скрытых проблем и переплат. Проверяем технику, историю и
            документы.
          </Text>
          <TouchableOpacity style={styles.primaryButton} onPress={onOpenCatalog}>
            <Text style={styles.primaryButtonText}>Перейти в каталог авто</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}

