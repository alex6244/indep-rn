import React, { useMemo, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { EntitiesToggle } from "../entitiesToggle/EntitiesToggle";
import type { Report } from "../../types/report";
import { colors } from "../../shared/theme/colors";

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
        onChange={(v) => {
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
    backgroundColor: colors.surface.card,
    borderRadius: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text.primary,
    marginBottom: 12,
  },
  body: {
    marginTop: 10,
  },
  schemeImage: {
    width: "100%",
    height: 170,
    backgroundColor: colors.surface.muted,
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
    backgroundColor: colors.surface.muted,
  },
  summaryText: {
    marginTop: 12,
    fontSize: 12,
    color: colors.text.tertiary,
    lineHeight: 18,
  },
});

