import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { WheelColumn } from "../../../shared/ui/WheelColumn";
import { colors } from "../../../shared/theme/colors";
import {
  formatYearRu,
  indexToYearText,
  YEAR_VALUES,
  yearTextToIndex,
} from "../lib/yearPickerUtils";

type Props = {
  visible: boolean;
  yearText: string;
  onApply: (yearText: string) => void;
  onReset: () => void;
  onClose: () => void;
};

export function YearBottomSheet({
  visible,
  yearText,
  onApply,
  onReset,
  onClose,
}: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const yearTextRef = useRef(yearText);
  yearTextRef.current = yearText;

  useEffect(() => {
    if (visible) {
      setSelectedIndex(yearTextToIndex(yearTextRef.current));
    }
  }, [visible]);

  const handleApply = useCallback(() => {
    onApply(indexToYearText(selectedIndex));
    onClose();
  }, [onApply, onClose, selectedIndex]);

  const handleReset = useCallback(() => {
    setSelectedIndex(0);
    onReset();
    onClose();
  }, [onReset, onClose]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.root}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
          accessibilityLabel="Закрыть выбор года"
          accessibilityRole="button"
        />

        <View style={styles.sheet}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <Text style={styles.title}>Год выпуска</Text>
            <TouchableOpacity
              onPress={handleReset}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityLabel="Сбросить год"
              accessibilityRole="button"
            >
              <Text style={styles.resetText}>Сбросить</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.wheelWrap}>
            <WheelColumn
              label="год"
              values={YEAR_VALUES}
              selectedIndex={selectedIndex}
              formatValue={formatYearRu}
              onIndexChange={setSelectedIndex}
            />
          </View>

          <TouchableOpacity
            style={styles.applyBtn}
            onPress={handleApply}
            accessibilityLabel="Применить"
            accessibilityRole="button"
          >
            <Text style={styles.applyText}>Применить</Text>
          </TouchableOpacity>

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
  wheelWrap: {
    marginBottom: 20,
    paddingHorizontal: 24,
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
