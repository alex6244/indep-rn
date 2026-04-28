import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { ImageSourcePropType } from "react-native";
import { FONT_FAMILY } from "../../shared/theme/fonts";
import { shadowStyle } from "../../shared/theme/shadow";
import { colors } from "../../shared/theme/colors";
import { radius } from "../../shared/theme/radius";
import { spacing } from "../../shared/theme/spacing";

type ClientReport = {
  id: string;
  price: string;
  title: string;
  subtitle: string;
  city: string;
  imageUrl: ImageSourcePropType;
};

type Props = {
  report: ClientReport;
  onOpen: () => void;
  onDownloadPdf: () => void;
};

export function ClientReportCard({ report, onOpen, onDownloadPdf }: Props) {
  return (
    <View style={styles.card}>
      <Image source={report.imageUrl} style={styles.image} />
      <View style={styles.body}>
        <Text style={styles.price}>{report.price}</Text>
        <Text style={styles.subtitle} numberOfLines={2}>
          {report.subtitle}
        </Text>
        <Text style={styles.title} numberOfLines={2}>
          {report.title}
        </Text>
        <TouchableOpacity style={styles.ctaButton} onPress={onOpen}>
          <Text style={styles.ctaText}>Открыть отчёт</Text>
        </TouchableOpacity>
        <View style={styles.footerRow}>
          <Text style={styles.city}>{report.city}</Text>
          <TouchableOpacity onPress={onDownloadPdf}>
            <Text style={styles.pdfLink}>Скачать отчёт PDF</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface.primary,
    borderRadius: radius.lg + 4,
    overflow: "hidden",
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    ...(shadowStyle({
      boxShadow: "0px 4px 10px rgba(0,0,0,0.06)",
      shadowColor: colors.text.primary,
      shadowOpacity: 0.06,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 4,
    }) as object),
    elevation: 4,
  },
  image: {
    width: "100%",
    height: 176,
  },
  body: {
    padding: spacing.lg,
    gap: 4,
  },
  price: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.text.primary,
  },
  subtitle: {
    fontSize: 12,
    color: colors.text.subtle,
  },
  title: {
    fontSize: 12,
    color: colors.text.subtle,
    marginBottom: 4,
  },
  ctaButton: {
    marginTop: 8,
    borderRadius: radius.lg,
    backgroundColor: colors.brand.primary,
    minHeight: 44,
    paddingVertical: spacing.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaText: {
    color: colors.text.inverse,
    fontSize: 14,
    fontWeight: "600",
    fontFamily: FONT_FAMILY.button,
  },
  footerRow: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  city: {
    fontSize: 11,
    color: colors.text.subtle,
  },
  pdfLink: {
    fontSize: 11,
    color: colors.status.success,
    textDecorationLine: "underline",
    fontFamily: FONT_FAMILY.button,
  },
});

