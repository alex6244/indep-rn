import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { colors } from "../../../shared/theme/colors";
import { radius } from "../../../shared/theme/radius";
import { spacing } from "../../../shared/theme/spacing";

type MarkButtonProps = {
  label: string;
  selected?: boolean;
  onToggle?: () => void;
};

export const MarkButton = ({ label, selected, onToggle }: MarkButtonProps) => {
  const [active, setActive] = useState(false);

  const isControlled = selected !== undefined;
  const isActive = isControlled ? selected : active;

  const bg = isActive ? colors.brand.primary : colors.control.buttonSecondaryBg;
  const color = isActive ? colors.text.inverse : colors.text.primary;

  return (
    <TouchableOpacity
      style={[styles.chip, { backgroundColor: bg }]}
      onPress={() => {
        if (!isControlled) setActive((v) => !v);
        onToggle?.();
      }}
      accessibilityRole="button"
      accessibilityState={{ selected: isActive }}
      accessibilityLabel={label}
    >
      <Text style={[styles.label, { color }]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    minHeight: 44,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.lg,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
  },
});
