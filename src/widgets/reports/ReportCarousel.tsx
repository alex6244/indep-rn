import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import type { Report } from "../../types/report";
import { colors } from "../../shared/theme/colors";

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
});

