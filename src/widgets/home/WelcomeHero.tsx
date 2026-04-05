import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HeroIllustration from "../../assets/banners/1.svg";
import Logo from "../../assets/logo.svg";
import { BurgerButton } from "../../shared/ui/BurgerButton";
type Props = {
  onOpenBurger: () => void;
  onOpenCatalog: () => void;
};

export function WelcomeHero({ onOpenBurger, onOpenCatalog }: Props) {
  const { width: screenWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  // Adaptive typography/sizing to avoid truncation/overlap on narrow screens.
  const heroTitleFontSize = screenWidth < 360 ? 24 : 28;
  const heroTitleLineHeight = Math.round(heroTitleFontSize * 1.15);
  const heroArtHeight = Math.round(
    Math.min(280, Math.max(210, screenWidth * 0.72)),
  );

  return (
    <View>
      <View style={[styles.topBar, { paddingTop: insets.top + 6 }]}>
        <Logo width={82} height={22} />
        <BurgerButton onPress={onOpenBurger} hitSlop={8} />
      </View>

      <View style={styles.heroCard}>
        <Text
          style={[
            styles.heroTitle,
            { fontSize: heroTitleFontSize, lineHeight: heroTitleLineHeight },
          ]}
        >
          Честный подбор — спокойная покупка
        </Text>

        <View style={[styles.heroArt, { height: heroArtHeight }]}>
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
  heroCard: {
    backgroundColor: "#F1F1F1",
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
    minHeight: 380,
    justifyContent: "flex-start",
  },
  heroTitle: {
    fontWeight: "500",
    color: "#1E1E1E",
    maxWidth: "92%", // чтобы текст не упирался в края
  },
  heroArt: {
    alignSelf: "center",
    width: "100%",
    marginTop: 8,
  },
  heroButton: {
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#DB4431",
    width: "100%",
    marginTop: "auto",
    paddingVertical: 10,
  },
  heroButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
  },
});
