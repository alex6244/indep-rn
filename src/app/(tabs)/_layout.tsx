// src/app/(tabs)/_layout.tsx — ✅ УПРОЩЁННЫЙ!
import { Tabs } from "expo-router";
import React, { useEffect } from "react";

export default function TabLayout() {
  useEffect(() => {
    // #region agent log
    fetch(
      "http://127.0.0.1:7574/ingest/90ad6a03-168e-422b-be89-831782cd6f2b",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Debug-Session-Id": "7a6ed6",
        },
        body: JSON.stringify({
          sessionId: "7a6ed6",
          runId: "route-debug",
          hypothesisId: "H3_SRC_TABS_LAYOUT_MOUNT",
          location: "src/app/(tabs)/_layout.tsx:TabLayout.useEffect",
          message: "src_tabs_layout_mounted",
          data: { path: "/(tabs)/" },
          timestamp: Date.now(),
        }),
      }
    ).catch(() => {});
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
      <Tabs.Screen name="calls" options={{ title: "Позвонить" }} />
      <Tabs.Screen name="profile" options={{ title: "Профиль" }} />
      {/* Hidden tab route: accessible via /favorites but not shown in the tab bar */}
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Избранное",
          tabBarButton: () => null,
        }}
      />
    </Tabs>
  );
}
