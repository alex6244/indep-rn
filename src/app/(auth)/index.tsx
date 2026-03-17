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
import { normalizePhone } from "../../shared/utils/phone";

export default function LoginScreen() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, loading: authLoading } = useAuth();

  const handleSubmit = async () => {
    if (authLoading) {
      alert("Подождите, идёт инициализация авторизации");
      return;
    }
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      alert("Введите имя (минимум 2 символа)");
      return;
    }

    if (trimmedName.length < 2) {
      alert("Имя слишком короткое");
      return;
    }

    const phoneRegex =
      /^(\+7|7|8)?[\s-]?\(?[0-9]{3}\)?[\s-]?[0-9]{3}[\s-]?[0-9]{2}[\s-]?[0-9]{2}$/;
    if (!trimmedPhone || !phoneRegex.test(trimmedPhone)) {
      alert("Введите корректный номер телефона в формате +7 XXX XXX-XX-XX");
      return;
    }

    const normalizedPhone = normalizePhone(trimmedPhone);
    if (!normalizedPhone) {
      alert("Введите корректный номер телефона в формате +7 XXX XXX-XX-XX");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      alert("Введите корректный e-mail");
      return;
    }

    setLoading(true);
    const success = await login(trimmedName, trimmedPhone, trimmedEmail);
    setLoading(false);

    if (success) {
      router.replace("/");
    } else {
      alert("Пользователь с таким телефоном и почтой не найден");
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
              <Text style={styles.label}>Телефон</Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="+7 (_) _--"
                keyboardType="phone-pad"
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

            <TouchableOpacity style={styles.checkboxContainer}>
              <View style={styles.checkbox}>
                <Text style={styles.checkmark}>✓</Text>
              </View>
              <Text style={styles.checkboxText}>
                Даю согласие на{" "}
                <Text style={styles.link}>обработку персональных данных</Text>
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.submitButton, loading && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
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
    backgroundColor: "#DB4431",
    justifyContent: "center",
    alignItems: "center",
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
