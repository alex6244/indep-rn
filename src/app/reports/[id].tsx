import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter, type Href } from "expo-router";
import { getReportById } from "../../data/reports";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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

export default function ReportDetailsRoute() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const insets = useSafeAreaInsets();
  const rawId = params.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  const report = id ? getReportById(id) : undefined;

  if (!id || !report) {
    return (
      <View style={styles.screen}>
        <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + 16 }]}>
          <ReportsBreadcrumb active="Купленные отчёты" />
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

        <ReportDetailsActions reportId={report.id} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    paddingTop: 16,
    paddingBottom: 140,
  },
  notFoundTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1E1E1E",
    marginTop: 14,
    marginHorizontal: 16,
  },
  notFoundText: {
    marginTop: 8,
    fontSize: 13,
    color: "#777777",
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
    color: "#DB4431",
  },
});

