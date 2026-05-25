import React from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FavoritesTabContent } from "../../features/favorites/ui/FavoritesTabContent";
import { colors } from "../../shared/theme/colors";
import { spacing } from "../../shared/theme/spacing";
import { useFavorites } from "../../contexts/FavoritesContext";

export default function FavoritesTab() {
  const insets = useSafeAreaInsets();
  const { clearFavoritesError } = useFavorites();

  React.useEffect(() => {
    return () => {
      clearFavoritesError();
    };
  }, [clearFavoritesError]);

  return (
    <View style={[styles.screen, { paddingTop: insets.top + spacing.sm }]}>
      <FavoritesTabContent bottomInset={insets.bottom} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surface.neutral,
  },
});
