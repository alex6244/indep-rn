import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  title: string;
  message: string;
  onRetry?: () => void;
};

export function ScreenStateError({ title, message, onRetry }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry ? (
        <Pressable onPress={onRetry} style={styles.retryBtn}>
          <Text style={styles.retryText}>Повторить</Text>
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
    marginBottom: 6,
  },
  message: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 12,
  },
  retryBtn: {
    backgroundColor: "#DB4431",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  retryText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 13,
  },
});

