import { type Href, useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getMainBurgerMenuItems } from "../../shared/config/mainBurgerMenu";
import { BurgerMenu } from "../../shared/ui/BurgerMenu";
import { BalanceModal } from "./BalanceModal";
import { ProfileIdentityCard } from "./ProfileIdentityCard";
import { ProfileEditMenu } from "./ProfileEditMenu";
import { ProfileLogoutRow } from "./ProfileLogoutRow";
import { ProfileQuickActions } from "./ProfileQuickActions";
import { ProfileStats } from "./ProfileStats";
import { ProfileTopBar } from "./ProfileTopBar";
import { ReportsBanner } from "./ReportsBanner";
import { useProfileEditFlow } from "./useProfileEditFlow";
import { scrollBottomPaddingBelowTabBar } from "../../shared/navigation/tabBarMetrics";
import { styles } from "./profile.styles";
import { InlineMessage } from "../../shared/ui/InlineMessage";
import { ScreenStateError } from "../../shared/ui/ScreenStateError";
import { ScreenStateLoading } from "../../shared/ui/ScreenStateLoading";
import { ClientReportCard } from "./ClientReportCard";
import { PickerReportsEmptyState } from "./PickerReportsEmptyState";
import { pickerReportsService } from "../../services/pickerReportsService";
import type { Report } from "../../types/report";

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
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [reportsLoading, setReportsLoading] = useState(true);
  const [reportsError, setReportsError] = useState<string | null>(null);
  const editFlow = useProfileEditFlow(onLogout, router);

  const stats = useMemo(
    () => ({
      published: reports.length,
      balance: 2000,
      reportsAvailable: 4,
      reportsUsed: 6,
      reportsTotal: 10,
      expiresAt: "08.09.2027",
    }),
    [reports.length],
  );

  const loadReports = useCallback(async () => {
    setReportsLoading(true);
    setReportsError(null);
    try {
      const next = await pickerReportsService.getMyReportsForDisplay();
      setReports(next);
    } catch (e) {
      setReports([]);
      setReportsError(e instanceof Error ? e.message : "Не удалось загрузить отчёты.");
    } finally {
      setReportsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void loadReports();
  }, [loadReports]);

  const openCreateReport = useCallback(() => {
    router.push("/selection" as Href);
  }, [router]);

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
          initials={initials}
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
          onOpenBest={() => router.push("/(tabs)/catalog" as Href)}
        />

        <Text style={styles.sectionTitle}>Мои отчёты</Text>

        {reportsLoading ? (
          <ScreenStateLoading message="Загружаем отчёты..." />
        ) : reportsError ? (
          <ScreenStateError
            title="Не удалось загрузить отчёты"
            message={reportsError}
            onRetry={() => {
              void loadReports();
            }}
          />
        ) : reports.length === 0 ? (
          <PickerReportsEmptyState onCreateReport={openCreateReport} />
        ) : (
          reports.map((r) => (
            <ClientReportCard
              key={r.id}
              report={r}
              showPdfDownload={false}
              onOpen={() => router.push(`/reports/${r.id}` as Href)}
              onDownloadPdf={() => undefined}
            />
          ))
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={openCreateReport}
        accessibilityRole="button"
        accessibilityLabel="Создать отчёт"
      >
        <Text style={styles.fabPlus}>＋</Text>
      </TouchableOpacity>

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

      <BalanceModal
        visible={balanceModalOpen}
        balanceText={formatRub(stats.balance)}
        onClose={() => setBalanceModalOpen(false)}
        onKeepInWallet={() => setBalanceModalOpen(false)}
        onWithdraw={() => {
          setBalanceModalOpen(false);
          setInfoMessage("Функция вывода будет доступна позже.");
        }}
      />
    </View>
  );
}

function formatRub(value: number): string {
  const formatted = value.toLocaleString("ru-RU");
  return `${formatted} ₽`;
}
