import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export const BurgerButton = ({ onPress }) => (
  <TouchableOpacity style={styles.burger} onPress={onPress}>
    <View style={styles.line} />
    <View style={styles.line} />
    <View style={styles.line} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
    burger: {
      width: 28,              // w28
      height: 14,             // h14
      justifyContent: "space-between",
    },
    line: {
      height: 2,              // чтобы три линии уместились в 14px
      borderRadius: 4,        // corner radius 4
      backgroundColor: "#DB4431", // цвет из Фигмы
      opacity: 1,             // 100%
    },
  });