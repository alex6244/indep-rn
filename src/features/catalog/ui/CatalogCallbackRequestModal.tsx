import { BlurView } from "expo-blur";
import React, { useEffect, useMemo, useState } from "react";
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { colors } from "../../../shared/theme/colors";
import { radius } from "../../../shared/theme/radius";
import { spacing } from "../../../shared/theme/spacing";

type CallbackPayload = {
  name: string;
  phone: string;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (payload: CallbackPayload) => Promise<void>;
};

function normalizePhoneDigits(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "7";
  if (digits[0] === "8") return `7${digits.slice(1, 11)}`;
  if (digits[0] === "7") return digits.slice(0, 11);
  return `7${digits.slice(0, 10)}`;
}

function formatPhone(value: string): string {
  const normalized = normalizePhoneDigits(value);
  const rest = normalized.slice(1);
  const p1 = rest.slice(0, 3);
  const p2 = rest.slice(3, 6);
  const p3 = rest.slice(6, 8);
  const p4 = rest.slice(8, 10);

  let formatted = "+7";
  if (rest.length > 0) formatted += ` (${p1}`;
  if (rest.length >= 3) formatted += ")";
  if (rest.length > 3) formatted += ` ${p2}`;
  if (rest.length > 6) formatted += `-${p3}`;
  if (rest.length > 8) formatted += `-${p4}`;
  return formatted;
}

export function CatalogCallbackRequestModal({ visible, onClose, onSubmit }: Props) {
  const [mode, setMode] = useState<"form" | "success">("form");
  const [name, setName] = useState("");
  const [phoneDigits, setPhoneDigits] = useState("7");
  const [nameError, setNameError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const formattedPhone = useMemo(() => formatPhone(phoneDigits), [phoneDigits]);

  useEffect(() => {
    if (!visible) {
      setMode("form");
      setName("");
      setPhoneDigits("7");
      setNameError(null);
      setPhoneError(null);
      setLoading(false);
    }
  }, [visible]);

  const handleNameChange = (value: string) => {
    setName(value);
    if (nameError) setNameError(null);
  };

  const handlePhoneChange = (value: string) => {
    setPhoneDigits(normalizePhoneDigits(value));
    if (phoneError) setPhoneError(null);
  };

  const handleSubmit = async () => {
    const trimmedName = name.trim();
    let hasError = false;

    if (!trimmedName) {
      setNameError("Введите имя");
      hasError = true;
    }
    if (phoneDigits.length !== 11 || phoneDigits[0] !== "7") {
      setPhoneError("Введите корректный номер телефона");
      hasError = true;
    }
    if (hasError || loading) return;

    setLoading(true);
    try {
      await onSubmit({ name: trimmedName, phone: `+${phoneDigits}` });
      setMode("success");
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <BlurView intensity={36} tint="dark" style={StyleSheet.absoluteFillObject} />
        <View style={styles.dimLayer} />

        <View style={styles.sheet}>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Закрыть модальное окно"
          >
            <Text style={styles.closeText}>×</Text>
          </TouchableOpacity>

          {mode === "form" ? (
            <>
              <Text style={styles.title}>Закажите обратный звонок!</Text>
              <Text style={styles.subtitle}>
                Оставьте свой номер, и мы перезвоним, чтобы ответить на вопросы.
              </Text>

              <Text style={styles.label}>Имя</Text>
              <TextInput
                style={[styles.input, nameError ? styles.inputError : null]}
                placeholder="Укажите Ваше имя"
                placeholderTextColor={colors.control.inputPlaceholder}
                value={name}
                onChangeText={handleNameChange}
                editable={!loading}
              />
              {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

              <Text style={styles.label}>Номер телефона</Text>
              <TextInput
                style={[styles.input, phoneError ? styles.inputError : null]}
                placeholder="+7 (___) ___-__-__"
                placeholderTextColor={colors.control.inputPlaceholder}
                keyboardType="phone-pad"
                value={formattedPhone}
                onChangeText={handlePhoneChange}
                editable={!loading}
              />
              {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}

              <TouchableOpacity
                style={[styles.primaryBtn, loading ? styles.primaryBtnDisabled : null]}
                onPress={handleSubmit}
                disabled={loading}
                accessibilityRole="button"
                accessibilityLabel="Отправить заявку на обратный звонок"
              >
                <Text style={styles.primaryBtnText}>
                  {loading ? "Отправляем..." : "Перезвоните мне"}
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.title}>Готово!</Text>
              <Text style={styles.subtitle}>
                Мы получили вашу заявку. Ожидайте звонка в ближайшее время.
              </Text>
              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={handleSuccessClose}
                accessibilityRole="button"
                accessibilityLabel="Закрыть модальное окно успешной отправки"
              >
                <Text style={styles.primaryBtnText}>Отлично</Text>
              </TouchableOpacity>
            </>
          )}
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
    width: "100%",
    backgroundColor: colors.surface.primary,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.xxl,
    paddingTop: 22,
    paddingBottom: spacing.xxl,
    zIndex: 1,
  },
  closeBtn: {
    position: "absolute",
    right: 14,
    top: 10,
    width: 44,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  closeText: {
    color: colors.text.subtle,
    fontSize: 30,
    lineHeight: 30,
    fontWeight: "400",
  },
  title: {
    fontSize: 21,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: spacing.sm,
    paddingRight: 30,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
    color: colors.text.primary,
    marginBottom: spacing.xl,
  },
  label: {
    fontSize: 14,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.control.inputBg,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 16,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  inputError: {
    borderWidth: 1,
    borderColor: colors.brand.primary,
  },
  errorText: {
    color: colors.brand.primary,
    fontSize: 13,
    marginBottom: spacing.md,
  },
  primaryBtn: {
    marginTop: spacing.md,
    backgroundColor: colors.control.buttonPrimaryBg,
    borderRadius: radius.md,
    minHeight: 44,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnDisabled: {
    opacity: 0.8,
  },
  primaryBtnText: {
    color: colors.control.buttonPrimaryText,
    fontSize: 16,
    fontWeight: "600",
  },
});

