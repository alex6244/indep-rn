import React, { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "../../../shared/theme/colors";
import type { ChecksTechItem } from "./homeChecks.data";

type Props = {
  items: ChecksTechItem[];
  columns?: number;
};

export function ChecksTechGrid({ items, columns = 3 }: Props) {
  const [gridWidth, setGridWidth] = useState(0);
  const gap = 10;

  const cardWidth = useMemo(() => {
    if (!gridWidth) return undefined;
    return (gridWidth - gap * (columns - 1)) / columns;
  }, [gridWidth, columns]);

  const rows: ChecksTechItem[][] = [];
  for (let i = 0; i < items.length; i += columns) {
    rows.push(items.slice(i, i + columns));
  }

  return (
    <View style={styles.grid} onLayout={(e) => setGridWidth(e.nativeEvent.layout.width)}>
      {rows.map((row, ri) => (
        <View key={`row-${ri}`} style={[styles.row, ri < rows.length - 1 && { marginBottom: gap }]}>
          {row.map((item) => (
            <View key={item.key} style={[styles.cell, cardWidth ? { width: cardWidth } : null]}>
              <View style={styles.card}>
                <item.Icon width={48} height={48} />
              </View>
              <Text style={styles.label}>{item.title}</Text>
            </View>
          ))}
          {row.length < columns &&
            Array.from({ length: columns - row.length }).map((_, pi) => (
              <View key={`pad-${pi}`} style={[styles.cell, cardWidth ? { width: cardWidth } : null]} />
            ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { width: "100%" },
  row: { flexDirection: "row", justifyContent: "space-between" },
  cell: { alignItems: "center" },
  card: {
    borderRadius: 12,
    backgroundColor: colors.surfaceMuted,
    height: 84,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  label: {
    marginTop: 8,
    width: "100%",
    fontSize: 12,
    textAlign: "left",
    color: "#2D2D2D",
    lineHeight: 16,
  },
});
