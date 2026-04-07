import { useMemo } from "react";
import { useWindowDimensions } from "react-native";

/** Figma stat cards; quick-action row uses the same height. */
export const PROFILE_STAT_CARD_WIDTH = 162;
export const PROFILE_STAT_CARD_HEIGHT = 97;
export const PROFILE_STATS_ROW_GAP = 12;
export const PROFILE_STATS_ROW_PAD_H = 16;
export const PROFILE_STAT_CARD_RADIUS = 12;

const NATURAL_ROW_WIDTH =
  PROFILE_STAT_CARD_WIDTH * 2 + PROFILE_STATS_ROW_GAP;

export function useProfileStatCardSize() {
  const { width: windowWidth } = useWindowDimensions();

  return useMemo(() => {
    const innerWidth = windowWidth - PROFILE_STATS_ROW_PAD_H * 2;

    if (innerWidth >= NATURAL_ROW_WIDTH) {
      return {
        cardW: PROFILE_STAT_CARD_WIDTH,
        cardH: PROFILE_STAT_CARD_HEIGHT,
        walletS: 1,
      };
    }

    const w = Math.max(130, (innerWidth - PROFILE_STATS_ROW_GAP) / 2);
    const s = w / PROFILE_STAT_CARD_WIDTH;
    return {
      cardW: w,
      cardH: PROFILE_STAT_CARD_HEIGHT * s,
      walletS: s,
    };
  }, [windowWidth]);
}