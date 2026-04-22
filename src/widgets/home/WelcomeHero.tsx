import React from "react";
import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HeroIllustration from "../../assets/banners/1.svg";
import Logo from "../../assets/logo.svg";
import { colors } from "../../shared/theme/colors";
import { radius } from "../../shared/theme/radius";
import { spacing } from "../../shared/theme/spacing";
import { AppButton } from "../../shared/ui/AppButton";
import { BurgerButton } from "../../shared/ui/BurgerButton";

const HERO_RADIUS = radius.lg + 2;
const HERO_HORIZONTAL_PADDING = spacing.xxl;
const HERO_TOP_PADDING = spacing.xxl;
const HERO_BOTTOM_PADDING = spacing.lg + 2;
const HERO_TITLE_BREAKPOINT = 360;
const HERO_TITLE_FONT_SMALL = 26;
const HERO_TITLE_FONT_LARGE = 29;
const HERO_ART_HEIGHT_MIN = 270;
const HERO_ART_HEIGHT_MAX = 360;
const HERO_ART_HEIGHT_FACTOR = 0.9;
const HERO_BUTTON_TOP_MARGIN = 10;
const HERO_BUTTON_BOTTOM_MARGIN = 6;

type Props = {
  onOpenBurger: () => void;
  onOpenCatalog: () => void;
  showTopBar?: boolean;
};

export function WelcomeHero({ onOpenBurger, onOpenCatalog, showTopBar = true }: Props) {
  const { width: screenWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  // Keep hero prominent and resilient across narrow devices.
  const heroTitleFontSize =
    screenWidth < HERO_TITLE_BREAKPOINT ? HERO_TITLE_FONT_SMALL : HERO_TITLE_FONT_LARGE;
  const heroTitleLineHeight = Math.round(heroTitleFontSize * 1.12);
  const heroArtHeight = Math.round(
    Math.min(HERO_ART_HEIGHT_MAX, Math.max(HERO_ART_HEIGHT_MIN, screenWidth * HERO_ART_HEIGHT_FACTOR)),
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
          {"подбор —\nспокойная покупка"}
        </Text>

        <View style={[styles.heroArt, { height: heroArtHeight }]}>
          <HeroIllustration width="100%" height="100%" />
        </View>

        <AppButton
          label="Перейти в каталог авто"
          style={styles.heroButton}
          onPress={onOpenCatalog}
          accessibilityLabel="Перейти в каталог авто"
        />
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
    backgroundColor: colors.surface.muted,
    borderRadius: HERO_RADIUS,
    paddingHorizontal: HERO_HORIZONTAL_PADDING,
    paddingTop: HERO_TOP_PADDING,
    paddingBottom: HERO_BOTTOM_PADDING,
    justifyContent: "flex-start",
  },
  heroTitle: {
    fontWeight: "600",
    color: colors.text.primary,
    maxWidth: "95%",
  },
  heroArt: {
    alignSelf: "center",
    width: "100%",
    marginTop: 16,
  },
  heroButton: {
    width: "100%",
    marginTop: HERO_BUTTON_TOP_MARGIN,
    marginBottom: HERO_BUTTON_BOTTOM_MARGIN,
  },
  heroTitleAccent: {
    color: colors.brand.primary,
  },
});
