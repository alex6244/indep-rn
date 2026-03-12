import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter, type Href } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";
import { useProtected } from "../../hooks/useProtected";

export default function ProfileTab() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const { checkAuth } = useProtected();

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
  const roleLabel = user.role === "picker" ? "Подборщик" : "Клиент";

  const handleMyAds = () => {
    if (
      !checkAuth({
        message: "Войдите, чтобы просмотреть свои объявления",
      })
    ) {
      return;
    }
    // TODO: когда появится экран объявлений, заменить путь
    // router.push("/my-ads" as Href);
  };

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <View style={styles.avatarWrapper}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
        </View>

        <Text style={styles.cardTitle}>
          Привет, {user.name || user.login}!
        </Text>

        {!!user.phone && (
          <Text style={styles.cardSubtitle}>📱 {user.phone}</Text>
        )}

        <View style={styles.roleBadge}>
          <Text style={styles.roleBadgeText}>Роль: {roleLabel}</Text>
        </View>
      </View>

      <View style={styles.actionsCard}>
        <TouchableOpacity style={styles.actionButton} onPress={handleMyAds}>
          <Text style={styles.actionButtonTitle}>Мои объявления</Text>
          <Text style={styles.actionButtonSubtitle}>
            Смотреть добавленные отчёты и автомобили
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutButtonText}>Выйти из аккаунта</Text>
        </TouchableOpacity>
      </View>
    </View>
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

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F7F7F7",
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  center: {
    flex: 1,
    backgroundColor: "#F7F7F7",
    justifyContent: "center",
    alignItems: "center",
  },
  centerText: {
    marginTop: 12,
    fontSize: 14,
    color: "#555",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
    marginBottom: 16,
    alignItems: "center",
  },
  lockEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1E1E1E",
    textAlign: "center",
    marginTop: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: "#555",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 18,
  },
  avatarWrapper: {
    marginBottom: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#DB4431",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 30,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  roleBadge: {
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#F3E4E2",
  },
  roleBadgeText: {
    fontSize: 12,
    color: "#DB4431",
    fontWeight: "600",
  },
  primaryButton: {
    marginTop: 20,
    alignSelf: "stretch",
    backgroundColor: "#DB4431",
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    marginTop: 10,
    alignSelf: "stretch",
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DB4431",
    backgroundColor: "#FFFFFF",
  },
  secondaryButtonText: {
    color: "#DB4431",
    fontSize: 16,
    fontWeight: "600",
  },
  actionsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    marginTop: 8,
  },
  actionButton: {
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: "#F7F7F7",
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  actionButtonTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E1E1E",
  },
  actionButtonSubtitle: {
    fontSize: 12,
    color: "#777",
    marginTop: 4,
  },
  logoutButton: {
    marginTop: 4,
    alignSelf: "stretch",
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 14,
    backgroundColor: "#1E1E1E",
  },
  logoutButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
});

