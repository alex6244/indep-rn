import React from "react";
import { StyleSheet, Text, View } from "react-native";
import type { Report } from "../../types/report";
import { colors } from "../../shared/theme/colors";

export function OwnersCard({ report }: { report: Report }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>2 владельца по ПТС</Text>

      <View style={styles.group}>
        <Text style={styles.groupLabel}>{report.owners.jur.title}</Text>
        <Text style={styles.groupValue}>{report.owners.jur.value}</Text>
      </View>

      <View style={styles.group}>
        <Text style={styles.groupLabel}>{report.owners.phys.title}</Text>
        <Text style={styles.groupValue}>{report.owners.phys.value}</Text>
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
    marginBottom: 12,
  },
  group: {
    marginBottom: 12,
  },
  groupLabel: {
    fontSize: 12,
    color: colors.text.subtle,
    fontWeight: "600",
    marginBottom: 6,
  },
  groupValue: {
    fontSize: 13,
    color: colors.text.primary,
    lineHeight: 18,
    fontWeight: "700",
  },
});

