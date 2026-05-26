import { BlurView } from "expo-blur";
import React from "react";
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
import { figmaText } from "../../shared/theme/typography";
import {
  formatReportsPackageCountLabel,
  formatReportsPackagePrice,
  REPORTS_PACKAGE_MODAL_INTRO,
  REPORTS_PACKAGE_OPTIONS,
} from "./reportsPackage.data";

export type ReportsPackageSelectModalProps = {
  visible: boolean;
  onClose: () => void;
};

export function ReportsPackageSelectModal({ visible, onClose }: ReportsPackageSelectModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.root}>
        <BlurView intensity={32} tint="dark" style={StyleSheet.absoluteFillObject} />
        <Pressable style={styles.backdropTap} onPress={onClose} accessibilityLabel="Закрыть" />

        <View style={styles.center} pointerEvents="box-none">
          <View style={styles.card}>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Закрыть"
              style={styles.closeBtn}
              onPress={onClose}
              hitSlop={12}
            >
              <CloseIcon width={12} height={12} />
            </TouchableOpacity>

            <Text style={styles.intro}>{REPORTS_PACKAGE_MODAL_INTRO}</Text>

            <View style={styles.list}>
              {REPORTS_PACKAGE_OPTIONS.map((option, index) => (
                <View
                  key={option.id}
                  style={[styles.row, index < REPORTS_PACKAGE_OPTIONS.length - 1 && styles.rowDivider]}
                >
                  <View style={styles.rowText}>
                    <Text style={styles.countText}>
                      {formatReportsPackageCountLabel(option.count)}
                    </Text>
                    <Text style={styles.durationText}>{option.durationText}</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.priceBtn}
                    activeOpacity={0.85}
                    accessibilityRole="button"
                    accessibilityLabel={`Купить пакет: ${formatReportsPackageCountLabel(option.count)}, ${formatReportsPackagePrice(option.priceRub)}`}
                    onPress={() => {
                      /* Оплата подключится с backend — пока только UI. */
                    }}
                  >
                    <Text style={styles.priceBtnText}>{formatReportsPackagePrice(option.priceRub)}</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  backdropTap: {
    ...StyleSheet.absoluteFillObject,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface.primary,
    borderRadius: 20,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.lg,
    overflow: "hidden",
    ...(shadowStyle({
      boxShadow: "0px 10px 24px rgba(0,0,0,0.14)",
      shadowColor: colors.text.primary,
      shadowOpacity: 0.14,
      shadowRadius: 20,
      shadowOffset: { width: 0, height: 10 },
      elevation: 12,
    }) as object),
  },
  closeBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
    backgroundColor: colors.overlay.soft,
  },
  /** Вводный текст — обычный, серый. */
  intro: {
    ...figmaText.body,
    color: colors.text.tertiary,
    textAlign: "center",
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  list: {
    marginTop: spacing.xs,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  rowDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border.subtle,
  },
  rowText: {
    flex: 1,
    minWidth: 0,
  },
  /** Название пакета — жирный, тёмно-серый. */
  countText: {
    ...figmaText.subtitle,
    fontWeight: "700",
    color: colors.text.secondary,
  },
  durationText: {
    ...figmaText.body,
    marginTop: 4,
    color: colors.text.tertiary,
  },
  priceBtn: {
    minWidth: 108,
    paddingVertical: 14,
    paddingHorizontal: spacing.md,
    borderRadius: 14,
    backgroundColor: colors.brand.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  /** Цена на кнопке — жирная, белая. */
  priceBtnText: {
    ...figmaText.bodyLargeBold,
    color: colors.text.inverse,
  },
});
