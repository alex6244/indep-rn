import React from "react";
import { StyleSheet, Text, View } from "react-native";
import type { Report } from "../../data/reports";
import { shadowStyle } from "../../shared/theme/shadow";

type Props = {
  report: Report;
};

export function CostEstimationCard({ report }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Оценка стоимости</Text>
      <Text style={styles.text}>{report.costEstimation.text}</Text>
      <View style={styles.rangeWrap}>
        <Text style={styles.range}>{report.costEstimation.rangeText}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    ...(shadowStyle({
      boxShadow: "0px 4px 10px rgba(0,0,0,0.06)",
      shadowColor: "#000000",
      shadowOpacity: 0.06,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 4,
    }) as object),
    elevation: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "900",
    color: "#1E1E1E",
    marginBottom: 10,
  },
  text: {
    fontSize: 12,
    color: "#777777",
    lineHeight: 18,
    fontWeight: "600",
  },
  rangeWrap: {
    marginTop: 12,
    backgroundColor: "#F7F7F7",
    borderRadius: 14,
    padding: 12,
  },
  range: {
    color: "#1E1E1E",
    fontSize: 12,
    fontWeight: "800",
  },
});

