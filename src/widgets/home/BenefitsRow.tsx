import React from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import ParameterIcon from "../../assets/mainpage/carousel/parameter.svg";
import ReportIcon from "../../assets/mainpage/carousel/report.svg";
import TimeIcon from "../../assets/mainpage/carousel/time.svg";

export function BenefitsRow() {
  const screenWidth = Dimensions.get("window").width;
  const horizontalPadding = 32; // HomeTab: paddingHorizontal: 16
  const availableWidth = Math.max(0, screenWidth - horizontalPadding);
  const gap = 10; // должен совпадать с marginRight у карточек
  // Геометрия старта: видим 1-ю полностью, 2-ю частично, 3-ю не видим.
  // При начале скролла (x=0):
  // 2-я начинает в (cardWidth + gap) и должна “заканчиваться” позже правого края вьюпорта.
  // 3-я начинает в (2 * (cardWidth + gap)) и должна начинаться правее правого края.
  const cardWidth = Math.max(140, availableWidth / 2 + gap / 2);

  const benefits = [
    {
      key: "params",
      icon: <ParameterIcon width={18} height={18} />,
      title: "Проверка по 100+ параметрам",
      text: "Тщательно проверяем состояние, документы и прошлую эксплуатацию",
    },
    {
      key: "time",
      icon: <TimeIcon width={18} height={18} />,
      title: "Экономия времени и денег",
      text: "Берём на себя поиск, переговоры и торг, часто снижая цену автомобиля.",
    },
    {
      key: "reports",
      icon: <ReportIcon width={18} height={18} />,
      title: "Прозрачные отчёты",
      text: "Подробный фото и видеоотчёт по каждому варианту с понятными комментариями и рекомендациями.",
    },
  ] as const;

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.rowScrollContent}
      >
        {benefits.map((b, idx) => (
          <View
            key={b.key}
            style={[
              styles.card,
              { width: cardWidth, alignSelf: "flex-start" },
              idx === benefits.length - 1 && styles.cardLast,
            ]}
          >
            <View style={styles.cardRow}>
              <View style={styles.iconWrap}>{b.icon}</View>
              <View style={styles.textBlock}>
                <Text style={styles.title}>{b.title}</Text>
                <Text style={styles.text}>{b.text}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
  },
  rowScrollContent: {
    paddingRight: 0,
  },
  card: {
    borderRadius: 12,
    backgroundColor: "#F1F1F1",
    padding: 12,
    marginRight: 10,
    minHeight: 124,
  },
  cardLast: {
    marginRight: 0,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  iconWrap: {
    marginTop: 2,
  },
  textBlock: {
    flex: 1,
  },
  title: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1E1E1E",
  },
  text: {
    fontSize: 11,
    color: "#777",
    lineHeight: 15,
  },
});
