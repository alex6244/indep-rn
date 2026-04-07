import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Tone = "success" | "warning" | "error" | "info";

type Props = {
  tone: Tone;
  message: string;
};

const toneStyles: Record<Tone, { bg: string; fg: string }> = {
  success: { bg: "#EAF7EE", fg: "#2E7D32" },
  warning: { bg: "#FFF8E1", fg: "#8C6D1F" },
  error: { bg: "#FFEDEE", fg: "#B42318" },
  info: { bg: "#EEF4FF", fg: "#1D4ED8" },
};

export function InlineMessage({ tone, message }: Props) {
  const colors = toneStyles[tone];
  return (
    <View style={[styles.wrap, { backgroundColor: colors.bg }]}>
      <Text style={[styles.text, { color: colors.fg }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  text: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
  },
});

