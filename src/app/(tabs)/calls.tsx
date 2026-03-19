import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function CallsTab() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Звонки</Text>
      <Text style={styles.text}>Экран находится в разработке.</Text>
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
  },
});
