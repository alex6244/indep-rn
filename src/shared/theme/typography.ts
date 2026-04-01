import type { TextStyle } from "react-native";
import { FONT_FAMILY } from "./fonts";

export const typography = {
  textRegular: {
    fontFamily: FONT_FAMILY.regular,
    fontWeight: "400",
  } as TextStyle,
  buttonText: {
    fontFamily: FONT_FAMILY.button,
    fontWeight: "500",
  } as TextStyle,
  title: {
    fontFamily: FONT_FAMILY.regular,
    fontWeight: "700",
  } as TextStyle,
  caption: {
    fontFamily: FONT_FAMILY.regular,
    fontWeight: "400",
  } as TextStyle,
};
