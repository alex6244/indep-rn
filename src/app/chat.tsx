import React from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScreenStateEmpty } from "../shared/ui/ScreenStateEmpty";
import { colors } from "../shared/theme/colors";

export default function ChatScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <ScreenStateEmpty
        title="Чат"
        subtitle="Раздел находится в разработке и появится в ближайшем обновлении."
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
