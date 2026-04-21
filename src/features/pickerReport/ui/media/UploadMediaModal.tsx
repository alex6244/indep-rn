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
import { FONT_FAMILY } from "../../../../shared/theme/fonts";
import { shadowStyle } from "../../../../shared/theme/shadow";
import { colors } from "../../../../shared/theme/colors";

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

      <View style={[styles.center, { pointerEvents: "box-none" }]}>
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
    backgroundColor: colors.overlay.backdrop,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: colors.surface.primary,
    borderRadius: 20,
    paddingTop: 18,
    paddingBottom: 14,
    paddingHorizontal: 16,
    ...(shadowStyle({
      // Shadow raw values are kept intentionally for platform-specific shadow rendering.
      boxShadow: "0px 10px 18px rgba(0,0,0,0.12)",
      shadowColor: "#000",
      shadowOpacity: 0.12,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 10 },
      elevation: 10,
    }) as object),
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
    backgroundColor: colors.overlay.soft,
  },
  iconWrap: {
    marginTop: 8,
    marginBottom: 12,
    width: 82,
    height: 82,
    borderRadius: 18,
    backgroundColor: colors.surface.neutral,
    alignItems: "center",
    justifyContent: "center",
  },
  iconPlaceholder: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: colors.surface.placeholder,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text.primary,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
    color: colors.text.tertiary,
    textAlign: "center",
    marginBottom: 14,
    paddingHorizontal: 4,
  },
  primaryBtn: {
    width: "100%",
    borderRadius: 12,
    height: 44,
    backgroundColor: colors.brand.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  primaryBtnText: {
    color: colors.text.inverse,
    fontSize: 14,
    fontWeight: "700",
    fontFamily: FONT_FAMILY.button,
  },
  secondaryBtn: {
    width: "100%",
    borderRadius: 12,
    height: 44,
    backgroundColor: colors.surface.disabled,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryBtnText: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: "600",
    fontFamily: FONT_FAMILY.button,
  },
});
