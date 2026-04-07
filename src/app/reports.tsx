import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useRouter, type Href } from "expo-router";
import { reports } from "../data/reports";
import { ReportsBreadcrumb } from "../widgets/reports/ReportsBreadcrumb";
import { ReportsHeader } from "../widgets/reports/ReportsHeader";
import { ReportsList } from "../widgets/reports/ReportsList";
import { InlineMessage } from "../shared/ui/InlineMessage";
import { ScreenStateEmpty } from "../shared/ui/ScreenStateEmpty";
import { ScreenStateLoading } from "../shared/ui/ScreenStateLoading";

export default function ReportsScreen() {
  const router = useRouter();
  const [infoMessage, setInfoMessage] = React.useState<string | null>(null);
  const [loading] = React.useState(false);

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
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 32,
  },
});

