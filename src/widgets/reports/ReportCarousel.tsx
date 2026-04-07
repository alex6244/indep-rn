import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import type { Report } from "../../data/reports";
import { shadowStyle } from "../../shared/theme/shadow";

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
  mainImage: {
    width: "100%",
    height: 200,
    backgroundColor: "#EEE",
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
    backgroundColor: "#F1F1F1",
  },
  moreThumb: {
    width: 74,
    height: 48,
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },
  moreThumbText: {
    color: "#FFFFFF",
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
    color: "#1E1E1E",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12,
    color: "#6B6B6B",
  },
  metaRow: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  metaText: {
    fontSize: 12,
    color: "#6B6B6B",
  },
  metaTextRight: {
    fontSize: 12,
    color: "#6B6B6B",
  },
  price: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: "900",
    color: "#1E1E1E",
  },
});

