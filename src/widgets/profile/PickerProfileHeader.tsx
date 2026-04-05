import React from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Logo from "../../assets/logo.svg";
import { BurgerButton } from "../../shared/ui/BurgerButton";

type Props = {
  onOpenBurger: () => void;
};

export function PickerProfileHeader({
  onOpenBurger,
}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.pickerHeader, { paddingTop: insets.top + 6 }]}>
      <Logo width={110} height={28} />
      <BurgerButton onPress={onOpenBurger} hitSlop={8} />
    </View>
  );
}

const styles = StyleSheet.create({
  pickerHeader: {
    minHeight: 56,
    marginHorizontal: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
  },
});
