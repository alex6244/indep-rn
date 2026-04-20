import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { colors } from "../../../shared/theme/colors";
import { FONT_FAMILY } from "../../../shared/theme/fonts";
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
        <ScrollView
          style={styles.textScroll}
          contentContainerStyle={styles.textScrollContent}
          showsVerticalScrollIndicator={false}
        >
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
        </ScrollView>

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
    borderRadius: spacing.md,
    overflow: "hidden",
    height: 460,
    backgroundColor: colors.surfaceMuted,
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
    justifyContent: "space-between",
  },
  textScroll: {
    flex: 1,
  },
  textScrollContent: {
    paddingBottom: spacing.sm,
    minHeight: 292,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
    lineHeight: 20,
  },
  titleWrap: {
    minHeight: 42,
    marginBottom: 6,
  },
  cardText: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  introWrap: {
    minHeight: 64,
    marginBottom: spacing.sm,
  },
  listTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.textPrimary,
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
    color: colors.textPrimary,
  },
  bulletText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
    color: colors.textPrimary,
  },
  bottom: {
    marginTop: spacing.sm,
  },
  price: {
    fontSize: 34,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  button: {
    marginTop: spacing.sm + 2,
    backgroundColor: colors.brandPrimary,
    borderRadius: spacing.md,
    paddingVertical: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: colors.onDark,
    fontSize: 15,
    fontWeight: "600",
    fontFamily: FONT_FAMILY.button,
  },
});
