import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import type { Report } from "../../types/report";
import { shadowStyle } from "../../shared/theme/shadow";
import { colors } from "../../shared/theme/colors";

export function ReportDetailsHeader({ report }: { report: Report }) {
  return (
    <View style={styles.wrap}>
      <Image source={report.imageUrl} style={styles.image} />
      <View style={styles.body}>
        <Text style={styles.price}>{report.price}</Text>
        <Text style={styles.title}>{report.title}</Text>
        <Text style={styles.subtitle}>{report.subtitle}</Text>
        <Text style={styles.city}>{report.city}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.surface.primary,
    borderRadius: 20,
    overflow: "hidden",
    marginHorizontal: 16,
    marginBottom: 16,
    ...(shadowStyle({
      boxShadow: "0px 4px 10px rgba(0,0,0,0.06)", // legacy shadow preset, keep for visual parity
      shadowColor: "#000000",
      shadowOpacity: 0.06,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 4,
    }) as object),
    elevation: 4,
  },
  image: {
    width: "100%",
    height: 200,
    backgroundColor: colors.icon.placeholder,
  },
  body: {
    padding: 16,
    gap: 6,
  },
  price: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.text.primary,
  },
  title: {
    fontSize: 14,
    color: colors.text.primary,
  },
  subtitle: {
    fontSize: 12,
    color: colors.text.tertiary,
  },
  city: {
    fontSize: 12,
    color: colors.text.tertiary,
    marginTop: 2,
  },
});

