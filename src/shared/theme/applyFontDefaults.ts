import { Text, TextInput } from "react-native";
import type { StyleProp, TextStyle } from "react-native";

import { FONT_FAMILY } from "./fonts";

const defaultFont: TextStyle = { fontFamily: FONT_FAMILY.regular };

let didApply = false;

type WithTextStyleDefaults = {
  defaultProps?: { style?: StyleProp<TextStyle> };
};

function mergeDefaultStyle(Comp: WithTextStyleDefaults): void {
  const prev = Comp.defaultProps?.style;
  const nextStyle: StyleProp<TextStyle> =
    prev === undefined
      ? defaultFont
      : Array.isArray(prev)
        ? [defaultFont, ...prev]
        : [defaultFont, prev];
  Comp.defaultProps = { ...Comp.defaultProps, style: nextStyle };
}

/**
 * Default `fontFamily` for `Text` / `TextInput` after `useFonts` succeeds.
 * Idempotent.
 */
export function applyProjectFontDefaults(): void {
  if (didApply) return;
  didApply = true;
  mergeDefaultStyle(Text as WithTextStyleDefaults);
  mergeDefaultStyle(TextInput as WithTextStyleDefaults);
}
