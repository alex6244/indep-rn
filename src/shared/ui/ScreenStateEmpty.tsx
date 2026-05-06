import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";
import { radius } from "../theme/radius";
import { spacing } from "../theme/spacing";
import { typography } from "../theme/typography";

type Props = {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function ScreenStateEmpty({ title, subtitle, actionLabel, onAction }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {actionLabel && onAction ? (
        <Pressable onPress={onAction} style={styles.actionBtn}>
          <Text style={styles.actionText}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
  },
  title: {
    ...typography.title,
    fontSize: 16,
    color: colors.text.primary,
  },
  subtitle: {
    ...typography.textRegular,
    marginTop: spacing.xs,
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: "center",
  },
  actionBtn: {
    marginTop: spacing.md,
    borderRadius: radius.sm + 2,
    minHeight: 44,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.control.buttonSecondaryBg,
    alignItems: "center",
    justifyContent: "center",
  },
  actionText: {
    ...typography.title,
    fontSize: 13,
    color: colors.control.buttonSecondaryText,
  },
});

