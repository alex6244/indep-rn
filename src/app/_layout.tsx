import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { LogBox } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "../contexts/AuthContext";
import { FavoritesProvider } from "../contexts/FavoritesContext";
import { ErrorBoundary } from "../shared/ui/ErrorBoundary";
import { FONT_SOURCES } from "../shared/theme/fonts";

let warningsSuppressed = false;

function isDeprecatedWebWarning(args: unknown[]) {
  return args.some(
    (a) =>
      typeof a === "string" &&
      (a.includes('"shadow*" style props are deprecated') ||
        a.includes("props.pointerEvents is deprecated")),
  );
}

function suppressDeprecatedWebWarnings() {
  if (warningsSuppressed) return;
  warningsSuppressed = true;

  const origWarn = console.warn;
  const origError = console.error;

  console.warn = (...args: unknown[]) => {
    if (isDeprecatedWebWarning(args)) return;
    origWarn(...args);
  };
  console.error = (...args: unknown[]) => {
    if (isDeprecatedWebWarning(args)) return;
    origError(...args);
  };
}

suppressDeprecatedWebWarnings();

export default function RootLayout() {
  const [fontsLoaded] = useFonts(FONT_SOURCES);

  useEffect(() => {
    // External web/runtime deprecations (react-native-web/devtools) still emit in dev.
    LogBox.ignoreLogs([
      '"shadow*" style props are deprecated. Use "boxShadow".',
      "props.pointerEvents is deprecated. Use style.pointerEvents",
    ]);
  }, []);

  useEffect(() => {
    // Keep splash visible until fonts are loaded (prevents blank screen).
    void SplashScreen.preventAutoHideAsync();
  }, []);

  // #region agent log
  useEffect(() => {
    fetch("http://127.0.0.1:7505/ingest/90ad6a03-168e-422b-be89-831782cd6f2b", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "7a6ed6",
      },
      body: JSON.stringify({
        sessionId: "7a6ed6",
        runId: "pre-fix",
        hypothesisId: "H1",
        location: "src/app/_layout.tsx:RootLayout",
        message: "App RootLayout mounted",
        data: { fontsLoaded },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
  }, [fontsLoaded]);
  // #endregion

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
