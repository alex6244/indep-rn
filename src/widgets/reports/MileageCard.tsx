import React from "react";
import { StyleSheet, Text, View } from "react-native";
import type { Report } from "../../types/report";
import { colors } from "../../shared/theme/colors";

export function MileageCard({ report }: { report: Report }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Пробег</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Пробег авто</Text>
        <Text style={styles.value}>{report.mileageText}</Text>
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
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  label: {
    fontSize: 12,
    color: colors.text.subtle,
    flex: 1,
  },
  value: {
    fontSize: 13,
    color: colors.text.primary,
    fontWeight: "800",
    textAlign: "right",
  },
});

