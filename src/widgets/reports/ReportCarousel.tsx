import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import type { Report } from "../../types/report";
import { colors } from "../../shared/theme/colors";

const CHECK_COLORS: Record<"info" | "ok" | "bad", string> = {
  info: colors.text.tertiary,
  ok: colors.status.success,
  bad: colors.brand.primary,
};

const CHECK_ICONS: Record<"info" | "ok" | "bad", string> = {
  info: "ℹ",
  ok: "✓",
  bad: "!",
};

type Props = {
  report: Report;
};

export function ReportCarousel({ report }: Props) {
  const images = report.carouselImages ?? [];
  const mainImage = images[0] ?? report.imageUrl;
  const thumbImages = images.slice(1, 4);

  return (
    <View style={styles.card}>
      <Image source={mainImage} style={styles.mainImage} />

      <View style={styles.thumbsRow}>
        {thumbImages.map((src, idx) => (
          <Image
            key={idx}
            source={src}
            style={styles.thumb}
          />
        ))}

        <View style={styles.moreThumb}>
          <Text style={styles.moreThumbText}>
            {report.photosCountText ?? "67+ фото"}
          </Text>
        </View>
      </View>

      <View style={styles.body}>
        <Text style={styles.title}>{report.title}</Text>
        <Text style={styles.subtitle}>{report.subtitle}</Text>

        {(report.yearText || report.bodyTypeText) && (
          <View style={styles.metaRow}>
            <Text style={styles.metaText}>{report.bodyTypeText ?? ""}</Text>
            <Text style={styles.metaTextRight}>{report.yearText ?? ""}</Text>
          </View>
        )}

        <Text style={styles.price}>{report.price}</Text>

        {!!report.creditText && (
          <Text style={styles.credit}>{report.creditText}</Text>
        )}

        {report.checks && report.checks.length > 0 && (
          <View style={styles.checksWrap}>
            {report.checks.map((check, i) => (
              <View key={i} style={styles.checkRow}>
                <Text style={[styles.checkIcon, { color: CHECK_COLORS[check.tone] }]}>
                  {CHECK_ICONS[check.tone]}
                </Text>
                <Text style={[styles.checkLabel, { color: CHECK_COLORS[check.tone] }]}>
                  {check.label}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface.card,
    borderRadius: 20,
    overflow: "hidden",
    marginHorizontal: 16,
    marginBottom: 16,
  },
  mainImage: {
    width: "100%",
    height: 200,
    backgroundColor: colors.icon.placeholder,
  },
  thumbsRow: {
    flexDirection: "row",
    padding: 12,
    gap: 8,
    alignItems: "center",
  },
  thumb: {
    width: 74,
    height: 48,
    borderRadius: 10,
    backgroundColor: colors.surface.muted,
  },
  moreThumb: {
    width: 74,
    height: 48,
    borderRadius: 10,
    backgroundColor: colors.overlay.backdrop,
    justifyContent: "center",
    alignItems: "center",
  },
  moreThumbText: {
    color: colors.text.inverse,
    fontSize: 10,
    fontWeight: "700",
    textAlign: "center",
  },
  body: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text.primary,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12,
    color: colors.text.secondary,
  },
  metaRow: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  metaText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  metaTextRight: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  price: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: "900",
    color: colors.text.primary,
  },
  credit: {
    marginTop: 4,
    fontSize: 13,
    color: colors.text.secondary,
  },
  checksWrap: {
    marginTop: 12,
    gap: 6,
  },
  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  checkIcon: {
    fontSize: 13,
    fontWeight: "700",
    width: 16,
    textAlign: "center",
  },
  checkLabel: {
    fontSize: 12,
    fontWeight: "500",
    flexShrink: 1,
  },
});

