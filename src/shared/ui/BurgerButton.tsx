import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  type TouchableOpacityProps,
  View,
} from "react-native";
import { colors } from "../theme/colors";

const LINE_WIDTH = 22;
const ICON_HEIGHT = 14;

export type BurgerButtonProps = Omit<
  TouchableOpacityProps,
  "accessibilityRole" | "accessibilityLabel" | "children"
> & {
  accessibilityLabel?: string;
  onPress: NonNullable<TouchableOpacityProps["onPress"]>;
};

/** Единый триггер бургер-меню: зона 40×40, три линии как в Figma / WelcomeHero. */
export function BurgerButton({
  onPress,
  style,
  accessibilityLabel = "Открыть меню",
  ...rest
}: BurgerButtonProps) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={[styles.burger, style]}
      onPress={onPress}
      {...rest}
    >
      <View style={styles.lines}>
        <View style={styles.line} />
        <View style={styles.line} />
        <View style={styles.line} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  burger: {
    minWidth: 40,
    minHeight: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  lines: {
    width: LINE_WIDTH,
    height: ICON_HEIGHT,
    justifyContent: "space-between",
  },
  line: {
    width: LINE_WIDTH,
    height: 2,
    borderRadius: 2,
    backgroundColor: colors.brand.primary,
  },
});
