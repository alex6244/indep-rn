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

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
   const [role, setRole] = useState<"client" | "picker">("picker");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleRegister = async () => {
    if (!name || !phone) {
      alert("Заполните имя и телефон");
      return;
    }

    setLoading(true);
    try {
      const success = await register(name, phone, role);
      if (success) {
        alert(`✅ Зарегистрирован!\n${name}\nТелефон: ${phone}`);
        router.back(); // ← Назад к логину или профилю
      } else {
        alert("Ошибка регистрации");
      }
    } catch (error) {
      alert("Ошибка регистрации");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formCard}>
          <Text style={styles.title}>Зарегистрироваться</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Имя</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Иван Иванов"
              editable={!loading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Телефон</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="+7 (999) 123-45-67"
              keyboardType="phone-pad"
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
                <Text style={styles.roleText}>Клиент</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Чекбокс согласия */}
          <TouchableOpacity style={styles.checkboxContainer}>
            <View style={styles.checkbox}>
              <Text style={styles.checkmark}>✓</Text>
            </View>
            <Text style={styles.checkboxText}>
              Согласен с <Text style={styles.link}>условиями</Text> и{" "}
              <Text style={styles.link}>политикой конфиденциальности</Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <Text style={styles.loadingText}>Регистрация...</Text>
            ) : (
              <Text style={styles.submitText}>Зарегистрироваться</Text>
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
              Уже есть аккаунт?{" "}
              <Text style={styles.loginLink}>Войти</Text>
            </Text>
          </TouchableOpacity>
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
    padding: 32,
    borderRadius: 20,
    gap: 20,
  },
  title: {
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
    backgroundColor: "#DB4431",
    justifyContent: "center",
    alignItems: "center",
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
