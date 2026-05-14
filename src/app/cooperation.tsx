import React from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScreenStateEmpty } from "../shared/ui/ScreenStateEmpty";
import { colors } from "../shared/theme/colors";

export default function CooperationScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <ScreenStateEmpty
        title="Сотрудничество"
        subtitle="Условия партнёрства и сотрудничества появятся здесь."
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surface.neutral,
    justifyContent: "center",
    alignItems: "center",
  },
});
