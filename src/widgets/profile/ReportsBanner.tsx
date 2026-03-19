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
      <MicroBanner style={StyleSheet.absoluteFillObject} width="100%" height="100%" />
      <View style={styles.microContent}>
        <Text style={styles.microText1}>
          Вы использовали {reportsUsed} из {reportsTotal} отчётов
        </Text>
        <Text style={styles.microText2}>Доступно: {reportsAvailable} отчёта</Text>
        <Text style={styles.microText3}>Пакет истекает {expiresAt}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  microBanner: {
    marginTop: 12,
    marginHorizontal: 16,
    borderRadius: 18,
    overflow: "hidden",
    minHeight: 95,
    padding: 16,
    justifyContent: "center",
    position: "relative",
  },
  microContent: {
    zIndex: 1,
  },
  microText1: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 11,
  },
  microText2: {
    marginTop: 6,
    marginBottom: 6,
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },
  microText3: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 11,
  },
});
