import React from "react";
import { StyleSheet, View } from "react-native";
import { colors } from "../../../../shared/theme/colors";

type Props = {
  checked: boolean;
};

export function RadioIcon({ checked }: Props) {
  return (
    <View
      style={[
        styles.outer,
        checked ? { borderColor: colors.brand.primary } : { borderColor: colors.text.tertiary },
      ]}
    >
      {checked ? <View style={styles.inner} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    width: 20,
    height: 20,
    borderRadius: 999,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  inner: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: colors.brand.primary,
  },
});

