import React from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BlurView } from "expo-blur";

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
        <BlurView intensity={26} tint="light" style={StyleSheet.absoluteFillObject} />
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.sheetWrap} pointerEvents="box-none">
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
                <Text style={styles.keepText}>Оставить в кошельке</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBtn, styles.withdrawBtn]}
                onPress={onWithdraw ?? onClose}
              >
                <Text style={styles.withdrawText}>Вывести</Text>
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
    paddingHorizontal: 18,
  },
  card: {
    width: "100%",
    maxWidth: 640,
    alignSelf: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingHorizontal: 22,
    paddingTop: 26,
    paddingBottom: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 10,
  },
  closeBtn: {
    position: "absolute",
    top: 10,
    right: 12,
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  closeText: {
    fontSize: 40,
    lineHeight: 40,
    color: "#CFCFCF",
    fontWeight: "300",
  },
  caption: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "500",
    color: "#1F1F1F",
  },
  amount: {
    marginTop: 8,
    fontSize: 56,
    lineHeight: 62,
    fontWeight: "600",
    color: "#1F1F1F",
  },
  actionsRow: {
    marginTop: 22,
    flexDirection: "row",
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    minHeight: 56,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  keepBtn: {
    backgroundColor: "#777777",
  },
  withdrawBtn: {
    backgroundColor: "#E14332",
  },
  keepText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
  withdrawText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
});
