import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { colors } from "../../../shared/theme/colors";
import { FONT_FAMILY } from "../../../shared/theme/fonts";
import { radius } from "../../../shared/theme/radius";
import { spacing } from "../../../shared/theme/spacing";
import type { PricingPlan } from "./pricingPlans.data";

type Props = {
  plan: PricingPlan;
  width: number;
  onOrderPress: () => void;
};

export function PricingCard({ plan, width, onOrderPress }: Props) {
  const Bg = plan.Bg;

  return (
    <View style={[styles.card, { width }]}>
      <View style={[styles.cardBg, { pointerEvents: "none" }]}>
        <Bg width="100%" height="100%" preserveAspectRatio="none" />
      </View>

      <View style={styles.cardContent}>
        <View style={styles.textContent}>
          <View style={styles.titleWrap}>
            <Text style={styles.cardTitle}>{plan.title}</Text>
          </View>
          <View style={styles.introWrap}>
            <Text style={styles.cardText}>{plan.intro}</Text>
          </View>
          <View style={styles.listTitleWrap}>
            <Text style={styles.listTitle}>{plan.listTitle}</Text>
          </View>
          <View style={styles.bullets}>
            {plan.bullets.map((text, i) => (
              <View key={`${plan.id}-b-${i}`} style={styles.bulletRow}>
                <Text style={styles.bulletMark}>•</Text>
                <Text style={styles.bulletText}>{text}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.bottom}>
          <Text style={styles.price}>{plan.price}</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={onOrderPress}
            accessibilityRole="button"
            accessibilityLabel={`Заказать услугу: ${plan.title}`}
          >
            <Text style={styles.buttonText}>Заказать</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.sm,
    overflow: "hidden",
    minHeight: 490,
    backgroundColor: colors.surface.muted,
    position: "relative",
  },
  cardBg: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  cardContent: {
    flex: 1,
    padding: 12,
    position: "relative",
    zIndex: 1,
  },
  textContent: {
    flexGrow: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text.primary,
    lineHeight: 20,
  },
  titleWrap: {
    minHeight: 42,
    marginBottom: 6,
  },
  cardText: {
    fontSize: 15,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  introWrap: {
    minHeight: 64,
    marginBottom: spacing.sm,
  },
  listTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text.primary,
    lineHeight: 20,
  },
  listTitleWrap: {
    minHeight: 24,
    marginBottom: spacing.sm,
  },
  bullets: {
    gap: spacing.sm,
  },
  bulletRow: {
    flexDirection: "row",
  },
  bulletMark: {
    width: spacing.lg,
    fontSize: 15,
    lineHeight: 20,
    color: colors.text.primary,
  },
  bulletText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
    color: colors.text.primary,
  },
  bottom: {
    marginTop: "auto",
    paddingTop: spacing.sm,
  },
  price: {
    fontSize: 34,
    fontWeight: "800",
    color: colors.text.primary,
  },
  button: {
    marginTop: spacing.sm,
    backgroundColor: colors.brand.primary,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    minHeight: 44,
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: colors.text.inverse,
    fontSize: 12,
    lineHeight: 15,
    fontWeight: "600",
    fontFamily: FONT_FAMILY.regular,
  },
});
