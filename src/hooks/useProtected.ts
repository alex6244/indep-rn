import { useEffect } from "react";
import { useRouter, type Href } from "expo-router";
import { useAuth } from "../contexts/AuthContext";

type CheckAuthOptions = {
  redirectTo?: Href;
};

/** Защита действий (кнопок). Возвращает false и редиректит на auth если нет сессии. */
export function useProtected() {
  const { user } = useAuth();
  const router = useRouter();

  const checkAuth = (options: CheckAuthOptions = {}) => {
    const {
      redirectTo = "/(auth)" as Href,
    } = options;

    if (!user) {
      router.push(redirectTo);
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
      router.replace(redirectTo);
    }
  }, [loading, user, router, redirectTo]);

  return { user, loading };
}

