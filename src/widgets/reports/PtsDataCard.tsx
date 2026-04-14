import React from "react";
import { StyleSheet, Text, View } from "react-native";
import type { Report } from "../../types/report";
import { shadowStyle } from "../../shared/theme/shadow";

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
    fontWeight: "800",
    color: "#1E1E1E",
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
    color: "#979797",
    flex: 1,
  },
  value: {
    fontSize: 12,
    color: "#1E1E1E",
    flex: 1,
    textAlign: "right",
    fontWeight: "600",
  },
});

