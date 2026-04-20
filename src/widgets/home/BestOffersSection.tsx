import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import FavIcon from "../../assets/icons/favourite.svg";

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
      <Text style={styles.title}>Лучшие предложения на автомобили</Text>
      <View style={styles.stack}>
        {offers.map((offer) => (
          <View key={offer.id} style={styles.card}>
            <Image source={{ uri: offer.imageUrl }} style={styles.image} />
            <View style={styles.body}>
              <Text style={styles.price}>{offer.price}</Text>
              <Text style={styles.subtitle}>{offer.subtitle}</Text>
              <Text style={styles.name}>{offer.title}</Text>
              <View style={styles.row}>
                <TouchableOpacity
                  style={styles.buyButton}
                  onPress={() => router.push("/reports")}
                >
                  <Text style={styles.buyText}>Купить отчёт</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.favButton}>
                  <FavIcon width={18} height={18} />
                </TouchableOpacity>
              </View>
              <Text style={styles.city}>{offer.city}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 18,
    marginBottom: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#1E1E1E",
    marginBottom: 10,
  },
  stack: {
    gap: 12,
  },
  card: {
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#F1F1F1",
  },
  image: {
    width: "100%",
    height: 180,
  },
  body: {
    padding: 12,
  },
  price: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1E1E1E",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12,
    color: "#666",
  },
  name: {
    marginTop: 4,
    fontSize: 12,
    color: "#8A8A8A",
  },
  row: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  buyButton: {
    flex: 1,
    backgroundColor: "#DB4431",
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
  },
  buyText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  favButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  city: {
    marginTop: 8,
    fontSize: 11,
    color: "#777",
  },
});

