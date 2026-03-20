import React from "react";
import { Alert, View } from "react-native";
import { ClientReportCard } from "../profile/ClientReportCard";
import type { Report } from "../../data/reports";

type Props = {
  reports: Report[];
  onOpenReport: (id: string) => void;
};

export function ReportsList({ reports, onOpenReport }: Props) {
  return (
    <View>
      {reports.map((r) => (
        <ClientReportCard
          key={r.id}
          report={r}
          onOpen={() => onOpenReport(r.id)}
          onDownloadPdf={() => {
            Alert.alert("PDF пока недоступен");
          }}
        />
      ))}
    </View>
  );
}

