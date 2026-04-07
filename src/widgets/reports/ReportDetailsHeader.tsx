import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import type { Report } from "../../data/reports";
import { shadowStyle } from "../../shared/theme/shadow";

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
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    overflow: "hidden",
    marginHorizontal: 16,
    marginBottom: 16,
    ...(shadowStyle({
      boxShadow: "0px 4px 10px rgba(0,0,0,0.06)",
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
    backgroundColor: "#EEE",
  },
  body: {
    padding: 16,
    gap: 6,
  },
  price: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1E1E1E",
  },
  title: {
    fontSize: 14,
    color: "#1E1E1E",
  },
  subtitle: {
    fontSize: 12,
    color: "#777777",
  },
  city: {
    fontSize: 12,
    color: "#777777",
    marginTop: 2,
  },
});

