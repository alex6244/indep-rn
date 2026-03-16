// src/app/_layout.tsx ← ДОБАВЬ AuthProvider ВЕРХОМ!
import { Stack } from "expo-router";
import { AuthProvider } from "../contexts/AuthContext";
import { FavoritesProvider } from "../contexts/FavoritesContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#F7F7F7" },
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" options={{ presentation: "modal" }} />
          <Stack.Screen name="auto/[id]" />
        </Stack>
      </FavoritesProvider>
    </AuthProvider>
  );
}
