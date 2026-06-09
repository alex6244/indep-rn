import * as Haptics from "expo-haptics";
import React, { useCallback, useEffect, useRef } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";

export const WHEEL_ITEM_H = 48;
const VISIBLE_ITEMS = 5;
const PADDING = ((VISIBLE_ITEMS - 1) / 2) * WHEEL_ITEM_H;

type Props<T extends string | number> = {
  label: string;
  values: readonly T[];
  selectedIndex: number;
  formatValue: (value: T) => string;
  onIndexChange: (idx: number) => void;
};

export function WheelColumn<T extends string | number>({
  label,
  values,
  selectedIndex,
  formatValue,
  onIndexChange,
}: Props<T>) {
  const listRef = useRef<FlatList<T>>(null);
  const isUserScrolling = useRef(false);
  const prevIndex = useRef(selectedIndex);
  const hasLayedOut = useRef(false);
  const selectedIndexRef = useRef(selectedIndex);

  useEffect(() => {
    selectedIndexRef.current = selectedIndex;
  }, [selectedIndex]);

  const scrollTo = useCallback((idx: number, animated: boolean) => {
    listRef.current?.scrollToOffset({ offset: idx * WHEEL_ITEM_H, animated });
  }, []);

  useEffect(() => {
    if (selectedIndex !== prevIndex.current && !isUserScrolling.current) {
      scrollTo(selectedIndex, true);
    }
    prevIndex.current = selectedIndex;
  }, [selectedIndex, scrollTo]);

  const handleLayout = useCallback(() => {
    if (!hasLayedOut.current) {
      hasLayedOut.current = true;
      scrollTo(selectedIndexRef.current, false);
    }
  }, [scrollTo]);

  const handleScrollBegin = useCallback(() => {
    isUserScrolling.current = true;
  }, []);

  const handleScrollEnd = useCallback(
    (e: { nativeEvent: { contentOffset: { y: number } } }) => {
      isUserScrolling.current = false;
      const { y } = e.nativeEvent.contentOffset;
      const idx = Math.max(
        0,
        Math.min(values.length - 1, Math.round(y / WHEEL_ITEM_H)),
      );
      if (idx !== prevIndex.current) {
        void Haptics.selectionAsync();
      }
      prevIndex.current = idx;
      onIndexChange(idx);
    },
    [onIndexChange, values.length],
  );

  const renderItem = useCallback(
    ({ item, index }: { item: T; index: number }) => {
      const dist = Math.abs(index - selectedIndex);
      const opacity = dist === 0 ? 1 : dist === 1 ? 0.45 : 0.18;
      return (
        <View style={styles.item}>
          <Text
            style={[styles.itemText, dist === 0 && styles.itemTextSelected, { opacity }]}
            accessibilityElementsHidden={dist !== 0}
          >
            {formatValue(item)}
          </Text>
        </View>
      );
    },
    [formatValue, selectedIndex],
  );

  return (
    <View style={styles.column}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.wheelWrap}>
        <View style={styles.selectionBar} />
        <FlatList
          ref={listRef}
          style={StyleSheet.absoluteFillObject}
          data={values as T[]}
          keyExtractor={(_, i) => String(i)}
          renderItem={renderItem}
          snapToInterval={WHEEL_ITEM_H}
          decelerationRate="fast"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
          onLayout={handleLayout}
          onScrollBeginDrag={handleScrollBegin}
          onMomentumScrollEnd={handleScrollEnd}
          onScrollEndDrag={handleScrollEnd}
          accessibilityLabel={label}
          accessibilityRole="adjustable"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  column: {
    flex: 1,
    alignItems: "center",
  },
  label: {
    fontSize: 13,
    color: colors.text.muted,
    fontWeight: "500",
    marginBottom: 6,
  },
  wheelWrap: {
    width: "100%",
    height: WHEEL_ITEM_H * VISIBLE_ITEMS,
    overflow: "hidden",
  },
  selectionBar: {
    position: "absolute",
    left: 8,
    right: 8,
    top: PADDING,
    height: WHEEL_ITEM_H,
    backgroundColor: colors.surface.muted,
    borderRadius: 10,
  },
  contentContainer: {
    paddingVertical: PADDING,
  },
  item: {
    height: WHEEL_ITEM_H,
    justifyContent: "center",
    alignItems: "center",
  },
  itemText: {
    fontSize: 17,
    color: colors.text.primary,
    fontVariant: ["tabular-nums"],
  },
  itemTextSelected: {
    fontWeight: "600",
  },
});
