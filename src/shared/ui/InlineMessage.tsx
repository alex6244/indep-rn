import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";
import { radius } from "../theme/radius";
import { spacing } from "../theme/spacing";

type Tone = "success" | "warning" | "error" | "info";

type Props = {
  tone: Tone;
  message: string;
};

const toneStyles: Record<Tone, { bg: string; fg: string }> = {
  success: { bg: colors.status.successBg, fg: colors.text.success },
  warning: { bg: colors.status.warningBg, fg: colors.status.warning },
  error: { bg: colors.status.warningBg, fg: colors.text.warning },
  info: { bg: colors.overlay.soft, fg: colors.status.info },
};

export function InlineMessage({ tone, message }: Props) {
  const colors = toneStyles[tone];
  return (
    <View
      style={[styles.wrap, { backgroundColor: colors.bg }]}
      accessibilityRole={tone === "error" || tone === "warning" ? "alert" : undefined}
    >
      <Text style={[styles.text, { color: colors.fg }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radius.sm + 2,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  text: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
  },
});

