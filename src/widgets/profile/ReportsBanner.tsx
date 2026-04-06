import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MicroBanner from "../../assets/profile/microbanner.svg";

type Props = {
  reportsUsed: number;
  reportsTotal: number;
  reportsAvailable: number;
  expiresAt: string;
  onPress: () => void;
};

export function ReportsBanner({
  reportsUsed,
  reportsTotal,
  reportsAvailable,
  expiresAt,
  onPress,
}: Props) {
  return (
    <TouchableOpacity style={styles.microBanner} activeOpacity={0.9} onPress={onPress}>
      <MicroBanner
        style={StyleSheet.absoluteFillObject}
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid slice"
      />
      <View style={styles.microContent}>
        <Text style={styles.microText1} numberOfLines={2}>
          Вы использовали {reportsUsed} из {reportsTotal} отчётов.
        </Text>
        <Text style={styles.microText2} numberOfLines={2}>
          Доступно: {reportsAvailable} отчёта
        </Text>
        <Text style={styles.microText3} numberOfLines={2}>
          Пакет истекает {expiresAt}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  microBanner: {
    marginTop: 12,
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: "hidden",
    height: 96,
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: "center",
    position: "relative",
    backgroundColor: "#DB4431",
  },
  microContent: {
    zIndex: 2,
    justifyContent: "center",
    gap: 4,
    maxWidth: "68%",
    paddingRight: 8,
  },
  microText1: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "600",
  },
  microText2: {
    color: "#FFFFFF",
    fontSize: 18,
    lineHeight: 22,
    fontWeight: "800",
  },
  microText3: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "600",
  },
});
