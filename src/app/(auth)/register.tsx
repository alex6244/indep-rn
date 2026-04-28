// src/app/(auth)/register.tsx — ✅ ГОТОВЫЙ!
import { router } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../contexts/AuthContext";
import { colors } from "../../shared/theme/colors";
import { FONT_FAMILY } from "../../shared/theme/fonts";
import { radius } from "../../shared/theme/radius";
import { spacing } from "../../shared/theme/spacing";
import { InlineMessage } from "../../shared/ui/InlineMessage";
import { shadowStyle } from "../../shared/theme/shadow";
import { AuthHeader } from "../../widgets/header/AuthHeader";
import {
  getPasswordStrength,
  isEmailValid,
  normalizeEmail,
} from "../../shared/validation/authValidation";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState<"client" | "picker">("picker");
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [message, setMessage] = useState<{ tone: "error"; text: string } | null>(null);
  const { register, authError } = useAuth();

  const handleRegister = async () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      setMessage({ tone: "error", text: "Введите имя (минимум 2 символа)." });
      return;
    }

    if (trimmedName.length < 2) {
      setMessage({ tone: "error", text: "Имя слишком короткое." });
      return;
    }

    const normalizedEmail = normalizeEmail(trimmedEmail);
    if (!isEmailValid(normalizedEmail)) {
      setMessage({ tone: "error", text: "Введите корректный e-mail." });
      return;
    }

    const { isStrongEnough, feedback } = getPasswordStrength(password.trim(), [
      trimmedName,
      normalizedEmail,
    ]);
    if (!isStrongEnough) {
      setMessage({ tone: "error", text: feedback ?? "Придумайте более надёжный пароль." });
      return;
    }

    if (password !== confirmPassword) {
      setMessage({ tone: "error", text: "Пароли не совпадают." });
      return;
    }

    setLoading(true);
    try {
      const result = await register({
        name: trimmedName,
        email: normalizeEmail(trimmedEmail),
        password: password.trim(),
        role,
      });
      if (result.success) {
        router.replace("/(tabs)/profile");
      } else {
        const error = result.error ?? authError;
        const text =
          error?.code === "user_exists"
            ? "Пользователь с таким e-mail уже существует."
            : error?.code === "network_error"
              ? "Сервис авторизации недоступен или нет сети. Проверьте backend/подключение и попробуйте снова."
              : error?.code === "invalid_credentials"
                ? "Неверный e-mail или пароль."
                : error?.message || "Сервис авторизации недоступен. Проверьте режим запуска (mock/api) и попробуйте снова.";
        setMessage({ tone: "error", text });
      }
    } finally {
      setLoading(false);
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
            <Text style={styles.title}>Зарегистрируйтесь</Text>
            {message ? <InlineMessage tone={message.tone} message={message.text} /> : null}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Имя</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Укажите ваше имя"
                editable={!loading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Почта</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="name@example.com"
                autoCapitalize="none"
                keyboardType="email-address"
                editable={!loading}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Пароль</Text>
              <View style={styles.passwordWrap}>
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Придумайте надежный пароль"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  editable={!loading}
                />
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
              </View>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Подтверждение пароля</Text>
              <View style={styles.passwordWrap}>
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Повторите пароль"
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  editable={!loading}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowConfirmPassword((v) => !v)}
                  disabled={loading}
                  accessibilityRole="button"
                  accessibilityLabel={showConfirmPassword ? "Скрыть пароль" : "Показать пароль"}
                >
                  <Ionicons
                    name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color={colors.icon.muted}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Тип пользователя */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Тип пользователя</Text>
              <View style={styles.roleRow}>
                <TouchableOpacity
                  style={[
                    styles.roleOption,
                    role === "picker" && styles.roleOptionActive,
                  ]}
                  activeOpacity={0.8}
                  disabled={loading}
                  onPress={() => setRole("picker")}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: role === "picker", disabled: loading }}
                  accessibilityLabel="Тип пользователя: Подборщик"
                >
                  <View
                    style={[
                      styles.radioOuter,
                      role === "picker" && styles.radioOuterActive,
                    ]}
                  >
                    {role === "picker" && <View style={styles.radioInner} />}
                  </View>
                  <Text style={styles.roleText}>Подборщик</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.roleOption,
                    role === "client" && styles.roleOptionActive,
                  ]}
                  activeOpacity={0.8}
                  disabled={loading}
                  onPress={() => setRole("client")}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: role === "client", disabled: loading }}
                  accessibilityLabel="Тип пользователя: Ищу авто"
                >
                  <View
                    style={[
                      styles.radioOuter,
                      role === "client" && styles.radioOuterActive,
                    ]}
                  >
                    {role === "client" && <View style={styles.radioInner} />}
                  </View>
                  <Text style={styles.roleText}>Ищу авто</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Чекбокс согласия */}
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setAgreed((v) => !v)}
              activeOpacity={0.7}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: agreed }}
              accessibilityLabel="Согласие с политикой и обработкой персональных данных"
            >
              <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
                {agreed && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.checkboxText}>
                Я согласен с <Text style={styles.link}>политикой</Text> и{" "}
                <Text style={styles.link}>обработки персональных данных</Text>
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.submitButton, (!agreed || loading) && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={!agreed || loading}
            >
              {loading ? (
                <Text style={styles.loadingText}>Регистрация...</Text>
              ) : (
                <Text style={styles.submitText}>Ок</Text>
              )}
            </TouchableOpacity>

            {/* Линк: уже есть аккаунт */}
            <TouchableOpacity
              style={styles.loginLinkWrapper}
              onPress={() => {
                if (!loading) {
                  router.back();
                }
              }}
              disabled={loading}
            >
              <Text style={styles.loginQuestion}>
                Уже есть аккаунт? <Text style={styles.loginLink}>Войти</Text>
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
      shadowColor: colors.text.primary,
      shadowOpacity: 0.1,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 4 },
      elevation: 8,
    }) as object),
    elevation: 8,
    padding: spacing.xxxl,
    borderRadius: radius.lg + 4,
    gap: spacing.xl,
  },
  title: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: 28,
    fontWeight: "600",
    textAlign: "center",
    color: colors.text.primary,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text.primary,
  },
  input: {
    backgroundColor: colors.surface.input,
    padding: spacing.lg,
    borderRadius: radius.md,
    fontSize: 16,
    color: colors.text.primary,
  },
  passwordWrap: {
    position: "relative",
  },
  passwordInput: {
    paddingRight: 40,
  },
  eyeButton: {
    position: "absolute",
    right: 10,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: radius.sm - 2,
    borderWidth: 2,
    borderColor: colors.brand.primary,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: colors.brand.primary,
  },
  checkmark: {
    color: colors.text.inverse,
    fontSize: 16,
    fontWeight: "bold",
  },
  checkboxText: {
    fontSize: 14,
    flex: 1,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  link: {
    color: colors.brand.primary,
    fontWeight: "500",
    textDecorationLine: "underline",
  },
  submitButton: {
    backgroundColor: colors.brand.primary,
    minHeight: 44,
    paddingVertical: 18,
    borderRadius: radius.md + 2,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: {
    backgroundColor: colors.surface.placeholder,
  },
  submitText: {
    color: colors.text.inverse,
    fontSize: 18,
    fontWeight: "600",
  },
  loadingText: {
    color: colors.text.inverse,
    fontSize: 16,
  },
  roleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 8,
  },
  roleOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border.input,
    backgroundColor: colors.surface.primary,
    minHeight: 44,
  },
  roleOptionActive: {
    borderColor: colors.brand.primary,
    backgroundColor: colors.status.warningBg,
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: colors.border.input,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  radioOuterActive: {
    borderColor: colors.brand.primary,
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.brand.primary,
  },
  roleText: {
    fontSize: 14,
    color: colors.text.primary,
  },
  loginLinkWrapper: {
    marginTop: 4,
    alignItems: "center",
  },
  loginQuestion: {
    fontSize: 13,
    color: colors.text.subtle,
  },
  loginLink: {
    color: colors.brand.primary,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});
