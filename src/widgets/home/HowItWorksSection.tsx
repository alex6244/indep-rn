import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../shared/theme/colors";
import { spacing } from "../../shared/theme/spacing";
import { AppCard } from "../../shared/ui/AppCard";
import { SectionTitle } from "../../shared/ui/SectionTitle";

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
      <SectionTitle>Как это работает</SectionTitle>
      <View style={styles.grid}>
        {steps.map((step) => (
          <AppCard key={step.id} style={styles.card} muted>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{step.id}</Text>
            </View>
            <Text
              style={styles.cardTitle}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.8}
            >
              {step.title}
            </Text>
            <Text style={styles.cardText}>{step.text}</Text>
          </AppCard>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: spacing.lg,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm + 2,
  },
  card: {
    width: "48.5%",
    minHeight: 150,
  },
  badge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.status.warningBg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  badgeText: {
    fontSize: 12,
    color: colors.brand.primary,
    fontWeight: "700",
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  cardText: {
    fontSize: 11,
    color: colors.text.secondary,
    lineHeight: 16,
  },
});

