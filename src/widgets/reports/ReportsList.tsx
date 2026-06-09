import React from "react";
import { View } from "react-native";
import { downloadReportPdf } from "../../services/reportPdfService";
import type { Report } from "../../types/report";
import { ClientReportCard } from "../profile/ClientReportCard";

type Props = {
  reports: Report[];
  onOpenReport: (id: string) => void;
  onPdfError?: (message: string) => void;
  showPdfDownload?: boolean;
};

export function ReportsList({
  reports,
  onOpenReport,
  onPdfError,
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
          onDownloadPdf={async () => {
            try {
              await downloadReportPdf(r);
            } catch (e) {
              onPdfError?.(
                e instanceof Error ? e.message : "Не удалось создать PDF.",
              );
            }
          }}
        />
      ))}
    </View>
  );
}
