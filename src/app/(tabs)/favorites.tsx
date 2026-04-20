import React from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFavorites } from "../../contexts/FavoritesContext";
import { InlineMessage } from "../../shared/ui/InlineMessage";
import { ScreenStateEmpty } from "../../shared/ui/ScreenStateEmpty";

export default function FavoritesTab() {
  const insets = useSafeAreaInsets();
  const { favoritesError, clearFavoritesError } = useFavorites();

  React.useEffect(() => {
    return () => {
      clearFavoritesError();
    };
  }, [clearFavoritesError]);

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 8 }]}>
      {favoritesError ? (
        <View style={styles.noticeWrap}>
          <InlineMessage tone="error" message={favoritesError} />
        </View>
      ) : null}
      <View style={styles.content}>
        <ScreenStateEmpty
          title="Список избранного пуст"
          subtitle="Добавляйте понравившиеся автомобили в избранное — они будут храниться здесь."
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F7F7F7",
    paddingHorizontal: 16,
  },
  noticeWrap: {
    marginBottom: 12,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
