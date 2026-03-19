import React from "react";
import { StyleSheet, Text, View } from "react-native";
import ReportsIcon from "../../assets/profile/reports.svg";
import WalletIcon from "../../assets/profile/wallet.svg";

type Props = {
  published: number;
  balanceLabel: string;
};

export function ProfileStats({ published, balanceLabel }: Props) {
  return (
    <View style={styles.statsRow}>
      <View style={styles.statCard}>
        <Text style={styles.statLabel}>Опубликовано объявлений</Text>
        <Text style={styles.statValue}>{published}</Text>
        <ReportsIcon width={64} height={64} style={styles.statIcon} />
      </View>
      <View style={styles.statCard}>
        <Text style={styles.statLabel}>Ваш баланс</Text>
        <Text style={styles.statValue}>{balanceLabel}</Text>
        <WalletIcon width={64} height={64} style={styles.statIcon} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
    paddingHorizontal: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  statLabel: {
    fontSize: 11,
    color: "#999",
  },
  statValue: {
    marginTop: 8,
    fontSize: 22,
    fontWeight: "800",
    color: "#1E1E1E",
  },
  statIcon: {
    position: "absolute",
    right: 8,
    bottom: 8,
  },
});
