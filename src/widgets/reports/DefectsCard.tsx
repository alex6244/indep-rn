import React, { useMemo, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { EntitiesToggle } from "../entitiesToggle/EntitiesToggle";
import type { Report } from "../../data/reports";

type DefectsMode = "scheme" | "photos";

type Props = {
  report: Report;
};

export function DefectsCard({ report }: Props) {
  const [mode, setMode] = useState<DefectsMode>("scheme");

  const toggleValue = useMemo(() => {
    return mode === "scheme" ? "cash" : "credit";
  }, [mode]);

  const defects = report.defects;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Дефекты</Text>

      <EntitiesToggle
        leftLabel="Схема повреждений"
        rightLabel="Фото повреждений"
        value={toggleValue as "cash" | "credit"}
        onChange={(v: "cash" | "credit") => {
          setMode(v === "cash" ? "scheme" : "photos");
        }}
      />

      <View style={styles.body}>
        {mode === "scheme" ? (
          <Image source={defects.schemeImageUrl} style={styles.schemeImage} />
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.photosScroll}
          >
            {defects.photoImageUrls.map((src, idx) => (
              <Image key={idx} source={src} style={styles.photoThumb} />
            ))}
          </ScrollView>
        )}

        <Text style={styles.summaryText}>{defects.summaryText}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    shadowColor: "#000000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1E1E1E",
    marginBottom: 12,
  },
  body: {
    marginTop: 10,
  },
  schemeImage: {
    width: "100%",
    height: 170,
    backgroundColor: "#F1F1F1",
    borderRadius: 12,
  },
  photosScroll: {
    marginTop: 4,
    flexDirection: "row",
  },
  photoThumb: {
    width: 160,
    height: 95,
    borderRadius: 12,
    marginRight: 10,
    backgroundColor: "#F1F1F1",
  },
  summaryText: {
    marginTop: 12,
    fontSize: 12,
    color: "#777777",
    lineHeight: 18,
  },
});

