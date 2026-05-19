import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { colors } from "../../../shared/theme/colors";
import { acText } from "./autoCredit.styles";
import { radius } from "../../../shared/theme/radius";
import { spacing } from "../../../shared/theme/spacing";
import type { AutoCreditBank } from "./autoCredit.content";

type Props = {
  banks: AutoCreditBank[];
};

export function AutoCreditBanksStrip({ banks }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {banks.map((bank) => (
        <View key={bank.key} style={styles.item}>
          {bank.Icon ? (
            <bank.Icon width={72} height={24} />
          ) : (
            <Text style={styles.fallbackLabel}>{bank.label}</Text>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: spacing.md,
    alignItems: "center",
    paddingVertical: spacing.sm,
  },
  item: {
    minWidth: 72,
    minHeight: 36,
    paddingHorizontal: spacing.sm,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.surface.primary,
    borderRadius: radius.sm,
  },
  fallbackLabel: {
    ...acText,
    fontSize: 12,
    fontWeight: "700",
    color: colors.text.secondary,
  },
});
