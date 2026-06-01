import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { formatRub } from "../../autoCredit/lib/autoCreditCalculations";
import type { AiCatalogItem } from "../types";
import { colors } from "../../../shared/theme/colors";
import { radius } from "../../../shared/theme/radius";
import { spacing } from "../../../shared/theme/spacing";
import { figmaText } from "../../../shared/theme/typography";

type Props = {
  car: AiCatalogItem;
  selected: boolean;
  onToggle: () => void;
};

export function AiCarSuggestionCard({ car, selected, onToggle }: Props) {
  const hasDiscount =
    typeof car.priceWas === "number" && car.priceWas > car.priceFrom;

  return (
    <Pressable
      onPress={onToggle}
      style={[styles.card, selected && styles.cardSelected]}
      accessibilityRole="button"
      accessibilityState={{ selected }}
    >
      <Image source={{ uri: car.imageUrl }} style={styles.image} resizeMode="cover" />
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>
          {car.title}
        </Text>
        <Text style={styles.meta}>Новый · {car.year} · цена от</Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>{formatRub(car.priceFrom)}</Text>
          {hasDiscount ? (
            <Text style={styles.oldPrice}>{formatRub(car.priceWas!)}</Text>
          ) : null}
        </View>
        <Text style={styles.badge}>{selected ? "Выбрано ✓" : "Нажмите, чтобы выбрать"}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: colors.surface.muted,
    borderRadius: radius.md,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
  },
  cardSelected: {
    borderColor: colors.brand.primary,
  },
  image: {
    width: 96,
    height: 96,
    backgroundColor: colors.surface.placeholder,
  },
  body: {
    flex: 1,
    padding: spacing.sm,
    gap: 2,
  },
  title: {
    ...figmaText.bodySemibold,
    color: colors.text.primary,
  },
  meta: {
    ...figmaText.caption,
    color: colors.text.muted,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: spacing.sm,
    flexWrap: "wrap",
  },
  price: {
    ...figmaText.bodyBold,
    color: colors.text.primary,
  },
  oldPrice: {
    ...figmaText.caption,
    color: colors.text.muted,
    textDecorationLine: "line-through",
  },
  badge: {
    ...figmaText.caption,
    color: colors.text.accent,
    marginTop: 2,
  },
});
