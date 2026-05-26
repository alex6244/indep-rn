import type { TextStyle } from "react-native";
import { FONT_FAMILY } from "./fonts";
import { figmaNavBar } from "./figma.generated";

/**
 * Moderustic typography from Figma file «Indep/Лизинг/Далматин».
 * Weights 300–700 only (variable font; no 800/900).
 */
const base: TextStyle = { fontFamily: FONT_FAMILY.regular };

export function textStyle(style: TextStyle): TextStyle {
  return { ...base, ...style };
}

/** Named text styles — sizes/line-heights match top Figma Moderustic pairs. */
export const figmaText = {
  tabLabel: textStyle({
    fontSize: figmaNavBar.labelFontSize,
    lineHeight: figmaNavBar.labelLineHeight,
    fontWeight: "400",
  }),
  micro: textStyle({ fontSize: 8, lineHeight: 12, fontWeight: "400" }),
  caption: textStyle({ fontSize: 12, lineHeight: 16, fontWeight: "400" }),
  captionMedium: textStyle({ fontSize: 12, lineHeight: 16, fontWeight: "500" }),
  captionLight: textStyle({ fontSize: 12, lineHeight: 16, fontWeight: "300" }),
  body: textStyle({ fontSize: 14, lineHeight: 18, fontWeight: "400" }),
  bodyMedium: textStyle({ fontSize: 14, lineHeight: 18, fontWeight: "500" }),
  bodySemibold: textStyle({ fontSize: 14, lineHeight: 18, fontWeight: "600" }),
  bodyBold: textStyle({ fontSize: 14, lineHeight: 18, fontWeight: "700" }),
  value: textStyle({ fontSize: 13, lineHeight: 16, fontWeight: "600" }),
  bodyLarge: textStyle({ fontSize: 16, lineHeight: 20, fontWeight: "400" }),
  bodyLargeMedium: textStyle({ fontSize: 16, lineHeight: 20, fontWeight: "500" }),
  bodyLargeBold: textStyle({ fontSize: 16, lineHeight: 20, fontWeight: "700" }),
  subtitle: textStyle({ fontSize: 18, lineHeight: 22, fontWeight: "500" }),
  subtitleBold: textStyle({ fontSize: 18, lineHeight: 22, fontWeight: "700" }),
  screenTitle: textStyle({ fontSize: 22, lineHeight: 26, fontWeight: "700" }),
  title: textStyle({ fontSize: 20, lineHeight: 24, fontWeight: "500" }),
  titleBold: textStyle({ fontSize: 20, lineHeight: 24, fontWeight: "700" }),
  heading: textStyle({ fontSize: 24, lineHeight: 28, fontWeight: "500" }),
  headingBold: textStyle({ fontSize: 24, lineHeight: 28, fontWeight: "700" }),
  display: textStyle({ fontSize: 32, lineHeight: 36, fontWeight: "500" }),
  displayLarge: textStyle({ fontSize: 40, lineHeight: 44, fontWeight: "500" }),
} as const;

/** @deprecated Prefer `figmaText` — kept for gradual migration. */
export const typography = {
  sizes: {
    tabLabel: figmaNavBar.labelFontSize,
    caption: 12,
    body: 14,
    bodyLarge: 16,
    title: 20,
    heading: 24,
  },
  textRegular: { ...base, fontWeight: "400" } as TextStyle,
  buttonText: { ...base, fontWeight: "500" } as TextStyle,
  title: { ...base, fontWeight: "700" } as TextStyle,
  caption: { ...base, fontWeight: "400" } as TextStyle,
};
