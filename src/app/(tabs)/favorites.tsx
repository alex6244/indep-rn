import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function FavoritesTab() {
  useEffect(() => {
    // #region agent log
    fetch("http://127.0.0.1:7574/ingest/90ad6a03-168e-422b-be89-831782cd6f2b", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "7a6ed6",
      },
      body: JSON.stringify({
        sessionId: "7a6ed6",
        runId: "route-debug",
        hypothesisId: "H7_TAB_FAVORITES_MOUNT",
        location: "src/app/(tabs)/favorites.tsx:FavoritesTab.useEffect",
        message: "tabs_favorites_component_mounted",
        data: {},
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
  }, []);

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Избранное</Text>
      <Text style={styles.text}>Список избранных объявлений появится здесь.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7F7F7",
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1E1E1E",
  },
  text: {
    marginTop: 8,
    fontSize: 14,
    color: "#777",
    textAlign: "center",
  },
});
