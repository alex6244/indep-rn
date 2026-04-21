import React from "react";
import { StyleSheet, Text, View } from "react-native";
import type { Report } from "../../types/report";
import { colors } from "../../shared/theme/colors";

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
    backgroundColor: colors.surface.card,
    borderRadius: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "900",
    color: colors.text.primary,
    marginBottom: 10,
  },
  text: {
    fontSize: 12,
    color: colors.text.tertiary,
    lineHeight: 18,
    fontWeight: "600",
  },
  rangeWrap: {
    marginTop: 12,
    backgroundColor: colors.surface.neutral,
    borderRadius: 14,
    padding: 12,
  },
  range: {
    color: colors.text.primary,
    fontSize: 12,
    fontWeight: "800",
  },
});

