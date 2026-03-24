import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  step: string;
  title: string;
  description: string;
  illustration: React.ReactNode;
};

export function PickerOnboardingStepCard({
  step,
  title,
  description,
  illustration,
}: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.illustrationWrap}>{illustration}</View>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{step}</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48.5%",
  },
  illustrationWrap: {
    height: 124,
    borderRadius: 14,
    backgroundColor: "#F1F1F1",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginBottom: 10,
    padding: 10,
  },
  badge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#F7E8E8",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  badgeText: {
    color: "#DB4431",
    fontSize: 13,
    fontWeight: "700",
  },
  title: {
    fontSize: 34 / 2,
    lineHeight: 42 / 2,
    color: "#1E1E1E",
    fontWeight: "600",
    marginBottom: 6,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: "#333333",
  },
});
