import { Platform } from "react-native";
import { figmaNavBar } from "../theme/figma.generated";

/**
 * Tab bar sizing utilities.
 * Must match Figma «Навигационная панель» and `(tabs)/_layout.tsx`.
 */
export const TAB_BAR_INNER_HEIGHT = figmaNavBar.height;

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

