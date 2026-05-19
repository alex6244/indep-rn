import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useRouter, type Href } from "expo-router";
import type { Report } from "../types/report";
import { useAuth } from "../contexts/AuthContext";
import { ReportsBreadcrumb } from "../widgets/reports/ReportsBreadcrumb";
import { ReportsHeader } from "../widgets/reports/ReportsHeader";
import { ReportsList } from "../widgets/reports/ReportsList";
import { InlineMessage } from "../shared/ui/InlineMessage";
import { ScreenStateEmpty } from "../shared/ui/ScreenStateEmpty";
import { ScreenStateError } from "../shared/ui/ScreenStateError";
import { ScreenStateLoading } from "../shared/ui/ScreenStateLoading";
import { AppButton } from "../shared/ui/AppButton";
import { clientReportsService } from "../services/clientReportsService";
import { pickerReportsService } from "../services/pickerReportsService";
import { colors } from "../shared/theme/colors";
import { spacing } from "../shared/theme/spacing";

export default function ReportsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const isPicker = user?.role === "picker";
  const [reports, setReports] = React.useState<Report[]>([]);
  const [infoMessage, setInfoMessage] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const listTitle = isPicker ? "Мои отчёты" : "Купленные отчёты";
  const breadcrumb = isPicker ? "Мои отчёты" : "Купленные отчёты";

  const loadReports = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const next = isPicker
        ? await pickerReportsService.getMyReportsForDisplay()
        : await clientReportsService.getPurchasedReports();
      setReports(next);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Не удалось загрузить отчёты. Попробуйте ещё раз.";
      setError(message);
      setReports([]);
    } finally {
      setLoading(false);
    }
  }, [isPicker]);

  React.useEffect(() => {
    void loadReports();
  }, [loadReports]);

  const openReportDetails = (id: string) => {
    router.push(`/reports/${id}` as Href);
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ReportsBreadcrumb active={breadcrumb} />
        <ReportsHeader title={listTitle} />
        {infoMessage ? <InlineMessage tone="info" message={infoMessage} /> : null}
        {loading ? (
          <ScreenStateLoading message="Загружаем отчёты..." />
        ) : error ? (
          <ScreenStateError
            title="Не удалось загрузить отчёты"
            message={error}
            onRetry={() => {
              void loadReports();
            }}
          />
        ) : reports.length === 0 ? (
          <View style={styles.emptyWrap}>
            <ScreenStateEmpty
              title="Отчётов пока нет"
              subtitle={
                isPicker
                  ? "Создайте отчёт по автомобилю — он появится в этом списке."
                  : "После покупки отчёты появятся в этом разделе."
              }
            />
            {isPicker ? (
              <AppButton
                label="Создать отчёт"
                onPress={() => router.push("/selection" as Href)}
                style={styles.emptyCta}
              />
            ) : null}
          </View>
        ) : (
          <ReportsList
            reports={reports}
            onOpenReport={openReportDetails}
            showPdfDownload={!isPicker}
            onPdfUnavailable={() => setInfoMessage("PDF пока недоступен")}
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surface.primary,
  },
  scrollContent: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  emptyWrap: {
    paddingHorizontal: spacing.lg,
  },
  emptyCta: {
    marginTop: spacing.lg,
  },
});
