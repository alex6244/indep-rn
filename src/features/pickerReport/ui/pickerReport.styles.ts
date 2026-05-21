import type { TextStyle } from "react-native";
import { colors } from "../../../shared/theme/colors";
import { FONT_FAMILY } from "../../../shared/theme/fonts";

/** Moderustic base — variable font; use 400–700 only (no 800/900 per design). */
export const prText: TextStyle = { fontFamily: FONT_FAMILY.regular };

export function prStyle(style: TextStyle): TextStyle {
  return { ...prText, ...style };
}

/** Typography tokens from picker-report screens (Figma reference). */
export const PR_TYPO = {
  /** Card section: «Заполните пробег», «Дефекты» */
  sectionTitle: prStyle({
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 22,
    color: colors.text.primary,
  }),
  /** Confirm: «Всё верно?» */
  confirmTitle: prStyle({
    fontSize: 22,
    fontWeight: "700",
    lineHeight: 26,
    color: colors.text.primary,
  }),
  confirmSubtitle: prStyle({
    fontSize: 13,
    fontWeight: "400",
    lineHeight: 18,
    color: colors.text.tertiary,
  }),
  /** Confirm card headings */
  cardTitle: prStyle({
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 22,
    color: colors.text.primary,
  }),
  /** Field labels: VIN, Марка, Тип владельца */
  fieldLabel: prStyle({
    fontSize: 14,
    fontWeight: "500",
    color: colors.text.primary,
  }),
  /** Small muted labels above date inputs */
  fieldLabelMuted: prStyle({
    fontSize: 12,
    fontWeight: "500",
    color: colors.text.tertiary,
  }),
  /** Checkbox / list row text */
  body: prStyle({
    fontSize: 14,
    fontWeight: "400",
    color: colors.text.primary,
  }),
  bodyMuted: prStyle({
    fontSize: 14,
    fontWeight: "400",
    color: colors.text.tertiary,
  }),
  input: prStyle({
    fontSize: 14,
    fontWeight: "400",
    color: colors.text.primary,
  }),
  radio: prStyle({
    fontSize: 14,
    fontWeight: "500",
    color: colors.text.tertiary,
  }),
  radioActive: prStyle({
    fontSize: 14,
    fontWeight: "600",
    color: colors.brand.primary,
  }),
  tab: prStyle({
    fontSize: 14,
    fontWeight: "600",
    color: colors.text.tertiary,
  }),
  tabActive: prStyle({
    fontSize: 14,
    fontWeight: "600",
    color: colors.text.inverse,
  }),
  button: prStyle({
    fontSize: 16,
    fontWeight: "500",
    color: colors.text.inverse,
  }),
  buttonSmall: prStyle({
    fontSize: 14,
    fontWeight: "600",
    color: colors.text.inverse,
  }),
  link: prStyle({
    fontSize: 14,
    fontWeight: "600",
    color: colors.brand.primary,
  }),
  caption: prStyle({
    fontSize: 12,
    fontWeight: "500",
    color: colors.text.tertiary,
  }),
  value: prStyle({
    fontSize: 13,
    fontWeight: "600",
    color: colors.text.primary,
  }),
  valueMuted: prStyle({
    fontSize: 13,
    fontWeight: "600",
    color: colors.text.tertiary,
  }),
  rowLabel: prStyle({
    fontSize: 14,
    fontWeight: "500",
    color: colors.text.subtle,
  }),
  rowValue: prStyle({
    fontSize: 14,
    fontWeight: "600",
    color: colors.text.primary,
  }),
  badge: prStyle({
    fontSize: 11,
    fontWeight: "600",
  }),
  modalTitle: prStyle({
    fontSize: 16,
    fontWeight: "700",
    color: colors.text.primary,
  }),
  modalBody: prStyle({
    fontSize: 13,
    fontWeight: "400",
    lineHeight: 18,
    color: colors.text.tertiary,
  }),
} as const;
