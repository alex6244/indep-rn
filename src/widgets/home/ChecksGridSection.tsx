import React from "react";
import { StyleSheet, Text, View } from "react-native";
import C1 from "../../assets/mainpage/parameters/tech/1.svg";
import C2 from "../../assets/mainpage/parameters/tech/2.svg";
import C3 from "../../assets/mainpage/parameters/tech/3.svg";
import C4 from "../../assets/mainpage/parameters/tech/4.svg";
import C5 from "../../assets/mainpage/parameters/tech/5.svg";
import C6 from "../../assets/mainpage/parameters/tech/6.svg";

const items = [
  { key: "1", title: "Пробег авто и его соответствие", Icon: C1 },
  { key: "2", title: "Состояние жидкостей", Icon: C2 },
  { key: "3", title: "Подвеска автомобиля", Icon: C3 },
  { key: "4", title: "Двигатель", Icon: C4 },
  { key: "5", title: "Коробка передач", Icon: C5 },
  { key: "6", title: "Шины и диски", Icon: C6 },
];

export function ChecksGridSection() {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>Что проверяют подборщики</Text>
      <Text style={styles.subtitle}>Техническая сторона</Text>
      <View style={styles.grid}>
        {items.map((item) => (
          <View key={item.key} style={styles.card}>
            <item.Icon width={48} height={48} />
            <Text style={styles.cardText}>{item.title}</Text>
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  card: {
    width: "31.5%",
    borderRadius: 12,
    backgroundColor: "#F1F1F1",
    padding: 10,
    alignItems: "center",
    minHeight: 130,
  },
  cardText: {
    marginTop: 8,
    fontSize: 11,
    textAlign: "center",
    color: "#555",
  },
});

