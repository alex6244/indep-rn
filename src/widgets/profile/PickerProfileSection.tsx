import { type Href, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import AboutIcon from "../../assets/icons/burger/about.svg";
import CooperationIcon from "../../assets/icons/burger/ads.svg";
import FavIcon from "../../assets/icons/burger/favourites.svg";
import SelectionIcon from "../../assets/icons/burger/selection.svg";
import { BurgerMenu } from "../../shared/ui/BurgerMenu";
import { BalanceModal } from "./BalanceModal";
import { PickerProfileHeader } from "./PickerProfileHeader";
import { PickerUserCard } from "./PickerUserCard";
import { ProfileEditMenu } from "./ProfileEditMenu";
import { ProfileLogoutRow } from "./ProfileLogoutRow";
import { ProfileQuickActions } from "./ProfileQuickActions";
import { ProfileStats } from "./ProfileStats";
import { ReportsBanner } from "./ReportsBanner";
import { useProfileEditFlow } from "./useProfileEditFlow";
import { scrollBottomPaddingBelowTabBar } from "../../app/(tabs)/tabBarMetrics";
import { styles } from "../../app/(tabs)/profile.styles";

type Props = {
  initials: string;
  name: string;
  phone?: string;
  onLogout: () => Promise<void>;
};

export function PickerProfileSection({ initials, name, phone, onLogout }: Props) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [menuOpen, setMenuOpen] = useState(false);
  const [balanceModalOpen, setBalanceModalOpen] = useState(false);
  const editFlow = useProfileEditFlow(onLogout, router);
  const pickerReportId = "1";

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
    <View style={styles.pickerScreen}>
      <PickerProfileHeader onOpenBurger={() => setMenuOpen(true)} />

      <ScrollView
        contentContainerStyle={[
          styles.pickerContent,
          {
            paddingBottom: scrollBottomPaddingBelowTabBar(insets.bottom),
          },
        ]}
      >
        <PickerUserCard
          initials={initials}
          name={name}
          phone={phone}
          onOpenEdit={() => editFlow.setEditMenuOpen(true)}
        />

        <ProfileStats
          published={stats.published}
          balanceLabel={formatRub(stats.balance)}
          onPressBalance={() => setBalanceModalOpen(true)}
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
          <View style={styles.reportImageWrap}>
            <Image
              source={require("../../assets/cars1.jpg")}
              style={styles.reportImagePlaceholder}
              contentFit="cover"
            />
            <View style={styles.mileageBadge}>
              <Text style={styles.mileageBadgeText}>200 000 км</Text>
            </View>
          </View>
          <View style={styles.reportBody}>
            <Text style={styles.reportPrice}>67 000 000 ₽</Text>
            <Text style={styles.reportSub} numberOfLines={2}>
              Mercedes‑Benz GLC AMG 43 AMG II (X254), 2024
            </Text>
            <TouchableOpacity
              style={styles.openButton}
              onPress={() => router.push(`/reports/${pickerReportId}` as Href)}
            >
              <Text style={styles.openButtonText}>Открыть</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/selection" as Href)}
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
          <ProfileLogoutRow
            onPress={() => {
              void (async () => {
                await onLogout();
                router.replace("/(auth)" as Href);
              })();
            }}
          />
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

      <BalanceModal
        visible={balanceModalOpen}
        balanceText={formatRub(stats.balance)}
        onClose={() => setBalanceModalOpen(false)}
        onKeepInWallet={() => setBalanceModalOpen(false)}
        onWithdraw={() => {
          setBalanceModalOpen(false);
          Alert.alert("Вывод", "Функция вывода будет доступна позже.");
        }}
      />
    </View>
  );
}

function formatRub(value: number): string {
  const formatted = value.toLocaleString("ru-RU");
  return `${formatted} ₽`;
}
