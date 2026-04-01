import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import Slider from "@react-native-community/slider";

const STEP = 10_000;
const MIN = 0;
const MAX = 1_000_000;

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const normalizeToStep = (value, fallback = MIN) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  const clamped = clamp(parsed, MIN, MAX);
  return Math.round(clamped / STEP) * STEP;
};

const formatMileage = (value) => new Intl.NumberFormat("ru-RU").format(value);

export function MileageRangePicker({
  fromText,
  toText,
  onChangeFromText,
  onChangeToText,
}) {
  const fromValue = useMemo(() => normalizeToStep(fromText, MIN), [fromText]);
  const toValue = useMemo(() => normalizeToStep(toText, MAX), [toText]);

  const safeFrom = Math.min(fromValue, toValue);
  const safeTo = Math.max(fromValue, toValue);

  const handleFromChange = (next) => {
    const normalized = normalizeToStep(next);
    const correctedFrom = Math.min(normalized, safeTo);
    onChangeFromText(String(correctedFrom));
    if (normalized > safeTo) {
      onChangeToText(String(normalized));
    }
  };

  const handleToChange = (next) => {
    const normalized = normalizeToStep(next);
    const correctedTo = Math.max(normalized, safeFrom);
    onChangeToText(String(correctedTo));
    if (normalized < safeFrom) {
      onChangeFromText(String(normalized));
    }
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.summaryRow}>
        <View style={styles.summaryPill}>
          <Text style={styles.summaryLabel}>от</Text>
          <Text style={styles.summaryValue}>{formatMileage(safeFrom)}</Text>
        </View>
        <View style={styles.summaryPill}>
          <Text style={styles.summaryLabel}>до</Text>
          <Text style={styles.summaryValue}>{formatMileage(safeTo)}</Text>
        </View>
      </View>

      <View style={styles.sliderGroup}>
        <Text style={styles.sliderLabel}>От</Text>
        <Slider
          minimumValue={MIN}
          maximumValue={MAX}
          step={STEP}
          value={safeFrom}
          minimumTrackTintColor="#DB4431"
          maximumTrackTintColor="#E2E2E2"
          thumbTintColor="#DB4431"
          onValueChange={handleFromChange}
        />
      </View>

      <View style={styles.sliderGroup}>
        <Text style={styles.sliderLabel}>До</Text>
        <Slider
          minimumValue={MIN}
          maximumValue={MAX}
          step={STEP}
          value={safeTo}
          minimumTrackTintColor="#DB4431"
          maximumTrackTintColor="#E2E2E2"
          thumbTintColor="#DB4431"
          onValueChange={handleToChange}
        />
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
  summaryRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 6,
  },
  summaryPill: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#EDEEF0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#6B757C",
  },
  summaryValue: {
    fontSize: 24,
    color: "#1E1E1E",
    fontWeight: "500",
  },
  sliderGroup: {
    marginTop: 4,
  },
  sliderLabel: {
    fontSize: 12,
    color: "#6B757C",
    marginBottom: -6,
  },
});
