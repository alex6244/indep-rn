import { Alert } from "react-native";
import { useRouter, type Href } from "expo-router";
import { useAuth } from "../contexts/AuthContext";

type CheckAuthOptions = {
  message?: string;
  redirectTo?: Href;
};

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

