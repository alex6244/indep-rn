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

export default function LoginScreen() {
  const [loginValue, setLoginValue] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async () => {
    if (!loginValue || !password) {
      alert("Введите логин и пароль");
      return;
    }

    setLoading(true);
    const success = await login(loginValue, password);
    setLoading(false);

    if (success) {
      router.back(); // Закрыть модалку → вернуться в профиль/предыдущий экран
    } else {
      alert("Неверный логин или пароль");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formCard}>
          <Text style={styles.title}>Войти</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Логин</Text>
            <TextInput
              style={styles.input}
              value={loginValue}
              onChangeText={setLoginValue}
              placeholder="client@test.com"
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
              placeholder="Пароль"
              secureTextEntry
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
              Зарегистрироваться
            </Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
