import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CloseIcon from "../../../assets/icons/close.svg";
import { MileageRangePicker } from "../../filters/ui/MileageRangePicker";

/**
 * Компактная плашка с выбором пробега (тот же MileageRangePicker, что в фильтрах).
 */
export function CatalogMileageFloatingPanel({
  visible,
  onDismiss,
  mileageFromText,
  mileageToText,
  onChangeMileageFromText,
  onChangeMileageToText,
  bottomInset = 0,
}) {
  if (!visible) {
    return null;
  }

  return (
    <View style={[styles.wrap, { paddingBottom: 12 + bottomInset }]}>
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Пробег</Text>
          <TouchableOpacity
            onPress={onDismiss}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Закрыть"
          >
            <CloseIcon width={18} height={18} />
          </TouchableOpacity>
        </View>
        <MileageRangePicker
          fromText={mileageFromText}
          toText={mileageToText}
          onChangeFromText={onChangeMileageFromText}
          onChangeToText={onChangeMileageToText}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 12,
    zIndex: 25,
    elevation: 12,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
    borderWidth: 1,
    borderColor: "#EDEDED",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E1E1E",
  },
});
