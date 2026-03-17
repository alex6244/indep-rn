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
import { normalizePhone } from "../../shared/utils/phone";
import { AuthHeader } from "../../widgets/header/AuthHeader";
import { MobileMenu } from "../../widgets/mobileMenu/MobileMenu";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"client" | "picker">("picker");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleRegister = async () => {
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
    try {
      const success = await register(trimmedName, trimmedPhone, trimmedEmail, role);
      if (success) {
        alert(`✅ Зарегистрирован!\n${trimmedName}\nТелефон: ${trimmedPhone}`);
        // После успешной регистрации отправляем на главную
        router.replace("/");
      } else {
        alert("Пользователь с таким телефоном или почтой уже существует");
      }
    } catch (error) {
      alert("Ошибка регистрации");
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
            <TouchableOpacity style={styles.checkboxContainer}>
              <View style={styles.checkbox}>
                <Text style={styles.checkmark}>✓</Text>
              </View>
              <Text style={styles.checkboxText}>
                Я согласен с <Text style={styles.link}>политикой</Text> и{" "}
                <Text style={styles.link}>обработки персональных данных</Text>
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
      <MobileMenu
  active="home"
  onPress={(key) => {
    // сюда твоя логика: навигация или редирект
    // например: если не залогинен — router.push("/(auth)/register")
    // если залогинен — router.push в нужный таб по key
  }}
/>
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
    padding: 32,
    borderRadius: 20,
    gap: 20,
  },
  title: {
    fontFamily: "ModerusticBold",
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
    backgroundColor: "#F3E4E2",
    justifyContent: "center",
    alignItems: "center",
  },
  checkmark: {
    color: "#DB4431",
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
  header: {
    height: 56,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
  },
  headerLogoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerLogoText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E1E1E",
    // fontFamily: "ModerusticBold",
  },
  headerBurger: {
    width: 24,
    height: 24,
    justifyContent: "space-between",
    paddingVertical: 2,
  },
  headerBurgerLine: {
    height: 3,
    borderRadius: 2,
    backgroundColor: "#1E1E1E",
  },
  headerLogoImage: {
    width: 120,          // подгони под размер из Фигмы
    height: 24,          // подгони под размер из Фигмы
    resizeMode: "contain",
  },
  
});
