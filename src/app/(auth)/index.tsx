// src/app/(auth)/index.tsx — экран логина
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  type TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../contexts/AuthContext";
import { colors } from "../../shared/theme/colors";
import { radius } from "../../shared/theme/radius";
import { spacing } from "../../shared/theme/spacing";
import { AppButton } from "../../shared/ui/AppButton";
import { AppInput } from "../../shared/ui/AppInput";
import { AuthHeader } from "../../widgets/header/AuthHeader";
import { InlineMessage } from "../../shared/ui/InlineMessage";
import { shadowStyle } from "../../shared/theme/shadow";
import { isEmailValid, normalizeEmail } from "../../shared/validation/authValidation";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<{ tone: "error" | "info"; text: string } | null>(null);
  const { login, authError, loading: authLoading } = useAuth();
  const passwordRef = useRef<TextInput>(null);

  const handleSubmit = async () => {
    if (authLoading) {
      setMessage({ tone: "info", text: "Идёт инициализация авторизации." });
      return;
    }
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!isEmailValid(normalizeEmail(trimmedEmail))) {
      setMessage({ tone: "error", text: "Введите корректный e-mail." });
      return;
    }
    if (trimmedPassword.length < 6) {
      setMessage({ tone: "error", text: "Пароль должен быть не короче 6 символов." });
      return;
    }

    setLoading(true);
    const result = await login({ email: normalizeEmail(trimmedEmail), password: trimmedPassword });
    setLoading(false);

    if (result.success) {
      router.replace("/(tabs)/profile");
    } else {
      const error = result.error ?? authError;
      const text =
        error?.code === "invalid_credentials"
          ? "Неверный e-mail или пароль."
          : error?.code === "network_error"
            ? "Сервис авторизации недоступен или нет сети. Проверьте backend/подключение и попробуйте снова."
            : error?.code === "user_exists"
              ? "Пользователь с таким e-mail уже существует."
              : error?.message || "Сервис авторизации недоступен. Проверьте режим запуска (mock/api) и попробуйте снова.";
      setMessage({ tone: "error", text });
    }
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
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus?.()}
                disabled={loading}
              />
            </View>
            <View style={styles.inputGroup}>
              <AppInput
                ref={passwordRef}
                label="Пароль"
                value={password}
                onChangeText={setPassword}
                placeholder="Введите пароль"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                returnKeyType="done"
                onSubmitEditing={handleSubmit}
                disabled={loading}
                rightElement={(
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowPassword((v) => !v)}
                    disabled={loading}
                    accessibilityRole="button"
                    accessibilityLabel={showPassword ? "Скрыть пароль" : "Показать пароль"}
                  >
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color={colors.icon.muted}
                    />
                  </TouchableOpacity>
                )}
              />
            </View>

            <AppButton
              label="Войти"
              onPress={handleSubmit}
              disabled={loading}
              loading={loading}
              style={styles.submitButton}
            />

            <Text style={styles.registerLink}>
              У вас ещё нет аккаунта?{" "}
              <Text
                style={styles.registerLinkText}
                onPress={() => router.push("/(auth)/register")}
              >
                Зарегистрируйся
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface.neutral,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: spacing.xl,
  },
  formCard: {
    backgroundColor: colors.surface.primary,
    ...(shadowStyle({
      boxShadow: "0px 4px 12px rgba(0,0,0,0.10)",
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 4 },
      elevation: 8,
    }) as object),
    elevation: 8,
    padding: spacing.xl,
    borderRadius: radius.lg,
    gap: spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: "500",
    textAlign: "left",
    color: colors.text.primary,
  },
  inputGroup: {
    gap: spacing.xs,
  },
  eyeButton: {
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  submitButton: {
    marginTop: spacing.xl,
  },
  registerLink: {
    fontSize: 14,
    color: colors.text.subtle,
    textAlign: "center",
  },
  registerLinkText: {
    color: colors.brand.primary,
    fontWeight: "500",
    textDecorationLine: "underline",
  },
});
