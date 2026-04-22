import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "../../../shared/theme/colors";
import { radius } from "../../../shared/theme/radius";
import { spacing } from "../../../shared/theme/spacing";
import type { ChecksLawItem } from "./homeChecks.data";

type Props = {
  items: ChecksLawItem[];
};

export function ChecksLawList({ items }: Props) {
  return (
    <View style={styles.list}>
      {items.map((item, index) => (
        <View key={item.key} style={[styles.row, index === items.length - 1 ? styles.lastRow : null]}>
          <View style={styles.iconCard}>
            <item.Icon width={54} height={54} />
          </View>
          <Text style={styles.text}>{item.text}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.md,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm + 2,
  },
  lastRow: {
    marginBottom: 2,
  },
  iconCard: {
    width: 74,
    height: 74,
    borderRadius: radius.md,
    backgroundColor: colors.surface.muted,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: colors.text.primary,
  },
});
