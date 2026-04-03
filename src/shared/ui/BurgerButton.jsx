import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export function BurgerButton({ onPress, style, ...rest }) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      style={[styles.burger, style]}
      onPress={onPress}
      {...rest}
    >
      <View style={styles.line} />
      <View style={styles.line} />
      <View style={styles.line} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  burger: {
    width: 28,
    height: 14,
    justifyContent: "space-between",
  },
  line: {
    height: 2,
    borderRadius: 4,
    backgroundColor: "#DB4431",
  },
});
