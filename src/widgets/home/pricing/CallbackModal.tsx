import { BlurView } from "expo-blur";
import React, { useEffect, useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { colors } from "../../../shared/theme/colors";
import { radius } from "../../../shared/theme/radius";
import { spacing } from "../../../shared/theme/spacing";
import { AppButton } from "../../../shared/ui/AppButton";
import { AppInput } from "../../../shared/ui/AppInput";

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

          <AppInput
            label="Имя"
            placeholder="Укажите Ваше имя"
            value={name}
            onChangeText={setName}
            containerStyle={styles.inputWrap}
          />

          <AppInput
            label="Номер телефона"
            placeholder="+7 (___) ___-__-__"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            containerStyle={styles.inputWrap}
          />

          <AppButton
            label="Перезвоните мне"
            style={styles.submitBtn}
            onPress={onClose}
            accessibilityLabel="Отправить заявку на обратный звонок"
          />
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
    backgroundColor: colors.overlay.dark,
  },
  sheet: {
    backgroundColor: colors.surface.primary,
    borderRadius: radius.lg,
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
    color: colors.icon.muted,
    fontSize: 30,
    lineHeight: 30,
    fontWeight: "400",
  },
  title: {
    fontSize: 21,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: spacing.md - 2,
    paddingRight: 30,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.primary,
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  inputWrap: {
    marginBottom: spacing.lg,
  },
  submitBtn: {
    marginTop: spacing.xs,
  },
});
