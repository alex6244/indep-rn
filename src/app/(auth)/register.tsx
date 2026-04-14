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
import { useAuth } from "../../contexts/AuthContext";
import { FONT_FAMILY } from "../../shared/theme/fonts";
import { InlineMessage } from "../../shared/ui/InlineMessage";
import { shadowStyle } from "../../shared/theme/shadow";
import { AuthHeader } from "../../widgets/header/AuthHeader";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      setMessage({ tone: "error", text: "Введите корректный e-mail." });
      return;
    }

    if (password.trim().length < 6) {
      setMessage({ tone: "error", text: "Пароль должен быть не короче 6 символов." });
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
        email: trimmedEmail,
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
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Минимум 6 символов"
                secureTextEntry
                autoCapitalize="none"
                editable={!loading}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Подтверждение пароля</Text>
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Повторите пароль"
                secureTextEntry
                autoCapitalize="none"
                editable={!loading}
              />
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
    backgroundColor: "#F7F7F7",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    ...(shadowStyle({
      boxShadow: "0px 4px 12px rgba(0,0,0,0.10)",
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 4 },
      elevation: 8,
    }) as object),
    elevation: 8,
    padding: 32,
    borderRadius: 20,
    gap: 20,
  },
  title: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: 28,
    fontWeight: "600",
    textAlign: "center",
    color: "#080717",
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#080717",
  },
  input: {
    backgroundColor: "#F8F8F8",
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    color: "#080717",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#DB4431",
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#DB4431",
  },
  checkmark: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  checkboxText: {
    fontSize: 14,
    flex: 1,
    color: "#666",
    lineHeight: 20,
  },
  link: {
    color: "#DB4431",
    fontWeight: "500",
    textDecorationLine: "underline",
  },
  submitButton: {
    backgroundColor: "#DB4431",
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  submitText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  loadingText: {
    color: "white",
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
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#FFFFFF",
  },
  roleOptionActive: {
    borderColor: "#DB4431",
    backgroundColor: "#FDEBE8",
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#C4C4C4",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  radioOuterActive: {
    borderColor: "#DB4431",
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#DB4431",
  },
  roleText: {
    fontSize: 14,
    color: "#080717",
  },
  loginLinkWrapper: {
    marginTop: 4,
    alignItems: "center",
  },
  loginQuestion: {
    fontSize: 13,
    color: "#A0A0A0",
  },
  loginLink: {
    color: "#DB4431",
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});
