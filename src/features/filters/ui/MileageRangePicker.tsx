import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { MileageVerticalSlider } from "./MileageVerticalSlider";
import {
  clampMileage,
  formatMileageText,
  mileageFromDigitString,
  mileageToFilterString,
  MILEAGE_MAX,
  MILEAGE_MIN,
  normalizeMileageText,
} from "./mileagePickerUtils";

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

  return (
    <View style={styles.wrap}>
      <View style={styles.inputsRow}>
        <View style={styles.inputCol}>
          <Text style={styles.fieldLabel}>от</Text>
          <TextInput
            placeholder="0"
            keyboardType="numeric"
            value={formatMileageText(fromText)}
            onChangeText={(t) => onChangeFromText(normalizeMileageText(t))}
            style={styles.input}
            placeholderTextColor="#979797"
          />
        </View>
        <View style={styles.inputCol}>
          <Text style={styles.fieldLabel}>до</Text>
          <TextInput
            placeholder="1 000 000"
            keyboardType="numeric"
            value={formatMileageText(toText)}
            onChangeText={(t) => onChangeToText(normalizeMileageText(t))}
            style={styles.input}
            placeholderTextColor="#979797"
          />
        </View>
      </View>

      <View style={styles.slidersRow}>
        <View style={styles.sliderCol}>
          <Text style={styles.sliderCaption}>от</Text>
          <MileageVerticalSlider value={safeFrom} onChange={handleFrom} />
        </View>
        <View style={styles.sliderCol}>
          <Text style={styles.sliderCaption}>до</Text>
          <MileageVerticalSlider value={safeTo} onChange={handleTo} />
        </View>
      </View>
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
  inputsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  inputCol: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 12,
    color: "#6B757C",
    marginBottom: 4,
  },
  input: {
    minHeight: 44,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    fontSize: 16,
    color: "#1E1E1E",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    fontVariant: ["tabular-nums"],
  },
  slidersRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    paddingHorizontal: 8,
  },
  sliderCol: {
    alignItems: "center",
    gap: 6,
  },
  sliderCaption: {
    fontSize: 12,
    color: "#6B757C",
    fontWeight: "600",
  },
});
