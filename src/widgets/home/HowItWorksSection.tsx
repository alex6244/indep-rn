import React from "react";
import { StyleSheet, Text, View } from "react-native";

const steps = [
  {
    id: "1",
    title: "Зарегистрируйтесь",
    text: "Регистрация позволит сохранить рекомендации и получать персональные подборки.",
  },
  {
    id: "2",
    title: "Выберите авто",
    text: "Выберите автомобиль из каталога и доверьте поиск профессионалам.",
  },
  {
    id: "3",
    title: "Получите отчёт по авто",
    text: "Узнайте достоверную информацию об автомобиле перед покупкой.",
  },
  {
    id: "4",
    title: "Оплата услуг",
    text: "Оплата проходит быстро и безопасно. Подходит любой удобный способ.",
  },
];

export function HowItWorksSection() {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>Как это работает</Text>
      <View style={styles.grid}>
        {steps.map((step) => (
          <View key={step.id} style={styles.card}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{step.id}</Text>
            </View>
            <Text style={styles.cardTitle}>{step.title}</Text>
            <Text style={styles.cardText}>{step.text}</Text>
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
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  card: {
    width: "48.5%",
    borderRadius: 12,
    backgroundColor: "#F1F1F1",
    padding: 12,
    minHeight: 150,
  },
  badge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#FBDAD6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 12,
    color: "#DB4431",
    fontWeight: "700",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E1E1E",
    marginBottom: 8,
  },
  cardText: {
    fontSize: 12,
    color: "#777",
    lineHeight: 16,
  },
});

