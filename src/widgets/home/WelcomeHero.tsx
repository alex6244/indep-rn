import React, { useCallback, useMemo, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  type LayoutChangeEvent,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HeroIllustration from "../../assets/banners/1.svg";
import Logo from "../../assets/logo.svg";
import { colors } from "../../shared/theme/colors";
import { radius } from "../../shared/theme/radius";
import { AppButton } from "../../shared/ui/AppButton";
import { BurgerButton } from "../../shared/ui/BurgerButton";
import {
  scaleFigmaInset,
  type FigmaLayoutSize,
} from "../../shared/utils/scaleFigmaLayout";

/** Макет баннера (Figma / «Баннер 1»), совпадает с viewBox SVG. */
const BANNER_DESIGN: FigmaLayoutSize = { width: 335, height: 385 };
const BANNER_ASPECT = BANNER_DESIGN.width / BANNER_DESIGN.height;

const BANNER_TITLE_TOP = 20;
const BANNER_TITLE_INSET_X = 24;
const BANNER_BUTTON_INSET_X = 24;
const BANNER_BUTTON_INSET_BOTTOM = 14;

const HERO_TITLE_BREAKPOINT = 360;
const HERO_TITLE_FONT_SMALL = 26;
const HERO_TITLE_FONT_LARGE = 29;

type Props = {
  onOpenBurger: () => void;
  onOpenCatalog: () => void;
  showTopBar?: boolean;
};

export function WelcomeHero({ onOpenBurger, onOpenCatalog, showTopBar = true }: Props) {
  const { width: screenWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [bannerLayout, setBannerLayout] = useState<FigmaLayoutSize>({ width: 0, height: 0 });

  const onBannerLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setBannerLayout((prev) =>
      prev.width === width && prev.height === height ? prev : { width, height },
    );
  }, []);

  const heroTitleFontSize =
    screenWidth < HERO_TITLE_BREAKPOINT ? HERO_TITLE_FONT_SMALL : HERO_TITLE_FONT_LARGE;
  const heroTitleLineHeight = Math.round(heroTitleFontSize * 1.12);

  const overlayInsets = useMemo(() => {
    if (bannerLayout.width <= 0) return null;
    return {
      titleTop: scaleFigmaInset(BANNER_TITLE_TOP, bannerLayout, BANNER_DESIGN, "height"),
      titleLeft: scaleFigmaInset(BANNER_TITLE_INSET_X, bannerLayout, BANNER_DESIGN, "width"),
      titleRight: scaleFigmaInset(BANNER_TITLE_INSET_X, bannerLayout, BANNER_DESIGN, "width"),
      buttonLeft: scaleFigmaInset(BANNER_BUTTON_INSET_X, bannerLayout, BANNER_DESIGN, "width"),
      buttonRight: scaleFigmaInset(BANNER_BUTTON_INSET_X, bannerLayout, BANNER_DESIGN, "width"),
      buttonBottom: scaleFigmaInset(
        BANNER_BUTTON_INSET_BOTTOM,
        bannerLayout,
        BANNER_DESIGN,
        "height",
      ),
    };
  }, [bannerLayout]);

  return (
    <View>
      {showTopBar ? (
        <View style={[styles.topBar, { paddingTop: insets.top + 6 }]}>
          <Logo width={82} height={22} />
          <BurgerButton onPress={onOpenBurger} hitSlop={8} />
        </View>
      ) : null}

      <View style={styles.heroBanner} onLayout={onBannerLayout}>
        <View style={styles.heroIllustration} pointerEvents="none">
          <HeroIllustration width="100%" height="100%" />
        </View>

        {overlayInsets ? (
          <>
            <Text
              pointerEvents="none"
              style={[
                styles.heroTitle,
                {
                  fontSize: heroTitleFontSize,
                  lineHeight: heroTitleLineHeight,
                  top: overlayInsets.titleTop,
                  left: overlayInsets.titleLeft,
                  right: overlayInsets.titleRight,
                },
              ]}
            >
              <Text style={styles.heroTitleAccent}>Честный </Text>
              {"подбор —\nспокойная покупка"}
            </Text>

            <View
              style={[
                styles.heroButtonOverlay,
                {
                  left: overlayInsets.buttonLeft,
                  right: overlayInsets.buttonRight,
                  bottom: overlayInsets.buttonBottom,
                },
              ]}
            >
              <AppButton
                label="Перейти в каталог авто"
                style={styles.heroButton}
                onPress={onOpenCatalog}
                accessibilityLabel="Перейти в каталог авто"
              />
            </View>
          </>
        ) : null}
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
  heroBanner: {
    width: "100%",
    aspectRatio: BANNER_ASPECT,
    position: "relative",
    overflow: "hidden",
    borderRadius: radius.md,
  },
  heroIllustration: {
    ...StyleSheet.absoluteFillObject,
  },
  heroTitle: {
    position: "absolute",
    zIndex: 1,
    fontWeight: "600",
    color: colors.text.primary,
  },
  heroButtonOverlay: {
    position: "absolute",
    zIndex: 2,
  },
  heroButton: {
    width: "100%",
  },
  heroTitleAccent: {
    color: colors.brand.primary,
  },
});
