import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../../../shared/theme/colors";
import {
  filterTextToIndex,
  MILEAGE_MAX,
  MILEAGE_MIN,
  MILEAGE_VALUES,
  mileageToFilterString,
} from "./mileagePickerUtils";
import { MileageWheelColumn } from "./MileageWheelColumn";

type Props = {
  visible: boolean;
  mileageFromText: string;
  mileageToText: string;
  filteredCount?: number;
  onApply: (fromText: string, toText: string) => void;
  onReset: () => void;
  onClose: () => void;
};

const DEFAULT_FROM_IDX = 0;
const DEFAULT_TO_IDX = MILEAGE_VALUES.length - 1;

export function MileageBottomSheet({
  visible,
  mileageFromText,
  mileageToText,
  filteredCount,
  onApply,
  onReset,
  onClose,
}: Props) {
  const [fromIdx, setFromIdx] = useState(DEFAULT_FROM_IDX);
  const [toIdx, setToIdx] = useState(DEFAULT_TO_IDX);

  // Refs hold the latest prop values so the sync effect can read them
  // without listing them as dependencies (we only sync on open, not on every change).
  const fromTextRef = useRef(mileageFromText);
  const toTextRef = useRef(mileageToText);
  fromTextRef.current = mileageFromText;
  toTextRef.current = mileageToText;

  // Sync wheel state when sheet opens
  useEffect(() => {
    if (visible) {
      setFromIdx(filterTextToIndex(fromTextRef.current, MILEAGE_MIN));
      setToIdx(filterTextToIndex(toTextRef.current, MILEAGE_MAX));
    }
  }, [visible]);

  // When "from" wheel moves past "to", pull "to" up to match
  const handleFromChange = useCallback((idx: number) => {
    setFromIdx(idx);
    setToIdx((prev) => Math.max(prev, idx));
  }, []);

  // When "to" wheel moves below "from", pull "from" down to match
  const handleToChange = useCallback((idx: number) => {
    setToIdx(idx);
    setFromIdx((prev) => Math.min(prev, idx));
  }, []);

  const handleApply = useCallback(() => {
    const fromVal = MILEAGE_VALUES[fromIdx] ?? MILEAGE_MIN;
    const toVal = MILEAGE_VALUES[toIdx] ?? MILEAGE_MAX;
    // Empty string = no constraint (controller treats "" as null)
    const fromText = fromVal === MILEAGE_MIN ? "" : mileageToFilterString(fromVal);
    const toText = toVal === MILEAGE_MAX ? "" : mileageToFilterString(toVal);
    onApply(fromText, toText);
    onClose();
  }, [fromIdx, toIdx, onApply, onClose]);

  const handleReset = useCallback(() => {
    setFromIdx(DEFAULT_FROM_IDX);
    setToIdx(DEFAULT_TO_IDX);
    onReset();
    onClose();
  }, [onReset, onClose]);

  const applyLabel =
    filteredCount != null
      ? `Применить · ${filteredCount} предложений`
      : "Применить";

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.root}>
        {/* Backdrop — tap outside to dismiss */}
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
          accessibilityLabel="Закрыть выбор пробега"
          accessibilityRole="button"
        />

        {/* Bottom sheet */}
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <Text style={styles.title}>Пробег, км</Text>
            <TouchableOpacity
              onPress={handleReset}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityLabel="Сбросить пробег"
              accessibilityRole="button"
            >
              <Text style={styles.resetText}>Сбросить</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.wheelsRow}>
            <MileageWheelColumn
              label="от"
              selectedIndex={fromIdx}
              onIndexChange={handleFromChange}
            />
            <View style={styles.divider} />
            <MileageWheelColumn
              label="до"
              selectedIndex={toIdx}
              onIndexChange={handleToChange}
            />
          </View>

          <TouchableOpacity
            style={styles.applyBtn}
            onPress={handleApply}
            accessibilityLabel={applyLabel}
            accessibilityRole="button"
          >
            <Text style={styles.applyText}>{applyLabel}</Text>
          </TouchableOpacity>

          {/* Safe-area spacer for devices with home indicator */}
          <View style={styles.safeBottom} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay.backdrop,
  },
  sheet: {
    backgroundColor: colors.surface.screen,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 8,
    paddingHorizontal: 16,
    paddingBottom: 0,
  },
  handle: {
    alignSelf: "center",
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border.muted,
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    color: colors.text.primary,
  },
  resetText: {
    fontSize: 15,
    color: colors.brand.primary,
    fontWeight: "500",
  },
  wheelsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  divider: {
    width: 1,
    backgroundColor: colors.border.subtle,
    alignSelf: "stretch",
    marginHorizontal: 8,
  },
  applyBtn: {
    backgroundColor: colors.brand.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 8,
  },
  applyText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.inverse,
  },
  safeBottom: {
    height: 26,
  },
});
