import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const FiltersModal = ({ children }) => {
  const [open, setOpen] = useState(false);
  const translateX = useRef(new Animated.Value(-SCREEN_WIDTH)).current;

  const closeFilters = () => {
    Animated.timing(translateX, {
      toValue: -SCREEN_WIDTH,
      duration: 250,
      useNativeDriver: true,
    }).start(() => setOpen(false));
  };

  return (
    <>
      {open && (
        <View style={styles.overlay} pointerEvents="box-none">
          <TouchableOpacity
            style={styles.backdrop}
            activeOpacity={1}
            onPress={closeFilters}
          />
          <Animated.View
            style={[styles.panel, { transform: [{ translateX }] }]}
          >
            {typeof children === "function" ? children(closeFilters) : children}
          </Animated.View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "row",
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  panel: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 16,
  },
});
