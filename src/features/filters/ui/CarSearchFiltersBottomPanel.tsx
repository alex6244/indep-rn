import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../../../shared/theme/colors";
import { radius } from "../../../shared/theme/radius";
import { spacing } from "../../../shared/theme/spacing";

type CarSearchFiltersBottomPanelProps = {
  filteredCount?: number;
  error?: string | null;
  onReset?: () => void;
  onApply?: () => boolean;
  onClose?: () => void;
};

export function CarSearchFiltersBottomPanel({
  filteredCount,
  error,
  onReset,
  onApply,
  onClose,
}: CarSearchFiltersBottomPanelProps) {
  const safeCount = typeof filteredCount === "number" ? filteredCount : 0;

  return (
    <View style={styles.filtersBottom}>
      {error ? <Text style={styles.filtersError}>{error}</Text> : null}

      <Text style={styles.filtersFound}>Найдено {safeCount} объявлений</Text>

      <View style={styles.filtersButtonsRow}>
        <TouchableOpacity
          style={[styles.btn, styles.btnDark, styles.filtersBtnHalf]}
          onPress={() => {
            onReset?.();
            onClose?.();
          }}
          activeOpacity={0.9}
        >
          <Text style={styles.btnTextPrimary}>Сбросить все</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.btnPrimary, styles.filtersBtnHalf]}
          onPress={() => {
            const ok = onApply?.();
            if (ok) onClose?.();
          }}
          activeOpacity={0.9}
        >
          <Text style={styles.btnTextPrimary}>Показать</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  filtersBottom: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border.subtle,
    backgroundColor: colors.surface.primary,
  },
  filtersFound: {
    fontSize: 12,
    color: colors.text.subtle,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  filtersError: {
    fontSize: 12,
    color: colors.brand.primary,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  filtersButtonsRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  filtersBtnHalf: {
    flex: 1,
  },
  btn: {
    minHeight: 44,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  btnPrimary: {
    backgroundColor: colors.brand.primary,
  },
  btnDark: {
    backgroundColor: colors.surface.inverse,
  },
  btnTextPrimary: {
    color: colors.text.inverse,
    fontSize: 14,
    fontWeight: "500",
  },
});
