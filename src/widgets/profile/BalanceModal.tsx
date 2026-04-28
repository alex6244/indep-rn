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
import { shadowStyle } from "../../shared/theme/shadow";
import { colors } from "../../shared/theme/colors";
import { radius } from "../../shared/theme/radius";
import { spacing } from "../../shared/theme/spacing";

type Props = {
  visible: boolean;
  balanceText?: string;
  onClose: () => void;
  onKeepInWallet?: () => void;
  onWithdraw?: () => void;
};

export function BalanceModal({
  visible,
  balanceText = "2 000 ₽",
  onClose,
  onKeepInWallet,
  onWithdraw,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.root}>
        <BlurView
          intensity={26}
          tint="light"
          style={StyleSheet.absoluteFillObject}
        />
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={[styles.sheetWrap, { pointerEvents: "box-none" }]}>
          <View style={styles.card}>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Закрыть"
              onPress={onClose}
              style={styles.closeBtn}
            >
              <Text style={styles.closeText}>×</Text>
            </TouchableOpacity>

            <Text style={styles.caption}>У Вас на счету:</Text>
            <Text style={styles.amount}>{balanceText}</Text>

            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={[styles.actionBtn, styles.keepBtn]}
                onPress={onKeepInWallet ?? onClose}
              >
                <Text
                  style={styles.keepText}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                >
                  Оставить в кошельке
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionBtn, styles.withdrawBtn]}
                onPress={onWithdraw ?? onClose}
              >
                <Text style={styles.withdrawText} numberOfLines={1}>
                  Вывести
                </Text>
              </TouchableOpacity>
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
    justifyContent: "center",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.26)",
  },
  sheetWrap: {
    paddingHorizontal: spacing.lg,
  },
  card: {
    width: "100%",
    maxWidth: 640,
    alignSelf: "center",
    backgroundColor: colors.surface.primary,
    borderRadius: radius.lg + 8,
    paddingHorizontal: spacing.xxl,
    paddingTop: 26,
    paddingBottom: spacing.lg,
    ...(shadowStyle({
      boxShadow: "0px 12px 24px rgba(0,0,0,0.12)",
      shadowColor: colors.text.primary,
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.12,
      shadowRadius: 24,
      elevation: 10,
    }) as object),
    elevation: 10,
  },
  closeBtn: {
    position: "absolute",
    top: 10,
    right: 12,
    width: 44,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  closeText: {
    fontSize: 40,
    lineHeight: 40,
    color: colors.surface.placeholder,
    fontWeight: "300",
  },
  caption: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "500",
    color: colors.text.primary,
  },
  amount: {
    marginTop: 8,
    fontSize: 56,
    lineHeight: 62,
    fontWeight: "600",
    color: colors.text.primary,
  },
  actionsRow: {
    marginTop: spacing.xxl,
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  actionBtn: {
    borderRadius: radius.md + 2,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.md,
    minHeight: 44,
  },
  keepBtn: {
    flex: 2,
    backgroundColor: colors.surface.inverse,
  },
  withdrawBtn: {
    flex: 1,
    backgroundColor: colors.brand.primary,
  },
  keepText: {
    color: colors.text.inverse,
    fontSize: 16,
    fontWeight: "500",
  },
  withdrawText: {
    color: colors.text.inverse,
    fontSize: 16,
    fontWeight: "500",
  },
});
