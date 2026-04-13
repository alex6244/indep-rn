import React, { useMemo } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import MicroBanner from "../../assets/profile/microbanner.svg";

/** Пропорции microbanner.svg (viewBox 335×95). */
const BANNER_ASPECT_W = 335;
const BANNER_ASPECT_H = 95;
const MARGIN_H = 16;
const MIN_BANNER_HEIGHT = 72;

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
  const { width: windowWidth } = useWindowDimensions();

  const bannerWidth = Math.max(0, windowWidth - MARGIN_H * 2);
  const bannerHeight = useMemo(() => {
    const h = Math.round(bannerWidth * (BANNER_ASPECT_H / BANNER_ASPECT_W));
    return Math.max(MIN_BANNER_HEIGHT, h);
  }, [bannerWidth]);

  return (
    <TouchableOpacity
      style={[styles.microBanner, { height: bannerHeight }]}
      activeOpacity={0.9}
      onPress={onPress}
    >
      <MicroBanner
        style={StyleSheet.absoluteFillObject}
        width={bannerWidth}
        height={bannerHeight}
        preserveAspectRatio="xMidYMid slice"
      />
      <View style={styles.microContent}>
        <Text style={styles.microText1} numberOfLines={3}>
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
    marginHorizontal: MARGIN_H,
    borderRadius: 12,
    overflow: "hidden",
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: "center",
    position: "relative",
    backgroundColor: "#DB4431",
  },
  microContent: {
    zIndex: 2,
    justifyContent: "center",
    gap: 5,
    maxWidth: "66%",
    paddingRight: 4,
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
