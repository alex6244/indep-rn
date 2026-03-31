import { useEffect } from "react";
import { Alert } from "react-native";
import { useRouter, type Href } from "expo-router";
import { useAuth } from "../contexts/AuthContext";

type CheckAuthOptions = {
  message?: string;
  redirectTo?: Href;
};

/** Защита действий (кнопок). Показывает алерт если не залогинен. */
export function useProtected() {
  const { user } = useAuth();
  const router = useRouter();

  const checkAuth = (options: CheckAuthOptions = {}) => {
    const {
      message = "Для этого действия требуется авторизация",
      redirectTo = "/(auth)" as Href,
    } = options;

    if (!user) {
      Alert.alert("Доступ ограничен", message, [
        { text: "Отмена", style: "cancel" },
        {
          text: "Войти",
          style: "default",
          onPress: () => router.push(redirectTo),
        },
      ]);
      return false;
    }

    return true;
  };

  return { user, checkAuth };
}

/** Защита экранов. Редиректит на авторизацию до рендера контента. */
export function useRequireAuth(redirectTo: Href = "/(auth)" as Href) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
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
            runId: "pre",
            hypothesisId: "H5",
            location: "useProtected.ts:useRequireAuth:redirect",
            message: "Redirect triggered when not authenticated",
            data: { loading: Boolean(loading), hasUser: Boolean(user) },
            timestamp: Date.now(),
          }),
        },
      ).catch(() => {});
      // #endregion
      router.replace(redirectTo);
    }
  }, [loading, user, router, redirectTo]);

  return { user, loading };
}

