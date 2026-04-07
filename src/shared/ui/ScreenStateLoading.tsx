import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

type Props = {
  message?: string;
};

export function ScreenStateLoading({ message = "Загрузка..." }: Props) {
  return (
    <View style={styles.wrap}>
      <ActivityIndicator size="small" color="#DB4431" />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
    gap: 10,
  },
  text: {
    color: "#666",
    fontSize: 14,
  },
});

