import React from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FONT_FAMILY } from "../../shared/theme/fonts";
import { colors } from "../../shared/theme/colors";
import { InlineMessage } from "../../shared/ui/InlineMessage";
import type { Report } from "../../types/report";
import { downloadReportPdf } from "../../services/reportPdfService";

type Props = {
  reportId: string;
  report?: Report;
};

export function ReportDetailsActions({ reportId: _reportId, report }: Props) {
  const [notice, setNotice] = React.useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = React.useState(false);

  const handleDownloadPdf = async () => {
    if (!report) {
      setNotice("Данные отчёта ещё загружаются.");
      return;
    }
    setPdfLoading(true);
    setNotice(null);
    try {
      await downloadReportPdf(report);
    } catch (e) {
      setNotice(e instanceof Error ? e.message : "Не удалось создать PDF. Попробуйте ещё раз.");
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <View style={styles.wrap}>
      {notice ? <InlineMessage tone="info" message={notice} /> : null}

      <TouchableOpacity
        style={[styles.btn, styles.btnSecondary, pdfLoading && styles.btnDisabled]}
        onPress={handleDownloadPdf}
        disabled={pdfLoading}
        accessibilityRole="button"
        accessibilityLabel="Скачать отчёт в формате PDF"
      >
        {pdfLoading ? (
          <ActivityIndicator size="small" color={colors.brand.primary} />
        ) : (
          <Text style={styles.btnTextSecondary}>Скачать отчёт PDF</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: 16,
    gap: 10,
    marginBottom: 24,
  },
  btn: {
    borderRadius: 14,
    minHeight: 48,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  btnSecondary: {
    backgroundColor: colors.control.buttonSecondaryBg,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  btnTextSecondary: {
    color: colors.control.buttonSecondaryText,
    fontSize: 14,
    fontWeight: "700",
    fontFamily: FONT_FAMILY.regular,
  },
});
