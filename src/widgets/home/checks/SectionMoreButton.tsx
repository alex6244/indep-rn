import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

import { colors } from "../../../shared/theme/colors";

type Props = {
  label?: string;
  onPress?: () => void;
};

export function SectionMoreButton({ label = "Смотреть еще", onPress }: Props) {
  return (
    <TouchableOpacity
      style={styles.moreButton}
      activeOpacity={0.85}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Text style={styles.moreButtonText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  moreButton: {
    marginTop: 16,
    width: 160,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.buttonDark,
    alignItems: "center",
    justifyContent: "center",
  },
  moreButtonText: {
    color: colors.onDark,
    fontSize: 14,
    fontWeight: "600",
  },
});
