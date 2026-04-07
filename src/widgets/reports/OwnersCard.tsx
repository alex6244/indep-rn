import React from "react";
import { StyleSheet, Text, View } from "react-native";
import type { Report } from "../../data/reports";
import { shadowStyle } from "../../shared/theme/shadow";

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
    marginBottom: 12,
  },
  group: {
    marginBottom: 12,
  },
  groupLabel: {
    fontSize: 12,
    color: "#979797",
    fontWeight: "600",
    marginBottom: 6,
  },
  groupValue: {
    fontSize: 13,
    color: "#1E1E1E",
    lineHeight: 18,
    fontWeight: "700",
  },
});

