import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ReportsIcon from "../../assets/profile/reports.svg";
import WalletIcon from "../../assets/profile/wallet.svg";
import {
  PROFILE_STAT_CARD_RADIUS,
  PROFILE_STATS_ROW_GAP,
  PROFILE_STATS_ROW_PAD_H,
  useProfileStatCardSize,
} from "./profileStatCardMetrics";
import { shadowStyle } from "../../shared/theme/shadow";
const WALLET_W = 51.21;
const WALLET_H = 59.24;
const WALLET_LEFT = 103.23;
const WALLET_TOP = -5.45;
const WALLET_ROTATE = "32.32deg";

type Props = {
  published: number;
  balanceLabel: string;
  onPressBalance?: () => void;
};

export function ProfileStats({
  published,
  balanceLabel,
  onPressBalance,
}: Props) {
  const { cardW, cardH, walletS } = useProfileStatCardSize();

  const walletLeft = WALLET_LEFT * walletS;
  const walletTop = WALLET_TOP * walletS;
  const walletW = WALLET_W * walletS;
  const walletH = WALLET_H * walletS;

  const iconSize = Math.round(44 * walletS);

  return (
    <View style={styles.statsRow}>
      <View style={styles.statsInner}>
        <View
          style={[styles.statCardPublished, { width: cardW, height: cardH }]}
        >
          <Text style={styles.statLabel} numberOfLines={2}>
            Опубликовано объявлений
          </Text>
          <View style={styles.publishedRow}>
            <ReportsIcon
              width={iconSize}
              height={iconSize}
              style={styles.publishedIcon}
            />
            <Text
              style={[styles.statValue, walletS < 1 && styles.statValueCompact]}
            >
              {published}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.statCardBalance, { width: cardW, height: cardH }]}
          onPress={onPressBalance}
          activeOpacity={0.86}
          accessibilityRole="button"
        >
          <Text style={styles.statLabel}>Ваш баланс</Text>
          <Text
            style={[
              styles.statValueBalance,
              walletS < 1 && styles.statValueCompact,
            ]}
            numberOfLines={1}
          >
            {balanceLabel}
          </Text>
          <View
            style={[
              styles.walletWrap,
              {
                left: walletLeft,
                top: walletTop,
                width: walletW,
                height: walletH,
                pointerEvents: "none",
              },
            ]}
          >
            <WalletIcon width={walletW} height={walletH} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statsRow: {
    marginTop: 16,
    paddingHorizontal: PROFILE_STATS_ROW_PAD_H,
    alignItems: "center",
  },
  statsInner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: PROFILE_STATS_ROW_GAP,
  },
  statCardPublished: {
    borderRadius: PROFILE_STAT_CARD_RADIUS,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 8,
    justifyContent: "space-between",
    ...(shadowStyle({
      boxShadow: "0px 4px 10px rgba(0,0,0,0.04)",
      shadowColor: "#000",
      shadowOpacity: 0.04,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 2,
    }) as object),
    elevation: 2,
    overflow: "hidden",
  },
  statCardBalance: {
    borderRadius: PROFILE_STAT_CARD_RADIUS,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 8,
    position: "relative",
    overflow: "visible",
    ...(shadowStyle({
      boxShadow: "0px 4px 10px rgba(0,0,0,0.04)",
      shadowColor: "#000",
      shadowOpacity: 0.04,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 2,
    }) as object),
    elevation: 2,
  },
  publishedRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 4,
  },
  publishedIcon: {
    opacity: 0.95,
  },
  statLabel: {
    fontSize: 10,
    lineHeight: 13,
    color: "#999",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1E1E1E",
    marginBottom: 2,
  },
  statValueBalance: {
    marginTop: 6,
    fontSize: 20,
    fontWeight: "800",
    color: "#1E1E1E",
    maxWidth: "55%",
  },
  statValueCompact: {
    fontSize: 17,
  },
  walletWrap: {
    position: "absolute",
    transform: [{ rotate: WALLET_ROTATE }],
  },
});
