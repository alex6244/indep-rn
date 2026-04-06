import { Platform } from "react-native";

/**
 * Высота зоны таббара над safe-area (SVG-иконки 62×62 с встроенным текстом + отступы).
 * Должна соответствовать фактической вёрстке в `_layout.tsx`.
 */
export const TAB_BAR_INNER_HEIGHT = 72;

export function tabBarSafeAreaBottom(insetsBottom: number) {
  return Math.max(insetsBottom, Platform.OS === "ios" ? 10 : 8);
}

export function tabBarTotalHeight(insetsBottom: number) {
  return TAB_BAR_INNER_HEIGHT + tabBarSafeAreaBottom(insetsBottom);
}

/** Нижний отступ для ScrollView над таббаром + запас. */
export function scrollBottomPaddingBelowTabBar(
  insetsBottom: number,
  extra = 12,
) {
  return tabBarTotalHeight(insetsBottom) + extra;
}
