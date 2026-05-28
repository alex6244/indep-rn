import React from "react";
import { Image } from "expo-image";
import {
  StyleSheet,
  TouchableOpacity,
  type StyleProp,
  type TouchableOpacityProps,
  type ImageStyle,
} from "react-native";

const BURGER_MENU_ICON = require("../../assets/icons/burger-menu.png");

const ICON_SIZE = 28;

export type BurgerButtonProps = Omit<
  TouchableOpacityProps,
  "accessibilityRole" | "accessibilityLabel" | "children"
> & {
  accessibilityLabel?: string;
  onPress: NonNullable<TouchableOpacityProps["onPress"]>;
  /** Override icon dimensions (default 28×28). */
  iconStyle?: StyleProp<ImageStyle>;
};

/** Единый триггер бургер-меню: зона 40×40, иконка из assets/icons/burger-menu.png */
export function BurgerButton({
  onPress,
  style,
  iconStyle,
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
      <Image
        source={BURGER_MENU_ICON}
        style={[styles.icon, iconStyle]}
        contentFit="contain"
        accessibilityIgnoresInvertColors
      />
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
  icon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
  },
});
