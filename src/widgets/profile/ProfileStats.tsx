import React, { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ReportsIcon from "../../assets/profile/reports.svg";
import { ProfileWalletIcon } from "./ProfileWalletIcon";
import {
  PROFILE_STATS_ROW_GAP,
  PROFILE_STATS_ROW_PAD_H,
  useProfileStatCardSize,
} from "./profileStatCardMetrics";
import { profileStatCardStyles as cardStyles } from "./profileStatCardStyles";

/** Figma wallet (162×97 card) + 50% как Best в quick-actions. */
const WALLET_FIGMA = {
  width: 51.21,
  height: 59.24,
  right: -10,
  top: -10,
  sizeScale: 1.5,
} as const;

const PUBLISHED_ICON_BASE = 44;
const BALANCE_TEXT_PAD_BASE = 52;

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
  const isCompact = cardScale < 1;

  const layout = useMemo(
    () => ({
      walletW: WALLET_FIGMA.width * WALLET_FIGMA.sizeScale * cardScale,
      walletH: WALLET_FIGMA.height * WALLET_FIGMA.sizeScale * cardScale,
      walletRight: WALLET_FIGMA.right * cardScale,
      walletTop: WALLET_FIGMA.top * cardScale,
      iconSize: Math.round(PUBLISHED_ICON_BASE * cardScale),
      balancePaddingRight: Math.round(BALANCE_TEXT_PAD_BASE * cardScale),
    }),
    [cardScale],
  );

  const cardSizeStyle = { width: cardW, height: cardH };

  return (
    <View style={styles.statsRow}>
      <View style={styles.statsInner}>
        <View style={[cardStyles.card, cardSizeStyle]}>
          <Text style={cardStyles.label} numberOfLines={2}>
            Опубликовано объявлений
          </Text>
          <View style={styles.publishedRow}>
            <ReportsIcon
              width={layout.iconSize}
              height={layout.iconSize}
              style={styles.publishedIcon}
            />
            <Text
              style={[
                cardStyles.value,
                styles.statValueRight,
                isCompact && cardStyles.valueCompact,
              ]}
            >
              {published}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[cardStyles.card, cardStyles.cardBalance, cardSizeStyle]}
          onPress={onPressBalance}
          activeOpacity={0.86}
          accessibilityRole="button"
          accessibilityLabel="Ваш баланс"
        >
          <Text style={cardStyles.label}>Ваш баланс</Text>

          <View style={[styles.balanceBottom, { paddingRight: layout.balancePaddingRight }]}>
            <Text
              style={[
                cardStyles.value,
                cardStyles.valueFullWidth,
                isCompact && cardStyles.valueCompact,
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
                right: layout.walletRight,
                top: layout.walletTop,
                width: layout.walletW,
                height: layout.walletH,
              },
            ]}
            pointerEvents="none"
          >
            <ProfileWalletIcon width={layout.walletW} height={layout.walletH} />
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
  balanceBottom: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-start",
    paddingRight: 4,
    zIndex: 1,
  },
  walletWrap: {
    position: "absolute",
    zIndex: 2,
  },
});
