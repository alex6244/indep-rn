import { type Href, useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getMainBurgerMenuItems } from "../../shared/config/mainBurgerMenu";
import { BurgerMenu } from "../../shared/ui/BurgerMenu";
import { scrollBottomPaddingBelowTabBar } from "../../shared/navigation/tabBarMetrics";
import { styles } from "../../shared/styles/profile.styles";
import { ClientEmptyState } from "./ClientEmptyState";
import { ClientReportCard } from "./ClientReportCard";
import { ProfileEditMenu } from "./ProfileEditMenu";
import { ProfileIdentityCard } from "./ProfileIdentityCard";
import { ProfileLogoutRow } from "./ProfileLogoutRow";
import { ProfileQuickActions } from "./ProfileQuickActions";
import { ProfileTopBar } from "./ProfileTopBar";
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
      <ProfileTopBar onOpenBurger={() => setMenuOpen(true)} />

      <ScrollView
        contentContainerStyle={[
          styles.pickerContent,
          {
            paddingBottom: scrollBottomPaddingBelowTabBar(insets.bottom),
          },
        ]}
      >
        {infoMessage ? <InlineMessage tone="info" message={infoMessage} /> : null}
        <ProfileIdentityCard
          name={name}
          phone={phone}
          onOpenEdit={() => editFlow.setEditMenuOpen(true)}
        />
        <ProfileQuickActions
          variant="client"
          onOpenFavorites={() => router.push("/(tabs)/favorites" as Href)}
          onOpenBest={() => router.push("/(tabs)/catalog" as Href)}
        />
        <Text style={styles.sectionTitle}>Мои отчёты</Text>

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
          <ClientEmptyState onOpenCatalog={() => router.push("/(tabs)/catalog" as Href)} />
        )}
      </ScrollView>

      <BurgerMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        items={getMainBurgerMenuItems()}
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
        onChangePhone={() => setInfoMessage("Редактирование номера будет доступно позже.")}
        onOpenDeleteConfirm={() => editFlow.setConfirmDeleteOpen(true)}
        onCloseDeleteConfirm={() => editFlow.setConfirmDeleteOpen(false)}
        onConfirmDelete={editFlow.handleDeleteConfirm}
        onCloseDeleted={editFlow.handleCloseDeleted}
      />
    </View>
  );
}
