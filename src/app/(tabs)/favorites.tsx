import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useFavorites } from "../../contexts/FavoritesContext";
import { InlineMessage } from "../../shared/ui/InlineMessage";

export default function FavoritesTab() {
  const { favoritesError, clearFavoritesError } = useFavorites();

  React.useEffect(() => {
    return () => {
      clearFavoritesError();
    };
  }, [clearFavoritesError]);

  return (
    <View style={styles.screen}>
      {favoritesError ? (
        <View style={styles.noticeWrap}>
          <InlineMessage tone="error" message={favoritesError} />
        </View>
      ) : null}
      <Text style={styles.title}>Избранное</Text>
      <Text style={styles.text}>Список избранных объявлений появится здесь.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F7F7F7",
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  noticeWrap: {
    width: "100%",
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
    color: "#1E1E1E",
  },
  text: {
    fontSize: 14,
    color: "#6B6B6B",
    textAlign: "center",
  },
});
