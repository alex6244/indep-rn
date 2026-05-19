import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FONT_FAMILY } from "../../shared/theme/fonts";
import { colors } from "../../shared/theme/colors";
import { radius } from "../../shared/theme/radius";
import { spacing } from "../../shared/theme/spacing";

type Props = {
  onCreateReport: () => void;
};

export function PickerReportsEmptyState({ onCreateReport }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Отчётов пока нет</Text>
      <Text style={styles.subtitle}>
        Создайте первый отчёт по автомобилю — он появится в этом разделе.
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={onCreateReport}
        accessibilityRole="button"
        accessibilityLabel="Создать отчёт"
      >
        <Text style={styles.buttonText}>Создать отчёт</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: FONT_FAMILY.regular,
    color: colors.text.primary,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: FONT_FAMILY.regular,
    color: colors.text.subtle,
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  button: {
    minHeight: 48,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
    backgroundColor: colors.brand.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "600",
    fontFamily: FONT_FAMILY.regular,
    color: colors.text.inverse,
  },
});
