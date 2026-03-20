import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import HeroIllustration from "../../assets/banners/1.svg";
import Logo from "../../assets/logo.svg";

type Props = {
  onOpenBurger: () => void;
  onOpenCatalog: () => void;
};

export function WelcomeHero({ onOpenBurger, onOpenCatalog }: Props) {
  return (
    <View>
      <View style={styles.topBar}>
        <Logo width={82} height={22} />
        <TouchableOpacity
          style={styles.burgerButton}
          onPress={onOpenBurger}
          accessibilityRole="button"
        >
          <View style={styles.burgerLine} />
          <View style={styles.burgerLine} />
          <View style={styles.burgerLine} />
        </TouchableOpacity>
      </View>

      <View style={styles.heroCard}>
        <Text style={styles.heroTitle}>Честный подбор — спокойная покупка</Text>
        <View style={styles.heroArt}>
          <HeroIllustration width="100%" height="100%" />
        </View>
        <TouchableOpacity style={styles.heroButton} onPress={onOpenCatalog}>
          <Text style={styles.heroButtonText}>Перейти в каталог авто</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  burgerButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  burgerLine: {
    width: 22,
    height: 2,
    borderRadius: 2,
    backgroundColor: "#DB4431",
    marginVertical: 2,
  },
  heroCard: {
    backgroundColor: "#F1F1F1",
    borderRadius: 16,
    // чтобы позиционирование top/left работало предсказуемо
    position: "relative",
    // высота карточки должна вместить title + banner + button
    minHeight: 380,
  },
  heroTitle: {
    width: 290,
    height: 64,
    marginTop: 40, // top 40
    marginLeft: 23, // left 23
    fontSize: 28,
    lineHeight: 32,
    fontWeight: "500",
    // если шрифт подключен, используем его:
    fontFamily: "Moderustic",
    color: "#1E1E1E",
  },
  heroArt: {
    width: 279,
    height: 277,
    marginTop: 108, // top 108
    marginBottom: 28, // bottom 28
    alignSelf: "center",
  },
  heroButton: {
    width: 285,
    height: 38,
    marginTop: 324, // top 324
    marginLeft: 25, // left 25
    borderRadius: 12,
    paddingLeft: 10,
    paddingRight: 10,
    // paddingVertical по макету не задан, чтобы попасть в fixed height
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#DB4431",
  },
  heroButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
  },
});
