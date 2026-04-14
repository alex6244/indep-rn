import { type Href, useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AboutIcon from "../../assets/icons/burger/about.svg";
import CooperationIcon from "../../assets/icons/burger/ads.svg";
import FavIcon from "../../assets/icons/burger/favourites.svg";
import SelectionIcon from "../../assets/icons/burger/selection.svg";
import { BurgerMenu } from "../../shared/ui/BurgerMenu";
import { scrollBottomPaddingBelowTabBar } from "../../shared/navigation/tabBarMetrics";
import { styles } from "../../shared/styles/profile.styles";
import { ClientEmptyState } from "./ClientEmptyState";
import { ClientProfileHeader } from "./ClientProfileHeader";
import { ClientReportCard } from "./ClientReportCard";
import { ProfileEditMenu } from "./ProfileEditMenu";
import { ProfileLogoutRow } from "./ProfileLogoutRow";
import { ProfileQuickActions } from "./ProfileQuickActions";
import { useProfileEditFlow } from "./useProfileEditFlow";
import { InlineMessage } from "../../shared/ui/InlineMessage";
import type { Report } from "../../types/report";
import { ScreenStateError } from "../../shared/ui/ScreenStateError";
import { ScreenStateLoading } from "../../shared/ui/ScreenStateLoading";

type Props = {
  name: string;
  phone?: string;
  onLogout: () => Promise<void>;
  reports: Report[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
};

export function ClientProfileSection({
  name,
  phone,
  onLogout,
  reports,
  loading = false,
  error = null,
  onRetry,
}: Props) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [menuOpen, setMenuOpen] = useState(false);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const editFlow = useProfileEditFlow(onLogout, router);

  const hasReports = reports.length > 0;

  return (
    <View style={styles.pickerScreen}>
      <ClientProfileHeader
        name={name}
        phone={phone}
        showTitle={hasReports}
        onOpenEdit={() => editFlow.setEditMenuOpen(true)}
        onOpenBurger={() => setMenuOpen(true)}
      />

      <ScrollView
        contentContainerStyle={[
          styles.pickerContent,
          {
            paddingBottom: scrollBottomPaddingBelowTabBar(insets.bottom),
          },
        ]}
      >
        {infoMessage ? <InlineMessage tone="info" message={infoMessage} /> : null}
        {loading ? (
          <ScreenStateLoading message="Загружаем отчёты..." />
        ) : error ? (
          <ScreenStateError
            title="Не удалось загрузить отчёты"
            message={error}
            onRetry={onRetry}
          />
        ) : hasReports ? (
          <>
            {reports.map((r) => (
              <ClientReportCard
                key={r.id}
                report={r}
                onOpen={() => router.push(`/reports/${r.id}` as Href)}
                onDownloadPdf={() => {
                  setInfoMessage("PDF пока недоступен");
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
            <ClientEmptyState onOpenCatalog={() => router.push("/(tabs)/catalog" as Href)} />
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
    </View>
  );
}
