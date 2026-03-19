import { BurgerMenu } from "@/src/shared/ui/BurgerMenu";
import { useRouter, type Href } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AboutIcon from "../../assets/icons/burger/about.svg";
import CooperationIcon from "../../assets/icons/burger/ads.svg";
import FavIcon from "../../assets/icons/burger/favourites.svg";
import LogoutIcon from "../../assets/icons/burger/logout.svg";
import SelectionIcon from "../../assets/icons/burger/selection.svg";
import { useAuth } from "../../contexts/AuthContext";
import { PickerProfileHeader } from "../../widgets/profile/PickerProfileHeader";
import { ProfileStats } from "../../widgets/profile/ProfileStats";
import { ReportsBanner } from "../../widgets/profile/ReportsBanner";
import { ClientEmptyState } from "../../widgets/profile/ClientEmptyState";
import { ClientProfileHeader } from "../../widgets/profile/ClientProfileHeader";
import { ClientReportCard } from "../../widgets/profile/ClientReportCard";
import { ProfileEditMenu } from "../../widgets/profile/ProfileEditMenu";
import { ProfileQuickActions } from "../../widgets/profile/ProfileQuickActions";
import { useProfileEditFlow } from "../../widgets/profile/useProfileEditFlow";

export default function ProfileTab() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#DB4431" />
        <Text style={styles.centerText}>Загрузка профиля...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.screen}>
        <View style={styles.card}>
          <Text style={styles.lockEmoji}>🚫</Text>
          <Text style={styles.cardTitle}>Вы не авторизованы</Text>
          <Text style={styles.cardSubtitle}>
            Войдите или зарегистрируйтесь, чтобы получать доступ к профилю,
            избранному и историям отчётов.
          </Text>

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
      <PickerProfile
        initials={initials}
        phone={user.phone}
        name={user.name || user.login}
        onLogout={logout}
      />
    );
  }

  return (
    <ClientProfile
      name={user.name || user.login}
      phone={user.phone}
      onLogout={logout}
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

function PickerProfile({
  initials,
  name,
  phone,
  onLogout,
}: {
  initials: string;
  name: string;
  phone?: string;
  onLogout: () => Promise<void>;
}) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const editFlow = useProfileEditFlow(onLogout, router);

  const stats = useMemo(
    () => ({
      published: 120,
      balance: 2000,
      reportsAvailable: 4,
      reportsUsed: 6,
      reportsTotal: 10,
      expiresAt: "08.09.2027",
    }),
    [],
  );

  return (
    <SafeAreaView style={styles.pickerScreen}>
      <PickerProfileHeader
        initials={initials}
        name={name}
        phone={phone}
        onOpenEdit={() => editFlow.setEditMenuOpen(true)}
        onOpenBurger={() => setMenuOpen(true)}
      />

      <ScrollView contentContainerStyle={styles.pickerContent}>
        <ProfileStats
          published={stats.published}
          balanceLabel={formatRub(stats.balance)}
        />

        <ReportsBanner
          reportsUsed={stats.reportsUsed}
          reportsTotal={stats.reportsTotal}
          reportsAvailable={stats.reportsAvailable}
          expiresAt={stats.expiresAt}
          onPress={() => router.push("/reports" as Href)}
        />

        <ProfileQuickActions
          variant="picker"
          onOpenFavorites={() => router.push("/(tabs)/favorites" as Href)}
          onOpenBest={() => router.push("/selection" as Href)}
        />

        <Text style={styles.sectionTitle}>Мои отчёты</Text>
        <View style={styles.reportCard}>
          <View style={styles.reportImagePlaceholder} />
          <View style={styles.reportBody}>
            <Text style={styles.reportPrice}>67 000 000 ₽</Text>
            <Text style={styles.reportSub} numberOfLines={2}>
              Mercedes‑Benz GLC AMG 43 AMG II (X254), 2024
            </Text>
            <TouchableOpacity
              style={styles.openButton}
              onPress={() => router.push("/reports" as Href)}
            >
              <Text style={styles.openButtonText}>Открыть</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => {}}
        accessibilityRole="button"
      >
        <Text style={styles.fabPlus}>＋</Text>
      </TouchableOpacity>

      <BurgerMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        items={[
          {
            key: "favorites",
            label: "Избранное",
            href: "/(tabs)/favorites" as Href,
            Icon: FavIcon,
          },
          {
            key: "selection",
            label: "Подбор авто",
            href: "/selection" as Href,
            Icon: SelectionIcon,
          },
          {
            key: "coop",
            label: "Сотрудничество",
            href: "/cooperation" as Href,
            Icon: CooperationIcon,
          },
          {
            key: "about",
            label: "О нас",
            href: "/about" as Href,
            Icon: AboutIcon,
          },
        ]}
        footer={
          <TouchableOpacity
            style={{ padding: 16 }}
            onPress={async () => {
              await onLogout();
              router.replace("/" as Href);
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <LogoutIcon width={22} height={22} />
              <Text style={{ fontSize: 14, fontWeight: "600", color: "#666" }}>
                Выйти из аккаунта
              </Text>
            </View>
          </TouchableOpacity>
        }
      />

      <ProfileEditMenu
        editMenuOpen={editFlow.editMenuOpen}
        confirmDeleteOpen={editFlow.confirmDeleteOpen}
        deletedOpen={editFlow.deletedOpen}
        onCloseEditMenu={() => editFlow.setEditMenuOpen(false)}
        onChangePhone={() => {}}
        onOpenDeleteConfirm={() => editFlow.setConfirmDeleteOpen(true)}
        onCloseDeleteConfirm={() => editFlow.setConfirmDeleteOpen(false)}
        onConfirmDelete={editFlow.handleDeleteConfirm}
        onCloseDeleted={editFlow.handleCloseDeleted}
      />
    </SafeAreaView>
  );
}

type ClientProfileProps = {
  name: string;
  phone?: string;
  onLogout: () => Promise<void>;
};

function ClientProfile({ name, phone, onLogout }: ClientProfileProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const editFlow = useProfileEditFlow(onLogout, router);
  // По умолчанию у нового клиента нет купленных отчётов.
  const reports = useMemo<
    {
      id: string;
      price: string;
      title: string;
      subtitle: string;
      city: string;
      imageUrl: string;
    }[]
  >(() => [], []);
  const hasReports = reports.length > 0;

  return (
    <SafeAreaView style={styles.pickerScreen}>
      <ClientProfileHeader
        name={name}
        phone={phone}
        showTitle={hasReports}
        onOpenEdit={() => editFlow.setEditMenuOpen(true)}
        onOpenBurger={() => setMenuOpen(true)}
      />

      <ScrollView contentContainerStyle={styles.pickerContent}>
        {hasReports ? (
          <>
            {reports.map((r) => (
              <ClientReportCard
                key={r.id}
                report={r}
                onOpen={() => router.push("/reports" as Href)}
                onDownloadPdf={() => {
                  // заглушка под будущую загрузку PDF
                }}
              />
            ))}
          </>
        ) : (
          <>
            <ProfileQuickActions
              variant="client"
              onOpenFavorites={() => router.push("/(tabs)/favorites" as Href)}
              onOpenBest={() => router.push("/selection" as Href)}
            />

            <ClientEmptyState
              onOpenCatalog={() => router.push("/(tabs)/catalog" as Href)}
            />
          </>
        )}
      </ScrollView>

      <BurgerMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        items={[
          {
            key: "favorites",
            label: "Избранное",
            href: "/(tabs)/favorites" as Href,
            Icon: FavIcon,
          },
          {
            key: "selection",
            label: "Подбор авто",
            href: "/selection" as Href,
            Icon: SelectionIcon,
          },
          {
            key: "coop",
            label: "Сотрудничество",
            href: "/cooperation" as Href,
            Icon: CooperationIcon,
          },
          {
            key: "about",
            label: "О нас",
            href: "/about" as Href,
            Icon: AboutIcon,
          },
        ]}
        footer={
          <TouchableOpacity
            style={{ padding: 16 }}
            onPress={async () => {
              await onLogout();
              router.replace("/" as Href);
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <LogoutIcon width={22} height={22} />
              <Text style={{ fontSize: 14, fontWeight: "600", color: "#666" }}>
                Выйти из аккаунта
              </Text>
            </View>
          </TouchableOpacity>
        }
      />

      <ProfileEditMenu
        editMenuOpen={editFlow.editMenuOpen}
        confirmDeleteOpen={editFlow.confirmDeleteOpen}
        deletedOpen={editFlow.deletedOpen}
        onCloseEditMenu={() => editFlow.setEditMenuOpen(false)}
        onChangePhone={() => {}}
        onOpenDeleteConfirm={() => editFlow.setConfirmDeleteOpen(true)}
        onCloseDeleteConfirm={() => editFlow.setConfirmDeleteOpen(false)}
        onConfirmDelete={editFlow.handleDeleteConfirm}
        onCloseDeleted={editFlow.handleCloseDeleted}
      />
    </SafeAreaView>
  );
}

function formatRub(value: number): string {
  const formatted = value.toLocaleString("ru-RU");
  return `${formatted} ₽`;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F7F7F7",
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  center: {
    flex: 1,
    backgroundColor: "#F7F7F7",
    justifyContent: "center",
    alignItems: "center",
  },
  centerText: {
    marginTop: 12,
    fontSize: 14,
    color: "#555",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
    marginBottom: 16,
    alignItems: "center",
  },
  lockEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1E1E1E",
    textAlign: "center",
    marginTop: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: "#555",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 18,
  },
  avatarWrapper: {
    marginBottom: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#DB4431",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 30,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  roleBadge: {
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#F3E4E2",
  },
  roleBadgeText: {
    fontSize: 12,
    color: "#DB4431",
    fontWeight: "600",
  },
  primaryButton: {
    marginTop: 20,
    alignSelf: "stretch",
    backgroundColor: "#DB4431",
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    marginTop: 10,
    alignSelf: "stretch",
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DB4431",
    backgroundColor: "#FFFFFF",
  },
  secondaryButtonText: {
    color: "#DB4431",
    fontSize: 16,
    fontWeight: "600",
  },
  actionsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    marginTop: 8,
  },
  actionButton: {
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: "#F7F7F7",
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  actionButtonTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E1E1E",
  },
  actionButtonSubtitle: {
    fontSize: 12,
    color: "#777",
    marginTop: 4,
  },
  logoutButton: {
    marginTop: 4,
    alignSelf: "stretch",
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 14,
    backgroundColor: "#1E1E1E",
  },
  logoutButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
  pickerScreen: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },
  pickerContent: {
    paddingBottom: 120,
  },
  quickRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
    marginHorizontal: 16,
  },
  favCard: {
    flex: 1,
    height: 62,
    borderRadius: 12,
    overflow: "hidden",
    justifyContent: "center",
  },
  favContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 12,
    zIndex: 1,
  },
  favText: {
    fontSize: 12,
    color: "#989898",
    fontWeight: "600",
  },
  sectionTitle: {
    marginTop: 18,
    marginHorizontal: 16,
    fontSize: 18,
    fontWeight: "800",
    color: "#1E1E1E",
  },
  reportCard: {
    marginTop: 12,
    marginHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    overflow: "hidden",
  },
  reportImagePlaceholder: {
    height: 160,
    backgroundColor: "#EEE",
  },
  reportBody: {
    padding: 14,
    gap: 6,
  },
  reportPrice: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1E1E1E",
  },
  reportSub: {
    fontSize: 12,
    color: "#777",
  },
  openButton: {
    marginTop: 8,
    backgroundColor: "#DB4431",
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: "center",
  },
  openButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },
  fab: {
    position: "absolute",
    right: 18,
    bottom: 26,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#DB4431",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  fabPlus: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "700",
    marginTop: -2,
  },
});
