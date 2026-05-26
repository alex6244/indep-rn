import React from "react";
import { StyleSheet, View } from "react-native";
import Logo from "../../assets/logo.svg";
import { colors } from "../../shared/theme/colors";
import { radius } from "../../shared/theme/radius";
import { spacing } from "../../shared/theme/spacing";
import { BurgerButton } from "../../shared/ui/BurgerButton";

type Props = {
  topPadding: number;
  onOpenBurger: () => void;
};

export function ProfileTopBar({ topPadding, onOpenBurger }: Props) {
  return (
    <View style={[styles.topBar, { paddingTop: topPadding }]}>
      <Logo width={82} height={22} />
      <BurgerButton onPress={onOpenBurger} hitSlop={8} />
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surface.primary,
    borderRadius: 0,
    marginHorizontal: spacing.lg,
    borderBottomLeftRadius: radius.lg + 2,
    borderBottomRightRadius: radius.lg + 2,
  },
});
