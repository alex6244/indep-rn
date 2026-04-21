import React from "react";
import { StyleSheet, Text, View } from "react-native";
import type { Report } from "../../types/report";
import { colors } from "../../shared/theme/colors";

export function LegalCleanlinessCard({ report }: { report: Report }) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Юридическая чистота</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{report.legalCleanliness.badgeText}</Text>
        </View>
      </View>

      <View style={styles.items}>
        {report.legalCleanliness.items.map((it, idx) => (
          <View key={`${it.text}-${idx}`} style={styles.itemRow}>
            <View
              style={[
                styles.dot,
                { backgroundColor: it.tone === "ok" ? colors.status.success : colors.brand.primary },
              ]}
            />
            <Text style={styles.itemText}>{it.text}</Text>
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
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.text.primary,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: colors.status.successBg,
  },
  badgeText: {
    color: colors.status.success,
    fontSize: 11,
    fontWeight: "700",
  },
  items: {
    gap: 10,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    marginTop: 5,
  },
  itemText: {
    flex: 1,
    color: colors.text.primary,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600",
  },
});

