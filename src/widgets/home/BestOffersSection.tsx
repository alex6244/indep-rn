import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import FavIcon from "../../assets/icons/favourite.svg";
import { colors } from "../../shared/theme/colors";
import { radius } from "../../shared/theme/radius";
import { spacing } from "../../shared/theme/spacing";
import { AppButton } from "../../shared/ui/AppButton";
import { AppCard } from "../../shared/ui/AppCard";
import { SectionTitle } from "../../shared/ui/SectionTitle";

const offers = [
  {
    id: "1",
    price: "67 000 000 ₽",
    subtitle: "2 200 км · 2.0 AT 421 л.с. · Бензин · Полный",
    title: "Mercedes‑Benz GLC AMG 43 AMG II (X254), 2024",
    city: "г. Сочи, ул. Волнова",
    imageUrl: "https://images.unsplash.com/photo-1493238792000-8113da705763?w=700",
  },
  {
    id: "2",
    price: "5 300 000 ₽",
    subtitle: "73 000 км · 2.0 AT 249 л.с. · Бензин · Полный",
    title: "BMW X3 G01, 2020",
    city: "г. Москва, ул. Ленина",
    imageUrl: "https://images.unsplash.com/photo-1542362567-b07e54358753?w=700",
  },
];

export function BestOffersSection() {
  const router = useRouter();

  return (
    <View style={styles.section}>
      <SectionTitle>Лучшие предложения на автомобили</SectionTitle>
      <View style={styles.stack}>
        {offers.map((offer) => (
          <AppCard key={offer.id} style={styles.card} padded={false} muted>
            <Image source={{ uri: offer.imageUrl }} style={styles.image} />
            <View style={styles.body}>
              <Text style={styles.price}>{offer.price}</Text>
              <Text style={styles.subtitle}>{offer.subtitle}</Text>
              <Text style={styles.name}>{offer.title}</Text>
              <View style={styles.row}>
                <AppButton
                  label="Купить отчёт"
                  style={styles.buyButton}
                  onPress={() => router.push("/reports")}
                />
                <TouchableOpacity style={styles.favButton}>
                  <FavIcon width={18} height={18} />
                </TouchableOpacity>
              </View>
              <Text style={styles.city}>{offer.city}</Text>
            </View>
          </AppCard>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: spacing.lg,
    marginBottom: spacing.xxl,
  },
  stack: {
    gap: spacing.md,
  },
  card: {
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 180,
  },
  body: {
    padding: spacing.md,
  },
  price: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.text.primary,
  },
  subtitle: {
    marginTop: spacing.xs,
    fontSize: 12,
    color: colors.text.secondary,
  },
  name: {
    marginTop: spacing.xs,
    fontSize: 12,
    color: colors.text.muted,
  },
  row: {
    marginTop: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  buyButton: {
    flex: 1,
  },
  favButton: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: colors.surface.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  city: {
    marginTop: spacing.sm,
    fontSize: 11,
    color: colors.text.secondary,
  },
});

