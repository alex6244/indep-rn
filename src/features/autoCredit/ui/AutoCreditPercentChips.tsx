import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors } from "../../../shared/theme/colors";
import { acText } from "./autoCredit.styles";
import { radius } from "../../../shared/theme/radius";
import { spacing } from "../../../shared/theme/spacing";

type Props = {
  values: readonly number[];
  selected: number;
  onSelect: (value: number) => void;
  formatLabel?: (value: number) => string;
  getAccessibilityLabel?: (value: number) => string;
};

export function AutoCreditPercentChips({
  values,
  selected,
  onSelect,
  formatLabel = (value) => `${value}%`,
  getAccessibilityLabel = (value) => `${value} процентов`,
}: Props) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {values.map((value) => {
        const active = value === selected;
        return (
          <Pressable
            key={value}
            style={[styles.chip, active && styles.chipActive]}
            onPress={() => onSelect(value)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            accessibilityLabel={getAccessibilityLabel(value)}
          >
            <Text style={[styles.chipText, active && styles.chipTextActive]}>
              {formatLabel(value)}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  chip: {
    minWidth: 52,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderRadius: radius.md,
    backgroundColor: colors.surface.muted,
    alignItems: "center",
  },
  chipActive: {
    backgroundColor: colors.brand.primary,
  },
  chipText: {
    ...acText,
    fontSize: 14,
    color: colors.text.primary,
  },
  chipTextActive: {
    color: colors.text.inverse,
  },
});
