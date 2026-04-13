import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
    backgroundColor: "#FFFFFF",
  },
  filtersFound: {
    fontSize: 12,
    color: "#979797",
    textAlign: "center",
    marginBottom: 8,
  },
  filtersError: {
    fontSize: 12,
    color: "#DB4431",
    textAlign: "center",
    marginBottom: 8,
  },
  filtersButtonsRow: {
    flexDirection: "row",
    gap: 8,
  },
  filtersBtnHalf: {
    flex: 1,
  },
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  btnPrimary: {
    backgroundColor: "#DB4431",
  },
  btnDark: {
    backgroundColor: "#080717",
  },
  btnTextPrimary: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
});
