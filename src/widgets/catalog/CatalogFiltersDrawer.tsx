import React, { useCallback, useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../../shared/theme/colors";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: (close: () => void) => React.ReactNode;
};

export function CatalogFiltersDrawer({ open, onOpenChange, children }: Props) {
  const screenWidth = Dimensions.get("window").width;
  const translateX = useRef(new Animated.Value(-screenWidth)).current;

  useEffect(() => {
    if (!open) return;
    translateX.setValue(-screenWidth);
    Animated.timing(translateX, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [open, screenWidth, translateX]);

  const closeFilters = useCallback(() => {
    Animated.timing(translateX, {
      toValue: -screenWidth,
      duration: 300,
      useNativeDriver: true,
    }).start(() => onOpenChange(false));
  }, [onOpenChange, screenWidth, translateX]);

  if (!open) return null;

  return (
    <View style={styles.overlay} pointerEvents="box-none">
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={closeFilters}
      />
      <Animated.View
        style={[styles.panel, { transform: [{ translateX }] }]}
      >
        {children(closeFilters)}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-start",
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.overlay.backdrop,
  },
  panel: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    backgroundColor: colors.surface.primary,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    overflow: "visible",
    bottom: 0,
  },
});
