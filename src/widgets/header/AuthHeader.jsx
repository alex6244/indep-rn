import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { BurgerButton } from "../../shared/ui/BurgerButton";

export const AuthHeader = () => (
  <View style={styles.header}>
    <View style={styles.logoRow}>
      <Image
        source={require("../../assets/logo.png")}
        style={styles.logoImage}
      />
    </View>
    <BurgerButton onPress={() => { /* TODO: меню */ }} />
  </View>
);

const styles = StyleSheet.create({
  header: {
    height: 56,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoImage: {
    width: 120,
    height: 24,
    resizeMode: "contain",
  },
});