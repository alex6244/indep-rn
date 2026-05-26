import type { TextStyle } from "react-native";
import { colors } from "../../../shared/theme/colors";
import { figmaText, textStyle } from "../../../shared/theme/typography";

/** Moderustic — Figma picker-report screens. */
export const prText: TextStyle = textStyle({});

export function prStyle(style: TextStyle): TextStyle {
  return { ...prText, ...style };
}

/** Typography tokens from picker-report screens (Figma reference). */
export const PR_TYPO = {
  sectionTitle: prStyle({ ...figmaText.subtitle, color: colors.text.primary }),
  confirmTitle: prStyle({ ...figmaText.screenTitle, color: colors.text.primary }),
  confirmSubtitle: prStyle({ ...figmaText.value, fontWeight: "400", lineHeight: 18, color: colors.text.tertiary }),
  cardTitle: prStyle({ ...figmaText.subtitle, color: colors.text.primary }),
  fieldLabel: prStyle({ ...figmaText.bodyMedium, color: colors.text.primary }),
  fieldLabelMuted: prStyle({ ...figmaText.captionMedium, color: colors.text.tertiary }),
  body: prStyle({ ...figmaText.body, color: colors.text.primary }),
  bodyMuted: prStyle({ ...figmaText.body, color: colors.text.tertiary }),
  input: prStyle({ ...figmaText.body, color: colors.text.primary }),
  radio: prStyle({ ...figmaText.bodyMedium, color: colors.text.tertiary }),
  radioActive: prStyle({ ...figmaText.bodySemibold, color: colors.brand.primary }),
  tab: prStyle({ ...figmaText.bodySemibold, color: colors.text.tertiary }),
  tabActive: prStyle({ ...figmaText.bodySemibold, color: colors.text.inverse }),
  button: prStyle({ ...figmaText.bodyLargeMedium, color: colors.text.inverse }),
  buttonSmall: prStyle({ ...figmaText.bodyLargeMedium, color: colors.text.inverse }),
  link: prStyle({ ...figmaText.bodySemibold, color: colors.brand.primary }),
  caption: prStyle({ ...figmaText.captionMedium, color: colors.text.tertiary }),
  value: prStyle({ ...figmaText.value, color: colors.text.primary }),
  valueMuted: prStyle({ ...figmaText.value, color: colors.text.tertiary }),
  rowLabel: prStyle({ ...figmaText.bodyMedium, color: colors.text.subtle }),
  rowValue: prStyle({ ...figmaText.bodySemibold, color: colors.text.primary }),
  badge: prStyle({ ...figmaText.caption, fontSize: 11, lineHeight: 15, fontWeight: "600" }),
  modalTitle: prStyle({ ...figmaText.bodyLargeBold, color: colors.text.primary }),
  modalBody: prStyle({ ...figmaText.value, fontWeight: "400", lineHeight: 18, color: colors.text.tertiary }),
} as const;
