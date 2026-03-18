import { BurgerMenu } from "@/src/shared/ui/BurgerMenu";
import { useRouter, type Href } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Logo from "../../assets/logo.svg";
import FavouriteBanner from "../../assets/profile/favouritebanner.svg";
import MicroBanner from "../../assets/profile/microbanner.svg";
import ReportsIcon from "../../assets/profile/reports.svg";
import WalletIcon from "../../assets/profile/wallet.svg";
import { useAuth } from "../../contexts/AuthContext";
import { useProtected } from "../../hooks/useProtected";
import FavIcon from "../../assets/icons/burger/favourites.svg";
import SelectionIcon from "../../assets/icons/burger/selection.svg";
import AboutIcon from "../../assets/icons/burger/about.svg";
import LogoutIcon from "../../assets/icons/burger/logout.svg";

export default function ProfileTab() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const { checkAuth } = useProtected();

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
  const roleLabel = isPicker ? "Подборщик" : "Клиент";

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

  const handleMyAds = () => {
    if (
      !checkAuth({
        message: "Войдите, чтобы просмотреть свои объявления",
      })
    ) {
      return;
    }
    // TODO: когда появится экран объявлений, заменить путь
    // router.push("/my-ads" as Href);
  };

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <View style={styles.avatarWrapper}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
        </View>

        <Text style={styles.cardTitle}>Привет, {user.name || user.login}!</Text>

        {!!user.phone && (
          <Text style={styles.cardSubtitle}>📱 {user.phone}</Text>
        )}

        <View style={styles.roleBadge}>
          <Text style={styles.roleBadgeText}>Роль: {roleLabel}</Text>
        </View>
      </View>

      <View style={styles.actionsCard}>
        <TouchableOpacity style={styles.actionButton} onPress={handleMyAds}>
          <Text style={styles.actionButtonTitle}>Мои объявления</Text>
          <Text style={styles.actionButtonSubtitle}>
            Смотреть добавленные отчёты и автомобили
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            if (
              !checkAuth({
                message: "Войдите, чтобы посмотреть купленные отчёты",
              })
            ) {
              return;
            }
            router.push("/reports" as Href);
          }}
        >
          <Text style={styles.actionButtonTitle}>Купленные отчёты</Text>
          <Text style={styles.actionButtonSubtitle}>
            Список оплаченных отчётов по авто
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutButtonText}>Выйти из аккаунта</Text>
        </TouchableOpacity>
      </View>
    </View>
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
  const [editMenuOpen, setEditMenuOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deletedOpen, setDeletedOpen] = useState(false);

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
      {/* Header */}
      <View style={styles.pickerHeader}>
        <Logo width={110} height={28} />
        <TouchableOpacity
          style={styles.burgerButton}
          onPress={() => setMenuOpen(true)}
          accessibilityRole="button"
        >
          <View style={styles.burgerLine} />
          <View style={styles.burgerLine} />
          <View style={styles.burgerLine} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.pickerContent}>
        {/* Profile card */}
        <View style={styles.profileTop}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitials}>{initials}</Text>
          </View>

          <View style={styles.profileMeta}>
            <View style={styles.nameRow}>
              <Text style={styles.profileName} numberOfLines={1}>
                {name}
              </Text>
              <TouchableOpacity
                onPress={() => setEditMenuOpen(true)}
                style={styles.editIconButton}
                accessibilityRole="button"
              >
                <Text style={styles.editIconText}>✎</Text>
              </TouchableOpacity>
            </View>
            {!!phone && <Text style={styles.profilePhone}>{phone}</Text>}
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Опубликовано объявлений</Text>
          <Text style={styles.statValue}>{stats.published}</Text>
          <ReportsIcon width={64} height={64} style={styles.statIcon} />
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Ваш баланс</Text>
          <Text style={styles.statValue}>{formatRub(stats.balance)}</Text>
          <WalletIcon width={64} height={64} style={styles.statIcon} />
        </View>

        {/* Reports banner */}
        <TouchableOpacity
          style={styles.microBanner}
          activeOpacity={0.9}
          onPress={() => router.push("/reports" as Href)}
        >
          <MicroBanner
            style={StyleSheet.absoluteFillObject}
            width="100%"
            height="100%"
          />
          <View style={styles.microContent}>
            <Text style={styles.microText1}>
              Вы использовали {stats.reportsUsed} из {stats.reportsTotal}{" "}
              отчётов
            </Text>
            <Text style={styles.microText2}>
              Доступно: {stats.reportsAvailable} отчёта
            </Text>
            <Text style={styles.microText3}>
              Пакет истекает {stats.expiresAt}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Quick actions */}
        <View style={styles.quickRow}>
          <TouchableOpacity
            style={styles.favCard}
            onPress={() => {
              // TODO: когда сделаешь экран избранного — поменяешь путь
              // router.push("/(tabs)/favorites" as Href);
              router.push("/(tabs)/favorites" as Href);
            }}
          >
            <FavouriteBanner
              pointerEvents="none"
              style={StyleSheet.absoluteFillObject}
              width="100%"
              height="100%"
            />
            <View style={styles.favContent}>
              <Text style={styles.favText}>Избранное</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* My reports */}
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
        onPress={() => {
          // TODO: создать новый отчёт / объявление
        }}
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
            icon: 
          },
          {
            key: "selection",
            label: "Подбор авто",
            href: "/selection" as Href,
          },
          {
            key: "logout",
            label: "Выйти из аккаунта",
            onPress: async () => {
              await onLogout();
              router.replace("/" as Href);
            },
          },
        ]}
      />

      <Modal
        transparent
        visible={editMenuOpen}
        animationType="fade"
        onRequestClose={() => setEditMenuOpen(false)}
      >
        <TouchableOpacity
          style={styles.menuOverlay}
          activeOpacity={1}
          onPress={() => setEditMenuOpen(false)}
        >
          <View style={styles.editMenu} onStartShouldSetResponder={() => true}>
            <TouchableOpacity
              style={styles.editMenuItem}
              onPress={() => {
                setEditMenuOpen(false);
                // TODO: смена телефона
              }}
            >
              <Text style={styles.editMenuItemText}>
                Изменить номер телефона
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.editMenuItem}
              onPress={() => {
                setEditMenuOpen(false);
                setConfirmDeleteOpen(true);
              }}
            >
              <Text style={[styles.editMenuItemText, styles.dangerText]}>
                Удалить профиль
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Confirm delete */}
      <Modal
        transparent
        visible={confirmDeleteOpen}
        animationType="fade"
        onRequestClose={() => setConfirmDeleteOpen(false)}
      >
        <View style={styles.confirmBackdrop}>
          <View style={styles.confirmCard}>
            <Text style={styles.confirmTitle}>
              Вы уверены, что хотите удалить эту страницу?
            </Text>
            <Text style={styles.confirmBody}>
              После удаления страницы она будет безвозвратно удалена и
              восстановить её будет невозможно.
            </Text>
            <View style={styles.confirmRow}>
              <TouchableOpacity
                style={styles.confirmCancel}
                onPress={() => setConfirmDeleteOpen(false)}
              >
                <Text style={styles.confirmCancelText}>Отмена</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmDelete}
                onPress={() => {
                  setConfirmDeleteOpen(false);
                  setDeletedOpen(true);
                }}
              >
                <Text style={styles.confirmDeleteText}>Удалить страницу</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Deleted placeholder */}
      <Modal
        transparent
        visible={deletedOpen}
        animationType="fade"
        onRequestClose={() => setDeletedOpen(false)}
      >
        <View style={styles.confirmBackdrop}>
          <View style={styles.confirmCard}>
            <Text style={styles.confirmTitle}>Страница удалена</Text>
            <TouchableOpacity
              style={styles.openButton}
              onPress={() => setDeletedOpen(false)}
            >
              <Text style={styles.openButtonText}>Понятно</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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

  // Picker profile styles (Figma-like)
  pickerScreen: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },
  pickerHeader: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
  },
  burgerButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  burgerLine: {
    width: 22,
    height: 2,
    borderRadius: 2,
    backgroundColor: "#DB4431",
    marginVertical: 2,
  },
  pickerContent: {
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  profileTop: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#1E1E1E",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitials: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  profileMeta: {
    flex: 1,
    marginLeft: 12,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  profileName: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    color: "#1E1E1E",
    marginRight: 10,
  },
  editIconButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  editIconText: {
    color: "#DB4431",
    fontSize: 16,
    fontWeight: "700",
  },
  profilePhone: {
    marginTop: 4,
    fontSize: 12,
    color: "#777",
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  statLabel: {
    fontSize: 11,
    color: "#999",
  },
  statValue: {
    marginTop: 8,
    fontSize: 22,
    fontWeight: "800",
    color: "#1E1E1E",
  },
  reportsBanner: {
    marginTop: 12,
    backgroundColor: "#DB4431",
    borderRadius: 18,
    padding: 16,
  },
  bannerSmall: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 11,
  },
  bannerTitle: {
    marginTop: 6,
    marginBottom: 6,
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },
  microBanner: {
    marginTop: 12,
    borderRadius: 18,
    overflow: "hidden",
    minHeight: 95,
    padding: 16,
    justifyContent: "center",
    position: "relative",
  },
  microContent: {
    zIndex: 1,
  },
  microText1: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 11,
  },
  microText2: {
    marginTop: 6,
    marginBottom: 6,
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },
  microText3: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 11,
  },
  quickRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  quickItem: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 14,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  quickEmoji: {
    fontSize: 22,
  },
  quickText: {
    fontSize: 12,
    color: "#777",
    textAlign: "center",
  },
  sectionTitle: {
    marginTop: 18,
    fontSize: 18,
    fontWeight: "800",
    color: "#1E1E1E",
  },
  reportCard: {
    marginTop: 12,
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
  menuOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  sideMenu: {
    width: "78%",
    backgroundColor: "#FFFFFF",
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  sideMenuHeader: {
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
    marginBottom: 10,
  },
  sideMenuLogo: {
    fontSize: 18,
    fontWeight: "800",
    color: "#DB4431",
  },
  sideMenuItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F2",
  },
  sideMenuItemText: {
    fontSize: 14,
    color: "#1E1E1E",
    fontWeight: "600",
  },
  sideMenuFooter: {
    marginTop: "auto",
    paddingTop: 14,
  },
  logoutRow: {
    paddingVertical: 12,
  },
  logoutRowText: {
    color: "#666",
    fontSize: 14,
    fontWeight: "600",
  },
  editMenu: {
    position: "absolute",
    top: 90,
    right: 16,
    width: 260,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  editMenuItem: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  editMenuItemText: {
    fontSize: 14,
    color: "#1E1E1E",
    fontWeight: "600",
  },
  dangerText: {
    color: "#DB4431",
  },
  confirmBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    padding: 16,
  },
  confirmCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
  },
  confirmTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1E1E1E",
  },
  confirmBody: {
    marginTop: 8,
    fontSize: 12,
    color: "#777",
    lineHeight: 16,
  },
  confirmRow: {
    marginTop: 14,
    flexDirection: "row",
    gap: 10,
  },
  confirmCancel: {
    flex: 1,
    backgroundColor: "#DB4431",
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
  },
  confirmCancelText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 13,
  },
  confirmDelete: {
    flex: 1,
    backgroundColor: "#555",
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
  },
  confirmDeleteText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 13,
  },
  statIcon: {
    position: "absolute",
    right: 8,
    bottom: 8,
  },
});
