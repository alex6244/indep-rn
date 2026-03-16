// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import React from "react";
import { AuthProvider, useAuth } from "../../src/contexts/AuthContext"; // 👈 ДОБАВЬ!

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

function TabContent() {
  const { user, loading } = useAuth();

  // Пока грузится — спиннер
  if (loading) {
    return null; // Tabs покажутся с loading внутри
  }

  // Нет user → редирект на аутентификацию
  if (!user) {
    return null; // Expo Router сам вернется на index.tsx
  }

  // Есть user → показываем табы
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="paperplane.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      {" "}
      {/* 👈 ВСЕ табы внутри AuthContext */}
      <TabContent />
    </AuthProvider>
  );
}
