import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { reports } from "../data/reports";
import { ReportsBreadcrumb } from "../widgets/reports/ReportsBreadcrumb";
import { ReportsHeader } from "../widgets/reports/ReportsHeader";
import { ReportsList } from "../widgets/reports/ReportsList";

export default function ReportsScreen() {
  const router = useRouter();

  const openReportDetails = (id: string) => {
    router.push({ pathname: "/reports/[id]", params: { id } } as any);
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ReportsBreadcrumb active="Купленные отчёты" />
        <ReportsHeader title="Купленные отчёты" />
        <ReportsList reports={reports} onOpenReport={openReportDetails} />
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

