import React from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import CloseIcon from "../../../../assets/icons/close.svg";

export type UploadMediaModalProps = {
  visible: boolean;
  title: string;
  subtitle?: string;
  primaryActionLabel?: string;
  secondaryActionLabel?: string;
  icon?: React.ReactNode;
  onPickPress: () => void;
  onClose: () => void;
};

export function UploadMediaModal({
  visible,
  title,
  subtitle,
  primaryActionLabel = "Выбрать файл",
  secondaryActionLabel = "Закрыть",
  icon,
  onPickPress,
  onClose,
}: UploadMediaModalProps) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />

      <View style={styles.center} pointerEvents="box-none">
        <View style={styles.card}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Закрыть"
            activeOpacity={0.9}
            style={styles.closeBtn}
            onPress={onClose}
          >
            <CloseIcon width={10} height={10} />
          </TouchableOpacity>

          <View style={styles.iconWrap}>{icon ?? <View style={styles.iconPlaceholder} />}</View>

          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}

          <TouchableOpacity activeOpacity={0.9} style={styles.primaryBtn} onPress={onPickPress}>
            <Text style={styles.primaryBtnText}>{primaryActionLabel}</Text>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.9} style={styles.secondaryBtn} onPress={onClose}>
            <Text style={styles.secondaryBtnText}>{secondaryActionLabel}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingTop: 18,
    paddingBottom: 14,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
    alignItems: "center",
  },
  closeBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.03)",
  },
  iconWrap: {
    marginTop: 8,
    marginBottom: 12,
    width: 82,
    height: 82,
    borderRadius: 18,
    backgroundColor: "#F7F7F7",
    alignItems: "center",
    justifyContent: "center",
  },
  iconPlaceholder: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: "#E9E9E9",
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1E1E1E",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
    color: "#6B757C",
    textAlign: "center",
    marginBottom: 14,
    paddingHorizontal: 4,
  },
  primaryBtn: {
    width: "100%",
    borderRadius: 12,
    height: 44,
    backgroundColor: "#DB4431",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  primaryBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  secondaryBtn: {
    width: "100%",
    borderRadius: 12,
    height: 44,
    backgroundColor: "#F3F3F3",
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryBtnText: {
    color: "#1E1E1E",
    fontSize: 14,
    fontWeight: "600",
  },
});
