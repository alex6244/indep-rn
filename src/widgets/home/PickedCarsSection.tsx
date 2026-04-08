import React from "react";
import { StyleSheet, Text, View } from "react-native";
import type { ImageSourcePropType } from "react-native";
import { Image } from "expo-image";
import { shadowStyle } from "../../shared/theme/shadow";

type PickedCar = {
  id: string;
  name: string;
  text: string;
  /** Bundled asset (Metro) */
  image: ImageSourcePropType;
};

const cars: PickedCar[] = [
  {
    id: "1",
    name: "BMW X5",
    text: "Подобрали BMW X5 до 2.9 млн рублей с пробегом до 70 тыс. км у официального дилера.",
    image: require("../../assets/reviews/1.webp"),
  },
  {
    id: "2",
    name: "Kia Venga",
    text: "Проверили юридическую чистоту и историю обслуживания перед покупкой.",
    image: require("../../assets/reviews/2.webp"),
  },
  {
    id: "3",
    name: "Audi A6",
    text: "Состояние ЛКП и агрегатов соответствует заявленному пробегу.",
    image: require("../../assets/reviews/3.webp"),
  },
];

export function PickedCarsSection() {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>Автомобили подобранные INDEP</Text>
      <View style={styles.stack}>
        {cars.map((car, index) => (
          <View
            key={car.id}
            style={[styles.card, index % 2 === 1 ? styles.cardReverse : null]}
          >
            <View style={styles.imageWrap}>
              <Image
                source={car.image}
                style={styles.image}
                contentFit="cover"
                transition={150}
              />
            </View>
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
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1E1E1E",
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  stack: {
    gap: 12,
  },
  card: {
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    padding: 12,
    flexDirection: "row",
    gap: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#E8E8E8",
    ...(shadowStyle({
      boxShadow: "0px 2px 8px rgba(0,0,0,0.06)",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 2,
    }) as object),
    elevation: 2,
  },
  cardReverse: {
    flexDirection: "row-reverse",
  },
  imageWrap: {
    width: 120,
    height: 100,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#EEE",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  body: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E1E1E",
    marginBottom: 6,
  },
  text: {
    fontSize: 10,
    color: "#666",
    lineHeight: 14,
  },
});
