// src/app/(auth)/index.tsx — экран логина
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { colors } from "../../shared/theme/colors";
import { radius } from "../../shared/theme/radius";
import { spacing } from "../../shared/theme/spacing";
import { typography } from "../../shared/theme/typography";
import { AppButton } from "../../shared/ui/AppButton";
import { AppInput } from "../../shared/ui/AppInput";
import { AuthHeader } from "../../widgets/header/AuthHeader";
import { InlineMessage } from "../../shared/ui/InlineMessage";
import { getUserErrorMessage } from "../../shared/errors/getUserErrorMessage";
import { formatResendCountdown, maskEmail, sanitizeOtpCode } from "../../shared/utils/maskEmail";
import { isEmailValid, normalizeEmail } from "../../shared/validation/authValidation";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"request" | "confirm">("request");
  const [resendSeconds, setResendSeconds] = useState(0);
  const [codeErrorText, setCodeErrorText] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ tone: "error" | "info"; text: string } | null>(null);
  const { requestVerification, confirmVerification, authError, loading: authLoading } = useAuth();
  const submittingCodeRef = useRef(false);

  useEffect(() => {
    if (step !== "confirm" || resendSeconds <= 0) return;
    const id = setInterval(() => {
      setResendSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, [step, resendSeconds]);

  const handleRequestCode = async () => {
    if (authLoading) {
      setMessage({ tone: "info", text: "Идёт инициализация авторизации." });
      return;
    }
    const trimmedEmail = email.trim();
    const normalizedEmail = normalizeEmail(trimmedEmail);

    if (!isEmailValid(normalizedEmail)) {
      setMessage({ tone: "error", text: "Введите корректный e-mail." });
      return;
    }

    setLoading(true);
    try {
      const result = await requestVerification(normalizedEmail);
      if (result.success) {
        setStep("confirm");
        setResendSeconds(60);
        setCodeErrorText(undefined);
        setMessage({
          tone: "info",
          text: `Код отправлен на ${maskEmail(normalizedEmail)}. Проверьте почту и введите 6 цифр.`,
        });
      } else {
        const error = result.error ?? authError;
        const text = getUserErrorMessage(error, "Не удалось отправить код. Попробуйте снова.");
        setMessage({ tone: "error", text });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmCode = async () => {
    if (submittingCodeRef.current) return;
    const normalizedEmail = normalizeEmail(email.trim());
    const trimmedCode = code.trim();
    if (!isEmailValid(normalizedEmail)) {
      setMessage({ tone: "error", text: "Введите корректный e-mail." });
      setStep("request");
      return;
    }
    if (!/^\d{6}$/.test(trimmedCode)) {
      setCodeErrorText("Введите 6-значный код подтверждения.");
      return;
    }
    setCodeErrorText(undefined);
    submittingCodeRef.current = true;
    setLoading(true);
    try {
      const result = await confirmVerification({ email: normalizedEmail, code: trimmedCode });
      if (result.success) {
        router.replace("/(tabs)/profile");
        return;
      }
      const error = result.error ?? authError;
      const text = getUserErrorMessage(error, "Не удалось подтвердить код.");
      setMessage({ tone: "error", text });
    } finally {
      setLoading(false);
      submittingCodeRef.current = false;
    }
  };

  useEffect(() => {
    if (step !== "confirm") return;
    if (code.length !== 6 || loading) return;
    void handleConfirmCode();
  }, [code, step, loading]);

  const handleCodeChange = (text: string) => {
    const next = sanitizeOtpCode(text);
    setCode(next);
    if (next.length < 6) {
      setCodeErrorText("Введите 6-значный код подтверждения.");
    } else {
      setCodeErrorText(undefined);
    }
  };

  const handleChangeEmail = () => {
    if (loading) return;
    setStep("request");
    setCode("");
    setResendSeconds(0);
    setCodeErrorText(undefined);
    setMessage(null);
  };

  return (
    <>
      <AuthHeader />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.formCard}>
            <Text style={styles.title}>Войти</Text>
            {message ? <InlineMessage tone={message.tone} message={message.text} /> : null}

            <View style={styles.inputGroup}>
              <AppInput
                label="Почта"
                value={email}
                onChangeText={setEmail}
                placeholder="name@example.com"
                autoCapitalize="none"
                keyboardType="email-address"
                disabled={loading || step === "confirm"}
              />
            </View>
            {step === "confirm" ? (
              <View style={styles.inputGroup}>
                <AppInput
                  label="Код подтверждения"
                  value={code}
                  onChangeText={handleCodeChange}
                  placeholder="Введите 6-значный код"
                  keyboardType="number-pad"
                  disabled={loading}
                  errorText={codeErrorText}
                />
                <Text style={styles.hintText}>Код отправлен на {maskEmail(normalizeEmail(email))}</Text>
              </View>
            ) : null}

            {step === "request" ? (
              <AppButton
                label="Отправить код"
                onPress={handleRequestCode}
                disabled={loading}
                loading={loading}
                style={styles.submitButton}
              />
            ) : (
              <>
                <AppButton
                  label="Подтвердить код"
                  onPress={handleConfirmCode}
                  disabled={loading}
                  loading={loading}
                  style={styles.submitButton}
                />
                <TouchableOpacity
                  style={styles.secondaryAction}
                  onPress={handleRequestCode}
                  disabled={loading || resendSeconds > 0}
                  accessibilityRole="button"
                  accessibilityLabel="Отправить код повторно"
                >
                  <Text style={styles.secondaryActionText}>
                    {resendSeconds > 0
                      ? `Отправить код повторно через ${formatResendCountdown(resendSeconds)}`
                      : "Отправить код повторно"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.secondaryAction}
                  onPress={handleChangeEmail}
                  disabled={loading}
                  accessibilityRole="button"
                  accessibilityLabel="Изменить email"
                >
                  <Text style={styles.secondaryActionText}>Изменить email</Text>
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity
              style={styles.registerLinkWrapper}
              onPress={() => {
                if (!loading) {
                  router.push("/(auth)/register");
                }
              }}
              disabled={loading}
              accessibilityRole="button"
              accessibilityLabel="Перейти к регистрации"
            >
              <Text style={styles.registerLink}>
                Нет аккаунта? <Text style={styles.registerLinkText}>Перейти к регистрации</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface.screen,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
  },
  formCard: {
    backgroundColor: colors.surface.screen,
    paddingVertical: spacing.sm,
    gap: spacing.lg,
  },
  title: {
    ...typography.title,
    fontSize: 28,
    lineHeight: 32,
    fontWeight: "600",
    textAlign: "center",
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  inputGroup: {
    gap: spacing.xs,
  },
  submitButton: {
    alignSelf: "stretch",
    minHeight: 48,
    borderRadius: radius.md,
  },
  secondaryAction: {
    alignItems: "center",
    marginTop: spacing.xs,
  },
  secondaryActionText: {
    ...typography.textRegular,
    color: colors.brand.primary,
    fontSize: 14,
    textDecorationLine: "underline",
  },
  hintText: {
    ...typography.textRegular,
    fontSize: 12,
    color: colors.text.subtle,
    marginTop: spacing.xs,
  },
  registerLinkWrapper: {
    marginTop: spacing.xs,
    alignItems: "center",
  },
  registerLink: {
    ...typography.textRegular,
    fontSize: 14,
    color: colors.text.subtle,
    textAlign: "center",
  },
  registerLinkText: {
    color: colors.brand.primary,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});
