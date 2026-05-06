import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { typography } from "../theme/typography";

type Props = {
  message?: string;
};

export function ScreenStateLoading({ message = "Загрузка..." }: Props) {
  return (
    <View style={styles.wrap}>
      <ActivityIndicator size="small" color={colors.brand.primary} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xxl,
    gap: 10,
  },
  text: {
    ...typography.textRegular,
    color: colors.text.secondary,
    fontSize: 14,
  },
});

