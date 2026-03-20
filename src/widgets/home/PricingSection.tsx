import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const plans = [
  {
    id: "day",
    title: "Автоподборщик на день",
    text: "Подбор авто под бюджет и задачи, проверка юр. чистоты и истории.",
    price: "12 000 ₽",
  },
  {
    id: "one",
    title: "Разовая диагностика",
    text: "Точечная проверка перед покупкой: кузов, мотор, коробка, электроника.",
    price: "12 000 ₽",
  },
];

export function PricingSection() {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>Стоимость услуг подборщика</Text>
      <View style={styles.row}>
        {plans.map((plan) => (
          <View key={plan.id} style={styles.card}>
            <Text style={styles.cardTitle}>{plan.title}</Text>
            <Text style={styles.cardText}>{plan.text}</Text>
            <Text style={styles.price}>{plan.price}</Text>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Заказать</Text>
            </TouchableOpacity>
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
  row: {
    flexDirection: "row",
    gap: 10,
  },
  card: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: "#F1F1F1",
    padding: 12,
    minHeight: 280,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E1E1E",
    marginBottom: 6,
  },
  cardText: {
    fontSize: 12,
    color: "#666",
    lineHeight: 16,
  },
  price: {
    marginTop: "auto",
    fontSize: 28,
    fontWeight: "800",
    color: "#1E1E1E",
  },
  button: {
    marginTop: 10,
    backgroundColor: "#DB4431",
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});

