import { useRouter, type Href } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { ClientProfileSection } from "../../widgets/profile/ClientProfileSection";
import { PickerProfileSection } from "../../widgets/profile/PickerProfileSection";
import { styles } from "../../shared/styles/profile.styles";
import { ScreenStateEmpty } from "../../shared/ui/ScreenStateEmpty";
import { ScreenStateLoading } from "../../shared/ui/ScreenStateLoading";
import { reportsService } from "../../services/reportsService";
import type { Report } from "../../types/report";

export default function ProfileTab() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [clientReports, setClientReports] = React.useState<Report[]>([]);
  const [reportsLoading, setReportsLoading] = React.useState(false);
  const [reportsError, setReportsError] = React.useState<string | null>(null);

  const loadClientReports = React.useCallback(async () => {
    setReportsLoading(true);
    setReportsError(null);
    try {
      const next = await reportsService.getPurchasedReports();
      setClientReports(next);
    } catch (e) {
      setClientReports([]);
      setReportsError(e instanceof Error ? e.message : "Не удалось загрузить отчёты.");
    } finally {
      setReportsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (!loading && user?.role === "client") {
      void loadClientReports();
    }
  }, [loading, user?.role, loadClientReports]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ScreenStateLoading message="Загрузка профиля..." />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.screen}>
        <View style={styles.card}>
          <Text style={styles.lockEmoji}>🚫</Text>
          <ScreenStateEmpty
            title="Вы не авторизованы"
            subtitle="Войдите или зарегистрируйтесь, чтобы получать доступ к профилю, избранному и историям отчётов."
          />

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push("/(auth)" as Href)}
          >
            <Text style={styles.primaryButtonText}>Войти</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push("/(auth)/register" as Href)}
          >
            <Text style={styles.secondaryButtonText}>Регистрация</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const initials = getInitials(user.name || user.login);
  const isPicker = user.role === "picker";

  if (isPicker) {
    return (
      <PickerProfileSection
        initials={initials}
        phone={user.phone}
        name={user.name || user.login}
        onLogout={logout}
      />
    );
  }

  return (
    <ClientProfileSection
      name={user.name || user.login}
      phone={user.phone}
      onLogout={logout}
      reports={clientReports}
      loading={reportsLoading}
      error={reportsError}
      onRetry={() => {
        void loadClientReports();
      }}
    />
  );
}

function getInitials(name: string): string {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (
    parts[0].charAt(0).toUpperCase() +
    parts[parts.length - 1].charAt(0).toUpperCase()
  );
}
