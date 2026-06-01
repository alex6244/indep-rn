import { Image } from "expo-image";
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { AppCard } from "../../../shared/ui/AppCard";
import { colors } from "../../../shared/theme/colors";
import { acText, acTitle } from "./autoCredit.styles";
import { radius } from "../../../shared/theme/radius";
import { spacing } from "../../../shared/theme/spacing";
import {
  formatRub,
  formatRubPerMonth,
  formatTermYears,
} from "../lib/autoCreditCalculations";
import type { AutoCreditVehicle } from "./autoCredit.content";

type Props = {
  vehicle: AutoCreditVehicle;
  monthlyFrom: number;
  downPayment: number;
  termYears: number;
  monthlyPayment: number;
};

export function AutoCreditCarSummaryCard({
  vehicle,
  monthlyFrom,
  downPayment,
  termYears,
  monthlyPayment,
}: Props) {
  const { width, height } = useWindowDimensions();
  const imageWidth = width - spacing.lg * 2 - spacing.md * 2;
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <AppCard style={styles.card} padded={false}>
      {lightboxIndex !== null ? (
        <Modal
          visible
          transparent
          animationType="fade"
          statusBarTranslucent
          onRequestClose={() => setLightboxIndex(null)}
        >
          <StatusBar hidden />
          <View style={styles.lightboxBg}>
            <Image
              source={{ uri: vehicle.images[lightboxIndex] }}
              style={{ width, height }}
              contentFit="contain"
              accessibilityLabel={`Фото ${lightboxIndex + 1}`}
            />
            <Pressable
              style={styles.lightboxClose}
              onPress={() => setLightboxIndex(null)}
              accessibilityRole="button"
              accessibilityLabel="Закрыть"
              hitSlop={12}
            >
              <Text style={styles.lightboxCloseText}>✕</Text>
            </Pressable>
            <View style={styles.lightboxCounter}>
              <Text style={styles.lightboxCounterText}>
                {lightboxIndex + 1} / {vehicle.images.length}
              </Text>
            </View>
          </View>
        </Modal>
      ) : null}

      <View style={styles.galleryWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {vehicle.images.map((uri, index) => (
            <Pressable key={`${uri}-${index}`} onPress={() => setLightboxIndex(index)}>
              <Image
                source={{ uri }}
                style={[styles.image, { width: imageWidth }]}
                contentFit="cover"
                accessibilityLabel={`Фото ${index + 1}`}
              />
            </Pressable>
          ))}
        </ScrollView>
        {vehicle.images.length > 0 ? (
          <View style={styles.photoBadge}>
            <Text style={styles.photoBadgeText}>
              {vehicle.images.length} фото
            </Text>
          </View>
        ) : null}
      </View>

      <View style={styles.body}>
        <View style={styles.priceHeader}>
          <Text style={styles.creditFrom}>
            Кредит от {formatRubPerMonth(monthlyFrom)}
          </Text>
          <View style={styles.priceRow}>
            <Text style={styles.price} numberOfLines={2}>
              {formatRub(vehicle.price)}
            </Text>
            {vehicle.oldPrice ? (
              <Text style={styles.oldPrice}>{formatRub(vehicle.oldPrice)}</Text>
            ) : null}
          </View>
        </View>

        <View style={styles.metricsGrid}>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Первый взнос</Text>
            <Text style={styles.metricValue}>{formatRub(downPayment)}</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Срок кредитования</Text>
            <Text style={styles.metricValue}>{formatTermYears(termYears)}</Text>
          </View>
          <View style={[styles.metric, styles.metricWide]}>
            <Text style={styles.metricLabel}>Ежемесячный платёж</Text>
            <Text style={styles.metricValueAccent}>{formatRubPerMonth(monthlyPayment)}</Text>
          </View>
        </View>

        <Text style={styles.ptsTitle}>Данные из ПТС</Text>
        <View style={styles.ptsGrid}>
          <PtsRow label="VIN" value={vehicle.vin} />
          <PtsRow label="Марка" value={vehicle.brand} />
          <PtsRow label="Модель" value={vehicle.model} />
          <PtsRow label="Год выпуска" value={String(vehicle.year)} />
          <PtsRow label="Цвет" value={vehicle.color} />
          <PtsRow label="Объём двигателя" value={vehicle.engineVolume} />
          <PtsRow label="ПТС" value={vehicle.ptsStatus} />
        </View>
      </View>
    </AppCard>
  );
}

function PtsRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.ptsRow}>
      <Text style={styles.ptsLabel}>{label}</Text>
      <Text style={styles.ptsValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  lightboxBg: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  lightboxClose: {
    position: "absolute",
    top: 52,
    right: spacing.lg,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  lightboxCloseText: {
    ...acText,
    color: "#fff",
    fontSize: 16,
  },
  lightboxCounter: {
    position: "absolute",
    bottom: 48,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
  },
  lightboxCounterText: {
    ...acText,
    color: "#fff",
    fontSize: 14,
  },
  card: {
    overflow: "hidden",
    marginBottom: spacing.xl,
  },
  galleryWrap: {
    position: "relative",
  },
  image: {
    height: 200,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
  },
  photoBadge: {
    position: "absolute",
    left: spacing.md,
    bottom: spacing.md,
    backgroundColor: colors.overlay.backdropStrong,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  photoBadgeText: {
    ...acText,
    color: colors.text.inverse,
    fontSize: 12,
  },
  body: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    paddingTop: spacing.lg,
  },
  priceHeader: {
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  creditFrom: {
    ...acTitle,
    fontSize: 15,
    lineHeight: 20,
    color: colors.brand.primary,
  },
  priceRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-end",
    gap: spacing.sm,
  },
  price: {
    ...acTitle,
    flexShrink: 1,
    fontSize: 20,
    lineHeight: 26,
    color: colors.text.primary,
  },
  oldPrice: {
    ...acText,
    fontSize: 15,
    color: colors.text.muted,
    textDecorationLine: "line-through",
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  metric: {
    width: "46%",
  },
  metricWide: {
    width: "100%",
  },
  metricLabel: {
    ...acText,
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  metricValue: {
    ...acText,
    fontSize: 15,
    color: colors.text.primary,
  },
  metricValueAccent: {
    ...acTitle,
    fontSize: 17,
    color: colors.text.primary,
  },
  ptsTitle: {
    ...acTitle,
    fontSize: 16,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  ptsGrid: {
    gap: spacing.sm,
  },
  ptsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  ptsLabel: {
    ...acText,
    fontSize: 14,
    color: colors.text.secondary,
    flex: 1,
  },
  ptsValue: {
    ...acText,
    fontSize: 14,
    color: colors.text.primary,
    flex: 1,
    textAlign: "right",
  },
});
