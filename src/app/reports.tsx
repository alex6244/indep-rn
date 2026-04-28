import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useRouter, type Href } from "expo-router";
import type { Report } from "../types/report";
import { ReportsBreadcrumb } from "../widgets/reports/ReportsBreadcrumb";
import { ReportsHeader } from "../widgets/reports/ReportsHeader";
import { ReportsList } from "../widgets/reports/ReportsList";
import { InlineMessage } from "../shared/ui/InlineMessage";
import { ScreenStateEmpty } from "../shared/ui/ScreenStateEmpty";
import { ScreenStateError } from "../shared/ui/ScreenStateError";
import { ScreenStateLoading } from "../shared/ui/ScreenStateLoading";
import { clientReportsService } from "../services/clientReportsService";
import { colors } from "../shared/theme/colors";
import { spacing } from "../shared/theme/spacing";

export default function ReportsScreen() {
  const router = useRouter();
  const [reports, setReports] = React.useState<Report[]>([]);
  const [infoMessage, setInfoMessage] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const loadReports = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const next = await clientReportsService.getPurchasedReports();
      setReports(next);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Не удалось загрузить отчёты. Попробуйте ещё раз.";
      setError(message);
      setReports([]);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void loadReports();
  }, [loadReports]);

  const openReportDetails = (id: string) => {
    router.push(`/reports/${id}` as Href);
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ReportsBreadcrumb active="Купленные отчёты" />
        <ReportsHeader title="Купленные отчёты" />
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
          <ScreenStateEmpty
            title="Отчётов пока нет"
            subtitle="После покупки отчёты появятся в этом разделе."
          />
        ) : (
          <ReportsList
            reports={reports}
            onOpenReport={openReportDetails}
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
});

