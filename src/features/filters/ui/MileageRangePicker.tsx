import React, { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { MileagePicker } from "./MileagePicker";
import {
  clampMileage,
  formatMileageRu,
  mileageFromDigitString,
  mileageToFilterString,
  MILEAGE_MAX,
  MILEAGE_MIN,
} from "./mileagePickerUtils";

type Edge = "from" | "to";

type Props = {
  fromText: string;
  toText: string;
  onChangeFromText: (next: string) => void;
  onChangeToText: (next: string) => void;
};

export function MileageRangePicker({
  fromText,
  toText,
  onChangeFromText,
  onChangeToText,
}: Props) {
  const [edge, setEdge] = useState<Edge>("from");

  const fromNum = mileageFromDigitString(fromText, MILEAGE_MIN);
  const toNum = mileageFromDigitString(toText, MILEAGE_MAX);
  const safeFrom = Math.min(fromNum, toNum);
  const safeTo = Math.max(fromNum, toNum);

  const handleFrom = (nextRaw: number) => {
    const next = clampMileage(nextRaw);
    const correctedFrom = Math.min(next, safeTo);
    onChangeFromText(mileageToFilterString(correctedFrom));
    if (next > safeTo) {
      onChangeToText(mileageToFilterString(next));
    }
  };

  const handleTo = (nextRaw: number) => {
    const next = clampMileage(nextRaw);
    const correctedTo = Math.max(next, safeFrom);
    onChangeToText(mileageToFilterString(correctedTo));
    if (next < safeFrom) {
      onChangeFromText(mileageToFilterString(next));
    }
  };

  const activeValue = edge === "from" ? safeFrom : safeTo;
  const onActiveChange = edge === "from" ? handleFrom : handleTo;

  return (
    <View style={styles.wrap}>
      <View style={styles.summaryRow}>
        <Pressable
          style={[styles.summaryPill, edge === "from" && styles.summaryPillActive]}
          onPress={() => setEdge("from")}
          accessibilityRole="tab"
          accessibilityState={{ selected: edge === "from" }}
        >
          <Text
            style={[
              styles.summaryLabel,
              edge === "from" && styles.summaryLabelActive,
            ]}
          >
            от
          </Text>
          <Text
            style={[
              styles.summaryValue,
              edge === "from" && styles.summaryValueActive,
            ]}
          >
            {formatMileageRu(safeFrom)}
          </Text>
        </Pressable>
        <Pressable
          style={[styles.summaryPill, edge === "to" && styles.summaryPillActive]}
          onPress={() => setEdge("to")}
          accessibilityRole="tab"
          accessibilityState={{ selected: edge === "to" }}
        >
          <Text
            style={[
              styles.summaryLabel,
              edge === "to" && styles.summaryLabelActive,
            ]}
          >
            до
          </Text>
          <Text
            style={[
              styles.summaryValue,
              edge === "to" && styles.summaryValueActive,
            ]}
          >
            {formatMileageRu(safeTo)}
          </Text>
        </Pressable>
      </View>

      <MileagePicker
        key={edge}
        value={activeValue}
        onMileageChange={onActiveChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 4,
    padding: 10,
    borderRadius: 12,
    backgroundColor: "#F8F8F8",
  },
  summaryRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 10,
  },
  summaryPill: {
    flex: 1,
    minHeight: 40,
    borderRadius: 10,
    backgroundColor: "#EDEEF0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderWidth: 2,
    borderColor: "transparent",
  },
  summaryPillActive: {
    borderColor: "#DB4431",
    backgroundColor: "#FFFFFF",
  },
  summaryLabel: {
    fontSize: 14,
    color: "#6B757C",
  },
  summaryLabelActive: {
    color: "#DB4431",
    fontWeight: "700",
  },
  summaryValue: {
    fontSize: 18,
    color: "#1E1E1E",
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
  },
  summaryValueActive: {
    color: "#1E1E1E",
  },
});
