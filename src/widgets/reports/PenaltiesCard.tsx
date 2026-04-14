import React from "react";
import { StyleSheet, Text, View } from "react-native";
import type { Report } from "../../types/report";

type Props = {
  report: Report;
};

export function PenaltiesCard({ report }: Props) {
  const penalties = report.penalties ?? [];
  const allPaid = penalties.length > 0 && penalties.every((p) => p.paid);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Штрафы</Text>
        <View
          style={[
            styles.badge,
            { backgroundColor: allPaid ? "#EAF7EE" : "#FFF1F3" },
          ]}
        >
          <Text style={styles.badgeText}>{allPaid ? "Оплачены" : "Не оплачены"}</Text>
        </View>
      </View>

      {penalties.length === 0 ? (
        <Text style={styles.emptyText}>Штрафов не найдено</Text>
      ) : (
        <View style={styles.items}>
          {penalties.map((p, idx) => (
            <View key={`${p.amountText}-${idx}`} style={styles.item}>
              <View style={styles.itemTop}>
                <View style={[styles.dot, { backgroundColor: "#DB4431" }]} />
                <Text style={styles.amount}>{p.amountText}</Text>
              </View>
              <Text style={styles.date}>{p.dateText}</Text>
              <Text style={styles.desc}>{p.descriptionText}</Text>
            </View>
          ))}
        </View>
      )}
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
    borderWidth: 2,
    borderColor: "#DB4431",
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
    fontWeight: "900",
    color: "#1E1E1E",
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  badgeText: {
    color: "#4DB95C",
    fontSize: 11,
    fontWeight: "700",
  },
  emptyText: {
    fontSize: 12,
    color: "#777777",
    fontWeight: "600",
  },
  items: {
    gap: 14,
  },
  item: {
    gap: 4,
  },
  itemTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },
  amount: {
    color: "#DB4431",
    fontSize: 13,
    fontWeight: "900",
  },
  date: {
    color: "#777777",
    fontSize: 12,
    fontWeight: "600",
  },
  desc: {
    color: "#1E1E1E",
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "600",
  },
});

