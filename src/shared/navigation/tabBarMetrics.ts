import { Platform } from "react-native";

/**
 * Tab bar sizing utilities.
 * Must match actual tab bar layout in `app/(tabs)/_layout.tsx`.
 */
export const TAB_BAR_INNER_HEIGHT = 72;

export function tabBarSafeAreaBottom(insetsBottom: number) {
  return Math.max(insetsBottom, Platform.OS === "ios" ? 10 : 8);
}

export function tabBarTotalHeight(insetsBottom: number) {
  return TAB_BAR_INNER_HEIGHT + tabBarSafeAreaBottom(insetsBottom);
}

/** Bottom padding for scroll content above tab bar + extra space. */
export function scrollBottomPaddingBelowTabBar(
  insetsBottom: number,
  extra = 12,
) {
  return tabBarTotalHeight(insetsBottom) + extra;
}

