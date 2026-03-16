// app/(tabs)/index.tsx — ТВОЙ ProfileScreen в табах
import { Link, router } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../src/contexts/AuthContext";

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  if (!user) {
    return null; // AuthGuard в _layout.tsx
  }

  return (
    <View style={styles.container}>
      {/* Профиль */}
      <View style={styles.profileCard}>
        <Image
          source={{ uri: "https://via.placeholder.com/80" }}
          style={styles.avatar}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.role}>
            {user.role === "client" ? "Клиент" : "Подборщик"}
          </Text>
          <Text style={styles.phone}>{user.phone}</Text>
        </View>
      </View>

      {/* Навигация */}
      <View style={styles.navContainer}>
        <Link href="/(tabs)/catalog" asChild>
          <TouchableOpacity style={styles.navButton}>
            <Text style={styles.navButtonText}>Каталог авто</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/(tabs)/favorites" asChild>
          <TouchableOpacity style={styles.navButton}>
            <Text style={styles.navButtonText}>Избранное</Text>
          </TouchableOpacity>
        </Link>

        <TouchableOpacity
          style={[styles.navButton, styles.logoutButton]}
          onPress={logout}
        >
          <Text style={styles.logoutText}>Выйти</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
    padding: 20,
  },
  profileCard: {
    backgroundColor: "white",
    flexDirection: "row",
    padding: 24,
    borderRadius: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
    color: "#080717",
    marginBottom: 4,
  },
  role: {
    fontSize: 16,
    color: "#DB4431",
    fontWeight: "600",
    marginBottom: 8,
  },
  phone: {
    fontSize: 16,
    color: "#666",
  },
  navContainer: {
    gap: 12,
  },
  navButton: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#080717",
  },
  logoutButton: {
    backgroundColor: "#F8F8F8",
    borderWidth: 1,
    borderColor: "#DB4431",
  },
  logoutText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#DB4431",
  },
});
