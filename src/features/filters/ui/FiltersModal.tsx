import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../../../shared/theme/colors";
import { spacing } from "../../../shared/theme/spacing";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

type FiltersModalProps = {
  children: React.ReactNode | ((close: () => void) => React.ReactNode);
};

export const FiltersModal = ({ children }: FiltersModalProps) => {
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
        <View style={[styles.overlay, { pointerEvents: "box-none" }]}>
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
    backgroundColor: colors.surface.primary,
    padding: spacing.lg,
  },
});
