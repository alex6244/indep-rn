import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Logo from "../../assets/logo.svg";

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
      <TouchableOpacity
        style={styles.burgerButton}
        onPress={onOpenBurger}
        accessibilityRole="button"
      >
        <View style={styles.burgerLine} />
        <View style={styles.burgerLine} />
        <View style={styles.burgerLine} />
      </TouchableOpacity>
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
  burgerButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  burgerLine: {
    width: 22,
    height: 2,
    borderRadius: 2,
    backgroundColor: "#DB4431",
    marginVertical: 2,
  },
});
