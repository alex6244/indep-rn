import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type ClientReport = {
  id: string;
  price: string;
  title: string;
  subtitle: string;
  city: string;
  imageUrl: string;
};

type Props = {
  report: ClientReport;
  onOpen: () => void;
  onDownloadPdf: () => void;
};

export function ClientReportCard({ report, onOpen, onDownloadPdf }: Props) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: report.imageUrl }} style={styles.image} />
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
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    overflow: "hidden",
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  image: {
    width: "100%",
    height: 176,
  },
  body: {
    padding: 16,
    gap: 4,
  },
  price: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1E1E1E",
  },
  subtitle: {
    fontSize: 12,
    color: "#777",
  },
  title: {
    fontSize: 12,
    color: "#777",
    marginBottom: 4,
  },
  ctaButton: {
    marginTop: 8,
    borderRadius: 16,
    backgroundColor: "#DB4431",
    paddingVertical: 10,
    alignItems: "center",
  },
  ctaText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  footerRow: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  city: {
    fontSize: 11,
    color: "#777",
  },
  pdfLink: {
    fontSize: 11,
    color: "#16A34A",
    textDecorationLine: "underline",
  },
});

