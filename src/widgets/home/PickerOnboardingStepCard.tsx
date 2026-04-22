import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../shared/theme/colors";
import { radius } from "../../shared/theme/radius";
import { spacing } from "../../shared/theme/spacing";

type Props = {
  step: string;
  title: string;
  description: string;
  illustration: React.ReactNode;
};

export function PickerOnboardingStepCard({
  step,
  title,
  description,
  illustration,
}: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.illustrationWrap}>{illustration}</View>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{step}</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48.5%",
  },
  illustrationWrap: {
    height: 124,
    borderRadius: radius.md + 2,
    backgroundColor: colors.surface.muted,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginBottom: spacing.sm + 2,
    padding: spacing.sm + 2,
  },
  badge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.status.warningBg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  badgeText: {
    color: colors.brand.primary,
    fontSize: 13,
    fontWeight: "700",
  },
  title: {
    fontSize: 34 / 2,
    lineHeight: 42 / 2,
    color: colors.text.primary,
    fontWeight: "600",
    marginBottom: spacing.xs + 2,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.text.primary,
  },
});
