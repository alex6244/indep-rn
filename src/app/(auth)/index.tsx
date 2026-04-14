// src/app/(auth)/index.tsx — экран логина
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
import { AuthHeader } from "../../widgets/header/AuthHeader";
import { InlineMessage } from "../../shared/ui/InlineMessage";
import { shadowStyle } from "../../shared/theme/shadow";
import { isEmailValid, normalizeEmail } from "../../shared/validation/authValidation";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [message, setMessage] = useState<{ tone: "error" | "info"; text: string } | null>(null);
  const { login, authError, loading: authLoading } = useAuth();

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
                placeholder="Введите пароль"
                secureTextEntry
                autoCapitalize="none"
                editable={!loading}
              />
            </View>

            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setAgreed((v) => !v)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
                {agreed && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.checkboxText}>
                Даю согласие на{" "}
                <Text style={styles.link}>обработку персональных данных</Text>
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.submitButton, (!agreed || loading) && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={!agreed || loading}
            >
              {loading ? (
                <Text style={styles.loadingText}>Загрузка...</Text>
              ) : (
                <Text style={styles.submitText}>Войти</Text>
              )}
            </TouchableOpacity>

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
    padding: 20,
    borderRadius: 16,
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "500",
    textAlign: "left",
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    color: "#080717",
  },
  input: {
    backgroundColor: "#F8F8F8",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    color: "#080717",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
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
    fontSize: 14,
    fontWeight: "bold",
  },
  checkboxText: {
    fontSize: 14,
    flex: 1,
  },
  link: {
    color: "#DB4431",
    textDecorationLine: "underline",
  },
  submitButton: {
    backgroundColor: "#DB4431",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 24,
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  submitText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  loadingText: {
    color: "white",
    fontSize: 16,
  },
  registerLink: {
    fontSize: 14,
    color: "#A0A0A0",
    textAlign: "center",
  },
  registerLinkText: {
    color: "#DB4431",
    fontWeight: "500",
    textDecorationLine: "underline",
  },
});
