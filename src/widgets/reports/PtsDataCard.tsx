import React from "react";
import { StyleSheet, Text, View } from "react-native";
import type { Report } from "../../types/report";
import { colors } from "../../shared/theme/colors";

type Props = {
  report: Report;
};

export function PtsDataCard({ report }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Данные из ПТС</Text>

      <View style={styles.rows}>
        {report.ptsData.map((row) => (
          <View key={row.label} style={styles.row}>
            <Text style={styles.label}>{row.label}</Text>
            <Text style={styles.value}>{row.value}</Text>
          </View>
        ))}
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
    fontWeight: "800",
    color: colors.text.primary,
    marginBottom: 10,
  },
  rows: {
    gap: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  label: {
    fontSize: 12,
    color: colors.text.subtle,
    flex: 1,
  },
  value: {
    fontSize: 12,
    color: colors.text.primary,
    flex: 1,
    textAlign: "right",
    fontWeight: "600",
  },
});

