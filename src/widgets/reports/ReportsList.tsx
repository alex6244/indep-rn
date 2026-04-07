import React from "react";
import { View } from "react-native";
import { ClientReportCard } from "../profile/ClientReportCard";
import type { Report } from "../../data/reports";

type Props = {
  reports: Report[];
  onOpenReport: (id: string) => void;
  onPdfUnavailable?: () => void;
};

export function ReportsList({ reports, onOpenReport, onPdfUnavailable }: Props) {
  return (
    <View>
      {reports.map((r) => (
        <ClientReportCard
          key={r.id}
          report={r}
          onOpen={() => onOpenReport(r.id)}
          onDownloadPdf={() => {
            onPdfUnavailable?.();
          }}
        />
      ))}
    </View>
  );
}

