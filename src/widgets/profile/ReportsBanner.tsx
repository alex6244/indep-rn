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
        <Text style={styles.microText1} numberOfLines={1} ellipsizeMode="tail">
          Вы использовали {reportsUsed} из {reportsTotal} отчётов
        </Text>
        <Text style={styles.microText2} numberOfLines={1} ellipsizeMode="tail">
          Доступно: {reportsAvailable} отчёта
        </Text>
        <Text style={styles.microText3} numberOfLines={1} ellipsizeMode="tail">
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
    borderRadius: 18,
    overflow: "hidden",
    minHeight: 104,
    paddingHorizontal: 16,
    paddingVertical: 14,
    justifyContent: "center",
    position: "relative",
  },
  microContent: {
    zIndex: 1,
    justifyContent: "center",
    gap: 4,
  },
  microText1: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 12,
    lineHeight: 16,
    maxWidth: "94%",
  },
  microText2: {
    marginTop: 2,
    marginBottom: 2,
    color: "#FFFFFF",
    fontSize: 20,
    lineHeight: 24,
    fontWeight: "800",
    maxWidth: "96%",
  },
  microText3: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 12,
    lineHeight: 16,
    maxWidth: "94%",
  },
});
