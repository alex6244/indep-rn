import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ReportsIcon from "../../assets/profile/reports.svg";
import { ProfileWalletIcon } from "./ProfileWalletIcon";
import {
  PROFILE_STAT_CARD_RADIUS,
  PROFILE_STATS_ROW_GAP,
  PROFILE_STATS_ROW_PAD_H,
  useProfileStatCardSize,
} from "./profileStatCardMetrics";
import { colors } from "../../shared/theme/colors";
import { shadowStyle } from "../../shared/theme/shadow";

const profileStatCardShadow = shadowStyle({
  boxShadow: "0px 4px 10px rgba(0,0,0,0.04)",
  shadowColor: colors.text.primary,
  shadowOpacity: 0.04,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 4 },
  elevation: 2,
}) as object;

/** Figma wallet + ~50% как у Best на quick-actions. */
const WALLET_BASE_W = 51.21;
const WALLET_BASE_H = 59.24;
const WALLET_SIZE_SCALE = 1.5;
const WALLET_RIGHT = -10;
const WALLET_TOP = -10;

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
  const { cardW, cardH, cardScale } = useProfileStatCardSize();

  const walletRight = WALLET_RIGHT * cardScale;
  const walletTop = WALLET_TOP * cardScale;
  const walletW = WALLET_BASE_W * WALLET_SIZE_SCALE * cardScale;
  const walletH = WALLET_BASE_H * WALLET_SIZE_SCALE * cardScale;

  const iconSize = Math.round(44 * cardScale);

  return (
    <View style={styles.statsRow}>
      <View style={styles.statsInner}>
        <View style={[styles.statCard, { width: cardW, height: cardH }]}>
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
              style={[
                styles.statValue,
                styles.statValueRight,
                cardScale < 1 && styles.statValueCompact,
              ]}
            >
              {published}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.statCard, styles.statCardBalance, { width: cardW, height: cardH }]}
          onPress={onPressBalance}
          activeOpacity={0.86}
          accessibilityRole="button"
        >
          <Text style={styles.statLabel}>Ваш баланс</Text>

          <View
            style={[
              styles.balanceBottom,
              { paddingRight: Math.round(52 * cardScale) },
            ]}
          >
            <Text
              style={[
                styles.statValue,
                styles.statValueFullWidth,
                cardScale < 1 && styles.statValueCompact,
              ]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.72}
            >
              {balanceLabel}
            </Text>
          </View>

          <View
            style={[
              styles.walletWrap,
              {
                right: walletRight,
                top: walletTop,
                width: walletW,
                height: walletH,
              },
            ]}
            pointerEvents="none"
          >
            <ProfileWalletIcon width={walletW} height={walletH} />
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
  statCard: {
    borderRadius: PROFILE_STAT_CARD_RADIUS,
    backgroundColor: colors.surface.primary,
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 8,
    justifyContent: "space-between",
    overflow: "hidden",
    ...profileStatCardShadow,
    elevation: 2,
  },
  statCardBalance: {
    position: "relative",
  },
  publishedRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    flex: 1,
  },
  statValueRight: {
    marginLeft: "auto",
    textAlign: "right",
  },
  publishedIcon: {
    opacity: 0.95,
  },
  statLabel: {
    fontSize: 10,
    lineHeight: 13,
    color: colors.text.muted,
  },
  statValue: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: "500",
    color: colors.text.primary,
    marginBottom: 2,
  },
  balanceBottom: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-start",
    paddingRight: 4,
    zIndex: 1,
  },
  statValueFullWidth: {
    width: "100%",
    marginBottom: 0,
  },
  statValueCompact: {
    fontSize: 17,
  },
  walletWrap: {
    position: "absolute",
    zIndex: 2,
  },
});
