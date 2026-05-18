import React, { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { AppButton } from "../../../shared/ui/AppButton";
import { colors } from "../../../shared/theme/colors";
import { radius } from "../../../shared/theme/radius";
import { spacing } from "../../../shared/theme/spacing";

type Props = {
  onSubmit: (payload: { name: string; phone: string }) => Promise<void>;
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

export function AutoCreditContactForm({ onSubmit }: Props) {
  const [name, setName] = useState("");
  const [phoneDigits, setPhoneDigits] = useState("7");
  const [consent, setConsent] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [consentError, setConsentError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const formattedPhone = formatPhone(phoneDigits);

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
    if (!consent) {
      setConsentError("Необходимо согласие на обработку данных");
      hasError = true;
    }
    if (hasError || loading) return;

    setLoading(true);
    try {
      await onSubmit({ name: trimmedName, phone: `+${phoneDigits}` });
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <View style={styles.block}>
        <Text style={styles.successTitle}>Заявка отправлена</Text>
        <Text style={styles.successText}>
          Мы получили ваши данные и свяжемся с вами для подбора автокредита.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.block}>
      <Text style={styles.blockTitle}>Заполните ваши контактные данные</Text>

      <Text style={styles.label}>Имя</Text>
      <TextInput
        style={[styles.input, nameError ? styles.inputError : null]}
        placeholder="Имя"
        placeholderTextColor={colors.control.inputPlaceholder}
        value={name}
        onChangeText={(value) => {
          setName(value);
          if (nameError) setNameError(null);
        }}
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
        onChangeText={(value) => {
          setPhoneDigits(normalizePhoneDigits(value));
          if (phoneError) setPhoneError(null);
        }}
        editable={!loading}
      />
      {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}

      <Pressable
        style={styles.consentRow}
        onPress={() => {
          setConsent((prev) => !prev);
          if (consentError) setConsentError(null);
        }}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: consent }}
      >
        <View style={[styles.checkbox, consent && styles.checkboxChecked]}>
          {consent ? <Text style={styles.checkmark}>✓</Text> : null}
        </View>
        <Text style={styles.consentText}>Даю согласие на обработку персональных данных</Text>
      </Pressable>
      {consentError ? <Text style={styles.errorText}>{consentError}</Text> : null}

      <AppButton
        label={loading ? "Отправляем..." : "Подтвердить"}
        onPress={handleSubmit}
        loading={loading}
        style={styles.submitBtn}
        accessibilityLabel="Подтвердить заявку на автокредит"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    marginBottom: spacing.xl,
  },
  blockTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 14,
    color: colors.text.secondary,
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
    marginBottom: spacing.sm,
  },
  consentRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: colors.border.input,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: colors.brand.primary,
    borderColor: colors.brand.primary,
  },
  checkmark: {
    color: colors.text.inverse,
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 16,
  },
  consentText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: colors.text.primary,
  },
  submitBtn: {
    marginTop: spacing.xs,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  successText: {
    fontSize: 15,
    lineHeight: 21,
    color: colors.text.secondary,
  },
});
