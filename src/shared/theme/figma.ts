/**
 * Figma ↔ app theme bridge.
 * Raw values: `figma.generated.ts` (npm run figma:build).
 * Semantic colors in UI: `colors.ts`.
 */
import { colors } from "./colors";
import { figmaColors, figmaNavBar, FIGMA_FILE_NAME } from "./figma.generated";

export { figmaColors, figmaNavBar, FIGMA_FILE_NAME };

/** Tab bar layout — keep in sync with `tabBarMetrics.ts` and `(tabs)/_layout.tsx`. */
export const figmaTabBar = {
  height: figmaNavBar.height,
  paddingHorizontal: figmaNavBar.paddingHorizontal,
  paddingTop: figmaNavBar.paddingTop,
  paddingBottom: figmaNavBar.paddingBottom,
  iconSize: figmaNavBar.tabItemSize,
  /** Inner bar height without safe-area inset (Figma frame height). */
  innerHeight: figmaNavBar.height,
  backgroundColor: colors.surface.neutral,
  inactiveTint: colors.icon.muted,
  activeTint: colors.brand.primary,
} as const;
