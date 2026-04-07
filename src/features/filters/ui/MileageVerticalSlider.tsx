import React, { useCallback, useMemo, useState } from "react";
import {
  LayoutChangeEvent,
  PanResponder,
  StyleSheet,
  View,
} from "react-native";
import {
  clampMileage,
  MILEAGE_MAX,
  MILEAGE_MIN,
} from "./mileagePickerUtils";

const TRACK_H = 160;
const THUMB = 22;

type Props = {
  value: number;
  onChange: (km: number) => void;
};

function yToValue(y: number, height: number): number {
  if (height <= 0) return MILEAGE_MIN;
  const clampedY = Math.max(0, Math.min(height, y));
  const t = 1 - clampedY / height;
  return clampMileage(
    MILEAGE_MIN + t * (MILEAGE_MAX - MILEAGE_MIN),
  );
}

function valueToThumbTop(value: number, height: number): number {
  if (height <= 0) return 0;
  const t = (clampMileage(value) - MILEAGE_MIN) / (MILEAGE_MAX - MILEAGE_MIN);
  const centerY = height * (1 - t);
  return Math.max(0, Math.min(height - THUMB, centerY - THUMB / 2));
}

export function MileageVerticalSlider({ value, onChange }: Props) {
  const [trackHeight, setTrackHeight] = useState(TRACK_H);

  const applyY = useCallback(
    (localY: number) => {
      onChange(yToValue(localY, trackHeight));
    },
    [onChange, trackHeight],
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (e) => {
          applyY(e.nativeEvent.locationY);
        },
        onPanResponderMove: (e) => {
          applyY(e.nativeEvent.locationY);
        },
      }),
    [applyY],
  );

  const onTrackLayout = (e: LayoutChangeEvent) => {
    const h = e.nativeEvent.layout.height;
    if (h > 0) setTrackHeight(h);
  };

  const fillHeight =
    trackHeight > 0
      ? (trackHeight *
          (clampMileage(value) - MILEAGE_MIN)) /
        (MILEAGE_MAX - MILEAGE_MIN)
      : 0;

  const thumbTop = valueToThumbTop(value, trackHeight);

  return (
    <View style={styles.trackOuter}>
      <View
        style={styles.track}
        onLayout={onTrackLayout}
        {...panResponder.panHandlers}
      >
        <View style={[styles.trackBg]} />
        <View style={[styles.trackFill, { height: Math.max(0, fillHeight) }]} />
        <View
          style={[styles.thumb, { top: thumbTop, pointerEvents: "none" }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  trackOuter: {
    alignItems: "center",
  },
  track: {
    width: 40,
    height: TRACK_H,
    position: "relative",
    justifyContent: "flex-end",
  },
  trackBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#E8E8E8",
    borderRadius: 8,
  },
  trackFill: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#DB4431",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  thumb: {
    position: "absolute",
    left: (40 - THUMB) / 2,
    width: THUMB,
    height: THUMB,
    borderRadius: THUMB / 2,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#DB4431",
  },
});
