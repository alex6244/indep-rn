import { BlurView } from "expo-blur";
import React, { useEffect, useState } from "react";
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { colors } from "../../../shared/theme/colors";
import { spacing } from "../../../shared/theme/spacing";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export function CallbackModal({ visible, onClose }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (!visible) {
      setName("");
      setPhone("");
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <BlurView intensity={36} tint="dark" style={StyleSheet.absoluteFillObject} />
        <View style={styles.dimLayer} />
        <View style={styles.sheet}>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={onClose}
            activeOpacity={0.8}
            accessible
            accessibilityRole="button"
            accessibilityLabel="Закрыть модальное окно обратного звонка"
          >
            <Text style={styles.closeText}>×</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Закажите обратный звонок!</Text>
          <Text style={styles.subtitle}>
            Оставьте свой номер, и мы перезвоним, чтобы ответить на вопросы.
          </Text>

          <Text style={styles.label}>Имя</Text>
          <TextInput
            style={styles.input}
            placeholder="Укажите Ваше имя"
            placeholderTextColor={colors.textMuted}
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Номер телефона</Text>
          <TextInput
            style={styles.input}
            placeholder="+7 (___) ___-__-__"
            placeholderTextColor={colors.textMuted}
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />

          <TouchableOpacity
            style={styles.submitBtn}
            onPress={onClose}
            activeOpacity={0.88}
            accessibilityRole="button"
            accessibilityLabel="Отправить заявку на обратный звонок"
          >
            <Text style={styles.submitText}>Перезвоните мне</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
  },
  dimLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlayDark,
  },
  sheet: {
    backgroundColor: colors.surfacePrimary,
    borderRadius: spacing.lg,
    padding: spacing.xxl,
    width: "100%",
    maxWidth: 560,
    elevation: 16,
    zIndex: 1,
  },
  closeBtn: {
    position: "absolute",
    right: 14,
    top: 10,
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  closeText: {
    color: "#B8B8B8",
    fontSize: 30,
    lineHeight: 30,
    fontWeight: "400",
  },
  title: {
    fontSize: 21,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: spacing.md - 2,
    paddingRight: 30,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  label: {
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.surfaceInput,
    borderRadius: spacing.md,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  submitBtn: {
    backgroundColor: colors.brandPrimary,
    borderRadius: spacing.md,
    paddingVertical: 13,
    alignItems: "center",
    marginTop: spacing.xs,
  },
  submitText: {
    color: colors.onDark,
    fontSize: 16,
    fontWeight: "600",
  },
});
