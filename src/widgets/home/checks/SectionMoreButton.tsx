import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

import { colors } from "../../../shared/theme/colors";
import { radius } from "../../../shared/theme/radius";
import { spacing } from "../../../shared/theme/spacing";

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
    marginTop: spacing.lg,
    width: 160,
    minHeight: 44,
    borderRadius: radius.lg,
    backgroundColor: colors.brand.dark,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
  },
  moreButtonText: {
    color: colors.text.inverse,
    fontSize: 14,
    fontWeight: "600",
  },
});
