import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "../contexts/AuthContext";
import { FavoritesProvider } from "../contexts/FavoritesContext";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
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
    </SafeAreaProvider>
  );
}
