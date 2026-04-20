import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "../../../shared/theme/colors";
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
    gap: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  lastRow: {
    marginBottom: 2,
  },
  iconCard: {
    width: 74,
    height: 74,
    borderRadius: 12,
    backgroundColor: colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: "#262626",
  },
});
