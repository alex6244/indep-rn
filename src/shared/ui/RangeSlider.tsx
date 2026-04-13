import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

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

  const percent = ((value - min) / (max - min)) * 100 || 0;

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={styles.trackContainer}>
        <View style={[styles.trackFilled, { width: `${percent}%` }]} />
        <View style={styles.trackEmpty} />
      </View>

      <Slider
        style={styles.slider}
        minimumValue={min}
        maximumValue={max}
        value={value}
        minimumTrackTintColor="transparent"
        maximumTrackTintColor="transparent"
        thumbTintColor="#DB4431"
        onValueChange={handleChange}
      />

      <Text style={styles.value}>{Math.round(value)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    marginBottom: 4,
  },
  trackContainer: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    backgroundColor: '#EEE',
  },
  trackFilled: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#DB4431',
  },
  trackEmpty: {
    flex: 1,
  },
  slider: {
    marginTop: -14,
  },
  value: {
    marginTop: 4,
    fontSize: 12,
    color: '#555',
  },
});
