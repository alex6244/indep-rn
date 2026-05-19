import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter, type Href } from "expo-router";
import type { Report } from "../../types/report";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../contexts/AuthContext";
import { ReportsBreadcrumb } from "../../widgets/reports/ReportsBreadcrumb";
import { ReportDetailsActions } from "../../widgets/reports/ReportDetailsActions";
import { ReportCarousel } from "../../widgets/reports/ReportCarousel";
import { DefectsCard } from "../../widgets/reports/DefectsCard";
import { PtsDataCard } from "../../widgets/reports/PtsDataCard";
import { MileageCard } from "../../widgets/reports/MileageCard";
import { OwnersCard } from "../../widgets/reports/OwnersCard";
import { LegalCleanlinessCard } from "../../widgets/reports/LegalCleanlinessCard";
import { CommercialUsageCard } from "../../widgets/reports/CommercialUsageCard";
import { PenaltiesCard } from "../../widgets/reports/PenaltiesCard";
import { CostEstimationCard } from "../../widgets/reports/CostEstimationCard";
import { ScreenStateError } from "../../shared/ui/ScreenStateError";
import { ScreenStateLoading } from "../../shared/ui/ScreenStateLoading";
import { clientReportsService } from "../../services/clientReportsService";
import { pickerReportsService } from "../../services/pickerReportsService";
import { colors } from "../../shared/theme/colors";
import { spacing } from "../../shared/theme/spacing";

export default function ReportDetailsRoute() {
  const router = useRouter();
  const { user } = useAuth();
  const isPicker = user?.role === "picker";
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const insets = useSafeAreaInsets();
  const rawId = params.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  const [report, setReport] = React.useState<Report | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const listBreadcrumb = isPicker ? "Мои отчёты" : "Купленные отчёты";

  const loadReport = React.useCallback(
    async (signal: AbortSignal): Promise<void> => {
      if (!id) {
        setReport(null);
        setError("Отчёт не найден.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const nextReport = isPicker
          ? await pickerReportsService.getReportForDisplayById(id, signal)
          : await clientReportsService.getPurchasedReportById(id, signal);
        if (signal.aborted) return;
        setReport(nextReport);
      } catch (e) {
        if (signal.aborted) return;
        const message =
          e instanceof Error ? e.message : "Не удалось загрузить отчёт. Попробуйте ещё раз.";
        setError(message);
        setReport(null);
      } finally {
        if (!signal.aborted) setLoading(false);
      }
    },
    [id, isPicker],
  );

  React.useEffect(() => {
    const controller = new AbortController();
    void loadReport(controller.signal);
    return () => controller.abort();
  }, [loadReport]);

  if (loading) {
    return (
      <View style={styles.screen}>
        <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + 16 }]}>
          <ReportsBreadcrumb active="Детали отчёта" />
          <ScreenStateLoading message="Загружаем отчёт..." />
        </ScrollView>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.screen}>
        <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + 16 }]}>
          <ReportsBreadcrumb active="Детали отчёта" />
          <ScreenStateError
            title="Не удалось загрузить отчёт"
            message={error}
            onRetry={() => {
              const controller = new AbortController();
              void loadReport(controller.signal);
            }}
          />
        </ScrollView>
      </View>
    );
  }

  if (!report) {
    return (
      <View style={styles.screen}>
        <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + 16 }]}>
          <ReportsBreadcrumb active={listBreadcrumb} />
          <Text style={styles.notFoundTitle}>Отчёт не найден</Text>
          <Text style={styles.notFoundText}>
            Возможно, ссылка устарела или отчёт ещё не доступен.
          </Text>

          <View style={styles.actions}>
            <Text
              onPress={() => router.back()}
              style={styles.backLink}
              accessibilityRole="button"
            >
              ← Назад
            </Text>
            <Text
              onPress={() => router.push("/reports" as Href)}
              style={styles.backLink}
              accessibilityRole="button"
            >
              Перейти к списку
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + 16 }]}>
        <ReportsBreadcrumb active="Детали отчёта" />

        <ReportCarousel report={report} />
        <DefectsCard report={report} />
        <PtsDataCard report={report} />
        <MileageCard report={report} />
        <OwnersCard report={report} />
        <LegalCleanlinessCard report={report} />
        <CommercialUsageCard report={report} />
        <PenaltiesCard report={report} />
        <CostEstimationCard report={report} />

        <ReportDetailsActions
          reportId={report.id}
          report={report}
          showPdfDownload={!isPicker}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surface.primary,
  },
  content: {
    paddingTop: spacing.lg,
    paddingBottom: 140,
  },
  notFoundTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.text.primary,
    marginTop: 14,
    marginHorizontal: 16,
  },
  notFoundText: {
    marginTop: 8,
    fontSize: 13,
    color: colors.text.subtle,
    marginHorizontal: 16,
    lineHeight: 18,
  },
  actions: {
    marginTop: 18,
    flexDirection: "row",
    gap: 14,
    marginHorizontal: 16,
    flexWrap: "wrap",
  },
  backLink: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.brand.primary,
  },
});
