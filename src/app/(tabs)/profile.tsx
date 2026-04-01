import { useRouter, type Href } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { ClientProfileSection } from "../../widgets/profile/ClientProfileSection";
import { PickerProfileSection } from "../../widgets/profile/PickerProfileSection";
import { styles } from "./profile.styles";

export default function ProfileTab() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#DB4431" />
        <Text style={styles.centerText}>Загрузка профиля...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.screen}>
        <View style={styles.card}>
          <Text style={styles.lockEmoji}>🚫</Text>
          <Text style={styles.cardTitle}>Вы не авторизованы</Text>
          <Text style={styles.cardSubtitle}>
            Войдите или зарегистрируйтесь, чтобы получать доступ к профилю,
            избранному и историям отчётов.
          </Text>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push("/(auth)" as Href)}
          >
            <Text style={styles.primaryButtonText}>Войти</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push("/(auth)/register" as Href)}
          >
            <Text style={styles.secondaryButtonText}>Регистрация</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const initials = getInitials(user.name || user.login);
  const isPicker = user.role === "picker";

  if (isPicker) {
    return (
      <PickerProfileSection
        initials={initials}
        phone={user.phone}
        name={user.name || user.login}
        onLogout={logout}
      />
    );
  }

  return (
    <ClientProfileSection
      name={user.name || user.login}
      phone={user.phone}
      onLogout={logout}
    />
  );
}

function getInitials(name: string): string {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (
    parts[0].charAt(0).toUpperCase() +
    parts[parts.length - 1].charAt(0).toUpperCase()
  );
}
