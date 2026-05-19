import React from "react";
import { View } from "react-native";
import { ClientReportCard } from "../profile/ClientReportCard";
import type { Report } from "../../types/report";

type Props = {
  reports: Report[];
  onOpenReport: (id: string) => void;
  onPdfUnavailable?: () => void;
  showPdfDownload?: boolean;
};

export function ReportsList({
  reports,
  onOpenReport,
  onPdfUnavailable,
  showPdfDownload = true,
}: Props) {
  return (
    <View>
      {reports.map((r) => (
        <ClientReportCard
          key={r.id}
          report={r}
          onOpen={() => onOpenReport(r.id)}
          showPdfDownload={showPdfDownload}
          onDownloadPdf={() => {
            onPdfUnavailable?.();
          }}
        />
      ))}
    </View>
  );
}

