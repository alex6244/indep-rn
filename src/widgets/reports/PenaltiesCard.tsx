import React from "react";
import { StyleSheet, Text, View } from "react-native";
import type { Report } from "../../types/report";
import { colors } from "../../shared/theme/colors";

type Props = {
  report: Report;
};

export function PenaltiesCard({ report }: Props) {
  const penalties = report.penalties ?? [];
  const hasPenalties = penalties.length > 0;
  const allPaid = hasPenalties && penalties.every((p) => p.paid);

  const badgeLabel = !hasPenalties
    ? "Нет штрафов"
    : allPaid
      ? "Оплачены"
      : "Не оплачены";
  const badgeBg = !hasPenalties || allPaid ? colors.status.successBg : colors.status.warningBg;
  const badgeTextColor = !hasPenalties || allPaid ? colors.status.success : colors.status.warning;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Штрафы</Text>
        <View style={[styles.badge, { backgroundColor: badgeBg }]}>
          <Text style={[styles.badgeText, { color: badgeTextColor }]}>
            {badgeLabel}
          </Text>
        </View>
      </View>

      {penalties.length === 0 ? (
        <Text style={styles.emptyText}>Штрафов не найдено</Text>
      ) : (
        <View style={styles.items}>
          {penalties.map((p, idx) => (
            <View key={`${p.amountText}-${idx}`} style={styles.item}>
              <View style={styles.itemTop}>
                <View style={[styles.dot, { backgroundColor: colors.brand.primary }]} />
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
    backgroundColor: colors.surface.card,
    borderRadius: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: colors.border.strong,
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
    color: colors.text.primary,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
  },
  emptyText: {
    fontSize: 12,
    color: colors.text.tertiary,
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
    color: colors.brand.primary,
    fontSize: 13,
    fontWeight: "900",
  },
  date: {
    color: colors.text.tertiary,
    fontSize: 12,
    fontWeight: "600",
  },
  desc: {
    color: colors.text.primary,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "600",
  },
});
