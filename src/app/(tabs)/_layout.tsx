// src/app/(tabs)/_layout.tsx — ✅ УПРОЩЁННЫЙ!
import { Tabs } from "expo-router";

export default function TabLayout() {
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
    </Tabs>
  );
}
