// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import React, { useEffect } from "react";
import { AuthProvider, useAuth } from "../../src/contexts/AuthContext"; // 👈 ДОБАВЬ!

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

function TabContent() {
  const { user, loading } = useAuth();
  const colorScheme = useColorScheme();
  const themeKey = colorScheme === "dark" ? "dark" : "light";

  useEffect(() => {
    // #region agent log
    fetch("http://127.0.0.1:7574/ingest/90ad6a03-168e-422b-be89-831782cd6f2b", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "7a6ed6",
      },
      body: JSON.stringify({
        sessionId: "7a6ed6",
        runId: "route-debug",
        hypothesisId: "H4_LEGACY_TABS_LAYOUT_MOUNT",
        location: "app/(tabs)/_layout.tsx:TabContent.useEffect",
        message: "legacy_tabs_layout_mounted",
        data: { path: "/(legacy)/tabs" },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
  }, []);

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
        tabBarActiveTintColor: Colors[themeKey].tint,
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
  return (
    <AuthProvider>
      {" "}
      {/* 👈 ВСЕ табы внутри AuthContext */}
      <TabContent />
    </AuthProvider>
  );
}
