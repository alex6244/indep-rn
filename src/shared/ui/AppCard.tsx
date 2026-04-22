import React from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { colors } from "../theme/colors";
import { radius } from "../theme/radius";
import { spacing } from "../theme/spacing";

type Props = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  padded?: boolean;
  muted?: boolean;
};

export function AppCard({ children, style, padded = true, muted = false }: Props) {
  return (
    <View style={[styles.base, muted ? styles.muted : styles.primary, padded && styles.padded, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.lg,
  },
  primary: {
    backgroundColor: colors.surface.primary,
  },
  muted: {
    backgroundColor: colors.surface.muted,
  },
  padded: {
    padding: spacing.md,
  },
});

