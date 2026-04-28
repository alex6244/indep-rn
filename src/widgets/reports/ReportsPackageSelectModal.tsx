import React, { useMemo } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import CloseIcon from "../../assets/icons/close.svg";
import { shadowStyle } from "../../shared/theme/shadow";
import { colors } from "../../shared/theme/colors";
import { spacing } from "../../shared/theme/spacing";

type PackageOption = {
  count: number;
  priceRub: number;
  durationText: string;
};

export type ReportsPackageSelectModalProps = {
  visible: boolean;
  selectedCount: number;
  onSelect: (count: number) => void;
  onClose: () => void;
};

const formatRub = (value: number) => `${new Intl.NumberFormat("ru-RU").format(value)} ₽`;

export function ReportsPackageSelectModal({
  visible,
  selectedCount,
  onSelect,
  onClose,
}: ReportsPackageSelectModalProps) {
  const options: PackageOption[] = useMemo(
    () => [
      { count: 1, priceRub: 550, durationText: "действует 1 месяц" },
      { count: 5, priceRub: 2000, durationText: "действует 1 месяц" },
      { count: 10, priceRub: 4000, durationText: "действует 1 год" },
    ],
    [],
  );

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />

      <View style={styles.center}>
        <View style={[styles.card, { pointerEvents: "box-none" }]}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Закрыть"
            style={styles.closeBtn}
            onPress={onClose}
          >
            <CloseIcon width={12} height={12} />
          </TouchableOpacity>

          <View style={styles.list}>
            {options.map((opt, idx) => {
              const active = opt.count === selectedCount;
              return (
                <TouchableOpacity
                  key={opt.count}
                  style={[styles.row, idx !== options.length - 1 && styles.rowDivider]}
                  activeOpacity={0.9}
                  onPress={() => onSelect(opt.count)}
                >
                  <View style={styles.left}>
                    <Text style={[styles.countText, active && styles.countTextActive]}>
                      {opt.count} отчет{opt.count === 1 ? "" : opt.count >= 2 && opt.count <= 4 ? "а" : "ов"}
                    </Text>
                    <Text style={styles.durationText}>{opt.durationText}</Text>
                  </View>

                  <View
                    style={[
                      styles.pricePill,
                      active ? styles.pricePillActive : styles.pricePillInactive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.priceText,
                        active ? styles.priceTextActive : styles.priceTextInactive,
                      ]}
                    >
                      {formatRub(opt.priceRub)}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay.backdrop,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface.primary,
    borderRadius: 20,
    paddingTop: 18,
    paddingBottom: 10,
    paddingHorizontal: 18,
    overflow: "hidden",
    ...(shadowStyle({
      // Shadow raw values are kept intentionally for platform-specific shadow rendering.
      boxShadow: "0px 10px 18px rgba(0,0,0,0.12)",
      shadowColor: colors.text.primary,
      shadowOpacity: 0.12,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 10 },
      elevation: 10,
    }) as object),
    elevation: 10,
  },
  closeBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 44,
    minHeight: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
    backgroundColor: colors.overlay.soft,
  },
  list: {
    marginTop: 6,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 6,
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.surface.placeholder,
  },
  left: {
    flex: 1,
    paddingRight: 12,
  },
  countText: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text.primary,
  },
  countTextActive: {
    color: colors.brand.primary,
  },
  durationText: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: "600",
    color: colors.text.tertiary,
  },
  pricePill: {
    width: 110,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  pricePillActive: {
    backgroundColor: colors.brand.primary,
  },
  pricePillInactive: {
    backgroundColor: colors.surface.disabled,
  },
  priceText: {
    fontSize: 18,
    fontWeight: "800",
  },
  priceTextActive: {
    color: colors.text.inverse,
  },
  priceTextInactive: {
    color: colors.text.primary,
  },
});

