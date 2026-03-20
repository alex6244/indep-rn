import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

const cars = [
  {
    id: "1",
    name: "BMW X5",
    text: "Подобрали BMW X5 до 2.9 млн рублей с пробегом до 70 тыс. км у официального дилера.",
    imageUrl: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500",
  },
  {
    id: "2",
    name: "Kia Venga",
    text: "Проверили юридическую чистоту и историю обслуживания перед покупкой.",
    imageUrl: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500",
  },
  {
    id: "3",
    name: "Audi A6",
    text: "Состояние ЛКП и агрегатов соответствует заявленному пробегу.",
    imageUrl: "https://images.unsplash.com/photo-1549924231-f129b911e442?w=500",
  },
];

export function PickedCarsSection() {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>Автомобили подобранные INDEP</Text>
      <View style={styles.stack}>
        {cars.map((car) => (
          <View key={car.id} style={styles.card}>
            <Image source={{ uri: car.imageUrl }} style={styles.image} />
            <View style={styles.body}>
              <Text style={styles.name}>{car.name}</Text>
              <Text style={styles.text}>{car.text}</Text>
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
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#1E1E1E",
    marginBottom: 10,
  },
  stack: {
    gap: 10,
  },
  card: {
    borderRadius: 14,
    backgroundColor: "#F1F1F1",
    padding: 10,
    flexDirection: "row",
    gap: 10,
  },
  image: {
    width: 120,
    height: 100,
    borderRadius: 8,
  },
  body: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E1E1E",
    marginBottom: 4,
  },
  text: {
    fontSize: 12,
    color: "#666",
    lineHeight: 16,
  },
});

