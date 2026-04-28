import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import BestIcon from "../../assets/profile/best.svg";
import FavouriteBanner from "../../assets/profile/favouritebanner.svg";
import { colors } from "../../shared/theme/colors";
import { radius } from "../../shared/theme/radius";
import { spacing } from "../../shared/theme/spacing";

type Props = {
  onOpenFavorites: () => void;
  onOpenBest: () => void;
  variant?: "picker" | "client";
};

export function ProfileQuickActions({
  onOpenFavorites,
  onOpenBest,
  variant: _variant = "client",
}: Props) {
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
        style={styles.card}
        onPress={onOpenBest}
        accessibilityRole="button"
        accessibilityLabel="Лучшие предложения на авто"
      >
        <View style={[styles.bestCardInner, { pointerEvents: "none" }]}>
          <Text style={styles.bestText} numberOfLines={3}>
            Лучшие предложения на авто
          </Text>
          <View style={styles.bestIconCorner}>
            <BestIcon width={58} height={48} />
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
    minHeight: 72,
    borderRadius: radius.md,
    overflow: "hidden",
    backgroundColor: colors.surface.primary,
  },
  bestCardInner: {
    flex: 1,
    minHeight: 72,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    paddingRight: spacing.sm,
    position: "relative",
    justifyContent: "flex-start",
  },
  bestText: {
    fontSize: 12,
    color: colors.text.muted,
    fontWeight: "600",
    lineHeight: 16,
    maxWidth: "78%",
  },
  bestIconCorner: {
    position: "absolute",
    right: 4,
    bottom: 6,
  },
});
