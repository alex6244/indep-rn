import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { colors } from "../../../shared/theme/colors";

type Props = {
  onPress: () => void;
  bottomPadding: number;
  disabled?: boolean;
};

export function BottomNextButton({ onPress, bottomPadding, disabled }: Props) {
  return (
    <TouchableOpacity
      style={[
        styles.wrap,
        { paddingBottom: bottomPadding, opacity: disabled ? 0.6 : 1 },
      ]}
      onPress={onPress}
      activeOpacity={0.9}
      disabled={disabled}
    >
      <Text style={styles.text}>Далее</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.brand.primary,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 16,
  },
  text: {
    color: colors.text.inverse,
    fontSize: 16,
    fontWeight: "600",
  },
});

