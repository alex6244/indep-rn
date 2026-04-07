import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

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
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E1E1E",
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  actionBtn: {
    marginTop: 12,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "#F3F3F3",
  },
  actionText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1E1E1E",
  },
});

