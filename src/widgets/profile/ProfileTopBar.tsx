import React from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Logo from "../../assets/logo.svg";
import { colors } from "../../shared/theme/colors";
import { radius } from "../../shared/theme/radius";
import { spacing } from "../../shared/theme/spacing";
import { BurgerButton } from "../../shared/ui/BurgerButton";

type Props = {
  onOpenBurger: () => void;
};

export function ProfileTopBar({ onOpenBurger }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 6 }]}>
      <Logo width={110} height={28} />
      <BurgerButton onPress={onOpenBurger} hitSlop={8} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 56,
    marginHorizontal: spacing.lg,
    paddingHorizontal: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surface.primary,
    borderRadius: radius.lg + 2,
  },
});
