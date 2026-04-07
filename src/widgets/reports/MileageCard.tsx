import React from "react";
import { StyleSheet, Text, View } from "react-native";
import type { Report } from "../../entities/report/types";
import { shadowStyle } from "../../shared/theme/shadow";

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
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  label: {
    fontSize: 12,
    color: "#979797",
    flex: 1,
  },
  value: {
    fontSize: 13,
    color: "#1E1E1E",
    fontWeight: "800",
    textAlign: "right",
  },
});

