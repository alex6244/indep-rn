import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "../contexts/AuthContext";
import { FavoritesProvider } from "../contexts/FavoritesContext";
import { ErrorBoundary } from "../shared/ui/ErrorBoundary";
import { FONT_SOURCES } from "../shared/theme/fonts";

export default function RootLayout() {
  const [fontsLoaded] = useFonts(FONT_SOURCES);

  useEffect(() => {
    // Keep splash visible until fonts are loaded (prevents blank screen).
    void SplashScreen.preventAutoHideAsync();
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      void SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  return (
    <ErrorBoundary>
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
              <Stack.Screen name="selection-confirm" />
              <Stack.Screen name="auto/[id]" />
            </Stack>
          </FavoritesProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
