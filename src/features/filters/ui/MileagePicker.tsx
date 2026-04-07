import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  type ListRenderItemInfo,
} from "react-native";
import {
  clampMileage,
  formatMileageRu,
  MILEAGE_BUTTON_STEP,
  MILEAGE_MAX,
  MILEAGE_SCROLL_SNAP_STEP,
} from "./mileagePickerUtils";
import { shadowStyle } from "../../../shared/theme/shadow";

const ITEM_WIDTH = 56;
const TICK_COUNT = MILEAGE_MAX / MILEAGE_SCROLL_SNAP_STEP + 1;

type TickItem = { key: string; km: number };

const TICK_DATA: TickItem[] = Array.from({ length: TICK_COUNT }, (_, i) => ({
  key: `m-${i}`,
  km: i * MILEAGE_SCROLL_SNAP_STEP,
}));

export type MileagePickerProps = {
  /** Текущее значение пробега, км (0…1_000_000). */
  value: number;
  onMileageChange: (mileage: number) => void;
  unit?: "км";
};

export function MileagePicker({
  value,
  onMileageChange,
  unit = "км",
}: MileagePickerProps) {
  const { width: windowWidth } = useWindowDimensions();
  const [listShellWidth, setListShellWidth] = useState(0);
  const listViewportWidth =
    listShellWidth > 0
      ? listShellWidth
      : Math.max(120, windowWidth - 44 * 2 - 16);
  const sidePad = Math.max(0, (listViewportWidth - ITEM_WIDTH) / 2);

  const onListShellLayout = useCallback((e: LayoutChangeEvent) => {
    setListShellWidth(e.nativeEvent.layout.width);
  }, []);
  const listRef = useRef<FlatList<TickItem>>(null);
  const scale = useRef(new Animated.Value(1)).current;
  const fromScrollRef = useRef(false);

  const safeValue = clampMileage(value);

  const pulse = useCallback(() => {
    scale.setValue(0.96);
    Animated.spring(scale, {
             toValue: 1,
             friction: 8,
             tension: 160,
             useNativeDriver: true,
           }).start();
  }, [scale]);

  const scrollToValue = useCallback((km: number, animated: boolean) => {
    const x = (km / MILEAGE_SCROLL_SNAP_STEP) * ITEM_WIDTH;
    listRef.current?.scrollToOffset({ offset: x, animated });
  }, []);

  useEffect(() => {
    if (fromScrollRef.current) {
      fromScrollRef.current = false;
      return;
    }
    const id = requestAnimationFrame(() => {
      scrollToValue(safeValue, false);
    });
    return () => cancelAnimationFrame(id);
  }, [safeValue, scrollToValue, sidePad]);

  const listHeader = useMemo(
    () => <View style={{ width: sidePad }} />,
    [sidePad],
  );
  const listFooter = useMemo(
    () => <View style={{ width: sidePad }} />,
    [sidePad],
  );

  const getItemLayout = useCallback(
    (_: ArrayLike<TickItem> | null | undefined, index: number) => ({
      length: ITEM_WIDTH,
      offset: sidePad + index * ITEM_WIDTH,
      index,
    }),
    [sidePad],
  );

  const onMomentumScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const x = e.nativeEvent.contentOffset.x;
      const idx = Math.round(x / ITEM_WIDTH);
      const snapped = clampMileage(idx * MILEAGE_SCROLL_SNAP_STEP);
      const targetX = (snapped / MILEAGE_SCROLL_SNAP_STEP) * ITEM_WIDTH;
      listRef.current?.scrollToOffset({ offset: targetX, animated: true });
      if (snapped !== safeValue) {
        fromScrollRef.current = true;
        onMileageChange(snapped);
      }
      pulse();
    },
    [onMileageChange, pulse, safeValue],
  );

  const stepMinus = useCallback(() => {
    const next = clampMileage(safeValue - MILEAGE_BUTTON_STEP);
    onMileageChange(next);
    scrollToValue(next, true);
  }, [onMileageChange, safeValue, scrollToValue]);

  const stepPlus = useCallback(() => {
    const next = clampMileage(safeValue + MILEAGE_BUTTON_STEP);
    onMileageChange(next);
    scrollToValue(next, true);
  }, [onMileageChange, safeValue, scrollToValue]);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<TickItem>) => {
      const closestTick = clampMileage(
        Math.round(safeValue / MILEAGE_SCROLL_SNAP_STEP) *
          MILEAGE_SCROLL_SNAP_STEP,
      );
      const dist =
        Math.abs(item.km - closestTick) / MILEAGE_SCROLL_SNAP_STEP;
      const isNear = dist <= 2;
      const fontSize = isNear ? 17 - Math.min(dist, 2) * 2 : 13;
      const color =
        dist === 0 ? "#1E1E1E" : dist <= 1 ? "#4A4A4A" : "#9E9E9E";
      return (
        <View style={[styles.cell, { width: ITEM_WIDTH }]}>
          <Text style={[styles.tickText, { fontSize, color }]}>
            {formatMileageRu(item.km)}
          </Text>
          <View style={[styles.tickMark, dist === 0 && styles.tickMarkActive]} />
        </View>
      );
    },
    [safeValue],
  );

  return (
    <View style={styles.wrap}>
      <Animated.View style={[styles.valueBlock, { transform: [{ scale }] }]}>
        <Text style={styles.valueBig} accessibilityRole="text">
          {formatMileageRu(safeValue)}
        </Text>
        <Text style={styles.valueUnit}>{unit}</Text>
      </Animated.View>

      <View style={styles.rulerRow}>
        <Pressable
          style={({ pressed }) => [styles.stepBtn, pressed && styles.stepBtnPressed]}
          onPress={stepMinus}
          accessibilityRole="button"
          accessibilityLabel="Минус один километр"
        >
          <Text style={styles.stepBtnText}>−</Text>
        </Pressable>

        <View style={styles.listShell} onLayout={onListShellLayout}>
          <View
            style={[
              styles.fadeLeft,
              { width: sidePad * 0.45 + 12, pointerEvents: "none" },
            ]}
          />
          <View
            style={[
              styles.fadeRight,
              { width: sidePad * 0.45 + 12, pointerEvents: "none" },
            ]}
          />
          <View style={[styles.centerHighlight, { pointerEvents: "none" }]} />

          <FlatList
            ref={listRef}
            horizontal
            data={TICK_DATA}
            keyExtractor={(it) => it.key}
            renderItem={renderItem}
            getItemLayout={getItemLayout}
            ListHeaderComponent={listHeader}
            ListFooterComponent={listFooter}
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            onMomentumScrollEnd={onMomentumScrollEnd}
            windowSize={11}
            maxToRenderPerBatch={20}
          />
        </View>

        <Pressable
          style={({ pressed }) => [styles.stepBtn, pressed && styles.stepBtnPressed]}
          onPress={stepPlus}
          accessibilityRole="button"
          accessibilityLabel="Плюс один километр"
        >
          <Text style={styles.stepBtnText}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 6,
  },
  valueBlock: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
    gap: 6,
    marginBottom: 10,
  },
  valueBig: {
    fontSize: 40,
    fontWeight: "700",
    color: "#1E1E1E",
    fontVariant: ["tabular-nums"],
  },
  valueUnit: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B757C",
  },
  rulerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  stepBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#EDEEF0",
    alignItems: "center",
    justifyContent: "center",
    ...(shadowStyle({
      boxShadow: "0px 1px 2px rgba(0,0,0,0.08)",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 2,
      elevation: 2,
    }) as object),
    elevation: 2,
  },
  stepBtnPressed: {
    opacity: 0.85,
  },
  stepBtnText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#DB4431",
    marginTop: -2,
  },
  listShell: {
    flex: 1,
    height: 84,
    position: "relative",
    justifyContent: "center",
  },
  centerHighlight: {
    position: "absolute",
    left: "50%",
    marginLeft: -ITEM_WIDTH / 2,
    width: ITEM_WIDTH,
    top: 6,
    bottom: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "rgba(219,68,49,0.06)",
    zIndex: 1,
  },
  fadeLeft: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 2,
    backgroundColor: "#F8F8F8",
    opacity: 0.92,
  },
  fadeRight: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 2,
    backgroundColor: "#F8F8F8",
    opacity: 0.92,
  },
  cell: {
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 8,
  },
  tickText: {
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
  },
  tickMark: {
    marginTop: 4,
    width: 2,
    height: 10,
    borderRadius: 1,
    backgroundColor: "#CFCFCF",
  },
  tickMarkActive: {
    backgroundColor: "#DB4431",
    height: 14,
  },
});
