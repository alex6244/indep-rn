// src/app/(tabs)/_layout.tsx — ✅ УПРОЩЁННЫЙ!
import { Tabs } from "expo-router";
import React, { useEffect } from "react";

export default function TabLayout() {
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
        runId: "route-check",
        hypothesisId: "H1",
        location: "src/app/(tabs)/_layout.tsx:TabLayout.useEffect",
        message: "tabs_layout_mounted",
        data: {
          screens: ["index", "catalog", "chat", "calls", "profile", "favorites(hidden)"],
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#DB4431",
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Главная" }} />
      <Tabs.Screen name="catalog" options={{ title: "Каталог" }} />
      <Tabs.Screen name="chat" options={{ title: "Чат" }} />
      <Tabs.Screen name="calls" options={{ title: "Звонки" }} />
      <Tabs.Screen name="profile" options={{ title: "Профиль" }} />
      <Tabs.Screen name="favorites" options={{ href: null }} />
    </Tabs>
  );
}
