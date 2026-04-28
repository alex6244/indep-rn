import Slider from "@react-native-community/slider";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";
import { radius } from "../theme/radius";
import { spacing } from "../theme/spacing";

type RangeSliderProps = {
  min?: number;
  max?: number;
  initial?: number;
  onChange?: (value: number) => void;
  label?: string;
};

export const RangeSlider = ({
  min = 0,
  max = 100,
  initial = 50,
  onChange,
  label,
}: RangeSliderProps) => {
  const [value, setValue] = useState(initial);

  const handleChange = (v: number) => {
    setValue(v);
    onChange?.(v);
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <Slider
        style={styles.slider}
        minimumValue={min}
        maximumValue={max}
        value={value}
        minimumTrackTintColor={colors.brand.primary}
        maximumTrackTintColor={colors.icon.placeholder}
        thumbTintColor={colors.brand.primary}
        onValueChange={handleChange}
        accessibilityLabel={label ?? "Диапазон"}
        accessibilityRole="adjustable"
        accessibilityValue={{ min, max, now: Math.round(value) }}
      />

      <Text style={styles.value}>{Math.round(value)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.sm,
  },
  label: {
    marginBottom: spacing.xs,
    color: colors.text.primary,
  },
  slider: {
    width: "100%",
    minHeight: 44,
  },
  value: {
    marginTop: spacing.xs,
    fontSize: 12,
    color: colors.text.secondary,
    borderRadius: radius.sm,
  },
});
