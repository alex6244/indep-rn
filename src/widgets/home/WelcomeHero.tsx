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
import { colors } from "../../shared/theme/colors";
import { BurgerButton } from "../../shared/ui/BurgerButton";
type Props = {
  onOpenBurger: () => void;
  onOpenCatalog: () => void;
  showTopBar?: boolean;
};

export function WelcomeHero({ onOpenBurger, onOpenCatalog, showTopBar = true }: Props) {
  const { width: screenWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  // Keep hero compact on mobile while preserving readability.
  const heroTitleFontSize = screenWidth < 360 ? 23 : 25;
  const heroTitleLineHeight = Math.round(heroTitleFontSize * 1.15);
  const heroArtHeight = Math.round(
    Math.min(280, Math.max(220, screenWidth * 0.7)),
  );

  return (
    <View>
      {showTopBar ? (
        <View style={[styles.topBar, { paddingTop: insets.top + 6 }]}>
          <Logo width={82} height={22} />
          <BurgerButton onPress={onOpenBurger} hitSlop={8} />
        </View>
      ) : null}

      <View style={styles.heroCard}>
        <Text
          style={[
            styles.heroTitle,
            { fontSize: heroTitleFontSize, lineHeight: heroTitleLineHeight },
          ]}
        >
          <Text style={styles.heroTitleAccent}>Честный </Text>
          подбор — спокойная покупка
        </Text>

        <View style={[styles.heroArt, { height: heroArtHeight }]}>
          <HeroIllustration width="100%" height="100%" />
        </View>

        <TouchableOpacity
          style={styles.heroButton}
          onPress={onOpenCatalog}
          accessibilityRole="button"
          accessibilityLabel="Перейти в каталог авто"
        >
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
    backgroundColor: colors.surfaceMuted,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 0,
    justifyContent: "flex-start",
  },
  heroTitle: {
    fontWeight: "500",
    color: colors.textPrimary,
    maxWidth: "90%",
  },
  heroArt: {
    alignSelf: "center",
    width: "100%",
    marginTop: 10,
  },
  heroButton: {
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.brandPrimary,
    width: "100%",
    marginTop: -46,
    marginBottom: 28,
    paddingVertical: 10,
  },
  heroButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.onDark,
  },
  heroTitleAccent: {
    color: colors.brandPrimary,
  },
});
