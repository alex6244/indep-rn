import React, { useMemo } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import MicroBanner from "../../assets/profile/microbanner.svg";
import { colors } from "../../shared/theme/colors";
import { radius } from "../../shared/theme/radius";
import { spacing } from "../../shared/theme/spacing";
import { figmaText } from "../../shared/theme/typography";

/** Пропорции microbanner.svg (viewBox 335×95). */
const BANNER_ASPECT_W = 335;
const BANNER_ASPECT_H = 95;
const MARGIN_H = 16;
const MIN_BANNER_HEIGHT = 72;

/** Приглушённый белый на красном фоне баннера. */
const BANNER_TEXT_MUTED = "rgba(255, 255, 255, 0.72)";
const BANNER_TEXT_EMPHASIS = "rgba(255, 255, 255, 0.92)";

type Props = {
  reportsUsed: number;
  reportsTotal: number;
  reportsAvailable: number;
  expiresAt?: string;
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
        <Text style={styles.microTextMuted} numberOfLines={3}>
          Вы использовали {reportsUsed} из {reportsTotal} отчётов.
        </Text>
        <Text style={styles.microTextEmphasis} numberOfLines={2}>
          Доступно: {reportsAvailable} отчёта
        </Text>
        {expiresAt ? (
          <Text style={styles.microTextMuted} numberOfLines={2}>
            Пакет истекает {expiresAt}
          </Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  microBanner: {
    marginTop: 12,
    marginHorizontal: MARGIN_H,
    borderRadius: radius.md,
    overflow: "hidden",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    justifyContent: "center",
    position: "relative",
    backgroundColor: colors.brand.primary,
  },
  microContent: {
    zIndex: 2,
    justifyContent: "center",
    gap: 5,
    maxWidth: "66%",
    paddingRight: 4,
  },
  microTextMuted: {
    ...figmaText.caption,
    fontWeight: "400",
    color: BANNER_TEXT_MUTED,
  },
  microTextEmphasis: {
    ...figmaText.subtitle,
    color: BANNER_TEXT_EMPHASIS,
  },
});
