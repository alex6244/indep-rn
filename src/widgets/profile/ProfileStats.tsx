import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ReportsIcon from "../../assets/profile/reports.svg";
import WalletIcon from "../../assets/profile/wallet.svg";

type Props = {
  published: number;
  balanceLabel: string;
  onPressBalance?: () => void;
};

export function ProfileStats({ published, balanceLabel, onPressBalance }: Props) {
  return (
    <View style={styles.statsRow}>
      <View style={styles.statCardPublished}>
        <Text style={styles.statLabel}>Опубликовано объявлений</Text>
        <View style={styles.publishedRow}>
          <ReportsIcon width={56} height={56} style={styles.publishedIcon} />
          <Text style={styles.statValue}>{published}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.statCardBalance}
        onPress={onPressBalance}
        activeOpacity={0.86}
        accessibilityRole="button"
      >
        <Text style={styles.statLabel}>Ваш баланс</Text>
        <Text style={styles.statValueBalance}>{balanceLabel}</Text>
        <WalletIcon width={56} height={56} style={styles.walletIcon} />
      </TouchableOpacity>
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
  statCardPublished: {
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
  statCardBalance: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 14,
    paddingRight: 64,
    paddingBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    position: "relative",
  },
  publishedRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: 8,
    gap: 4,
  },
  publishedIcon: {
    opacity: 0.95,
  },
  statLabel: {
    fontSize: 11,
    color: "#999",
  },
  statValue: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1E1E1E",
    marginBottom: 4,
  },
  statValueBalance: {
    marginTop: 8,
    fontSize: 22,
    fontWeight: "800",
    color: "#1E1E1E",
    maxWidth: "85%",
  },
  walletIcon: {
    position: "absolute",
    right: 8,
    bottom: 8,
    opacity: 0.95,
  },
});
