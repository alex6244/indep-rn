import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import BestIcon from "../../assets/profile/best.svg";
import FavouriteBanner from "../../assets/profile/favouritebanner.svg";
import { colors } from "../../shared/theme/colors";
import { radius } from "../../shared/theme/radius";
import { spacing } from "../../shared/theme/spacing";

const BEST_ICON_WIDTH = Math.round(58 * 1.5);
const BEST_ICON_HEIGHT = Math.round(48 * 1.5);

const BEST_OFFERS_LINE_1 = "Лучшие предложения";
const BEST_OFFERS_LINE_2 = "на авто";
const BEST_OFFERS_A11Y = `${BEST_OFFERS_LINE_1} ${BEST_OFFERS_LINE_2}`;

type Props = {
  onOpenFavorites: () => void;
  onOpenBest: () => void;
};

export function ProfileQuickActions({ onOpenFavorites, onOpenBest }: Props) {
  return (
    <View style={styles.quickRow}>
      <TouchableOpacity
        style={styles.card}
        onPress={onOpenFavorites}
        accessibilityRole="button"
        accessibilityLabel="Избранное"
      >
        <FavouriteBanner
          style={StyleSheet.absoluteFillObject}
          width="100%"
          height="100%"
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.card, styles.bestCard]}
        onPress={onOpenBest}
        accessibilityRole="button"
        accessibilityLabel={BEST_OFFERS_A11Y}
      >
        <View style={styles.bestCardInner} pointerEvents="none">
          <View style={styles.bestTextBlock}>
            <Text
              style={styles.bestText}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.72}
            >
              {BEST_OFFERS_LINE_1}
            </Text>
            <Text style={styles.bestText}>{BEST_OFFERS_LINE_2}</Text>
          </View>
          <View style={styles.bestIconCorner}>
            <BestIcon width={BEST_ICON_WIDTH} height={BEST_ICON_HEIGHT} />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  quickRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
    marginHorizontal: spacing.lg,
  },
  card: {
    flex: 1,
    minHeight: 62,
    borderRadius: radius.md,
    overflow: "hidden",
    backgroundColor: colors.surface.primary,
  },
  bestCard: {
    minHeight: 76,
  },
  bestCardInner: {
    flex: 1,
    minHeight: 76,
    position: "relative",
  },
  bestTextBlock: {
    position: "absolute",
    left: spacing.md,
    top: spacing.sm,
    right: 28,
    zIndex: 1,
  },
  bestText: {
    fontSize: 12,
    color: colors.text.muted,
    fontWeight: "400",
    lineHeight: 16,
    width: "100%",
  },
  bestIconCorner: {
    position: "absolute",
    right: 2,
    bottom: -16,
  },
});
