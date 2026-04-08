import React, { useMemo, useState } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

import ServiceBg1 from "../../assets/mainpage/services/1.svg";
import ServiceBg2 from "../../assets/mainpage/services/2.svg";
import ServiceBg3 from "../../assets/mainpage/services/3.svg";
import { FONT_FAMILY } from "../../shared/theme/fonts";

type BgComponent = typeof ServiceBg1;

type Plan = {
  id: string;
  title: string;
  intro: string;
  listTitle: string;
  bullets: string[];
  price: string;
  Bg: BgComponent;
};

export function PricingSection() {
  const { width: screenWidth } = useWindowDimensions();
  const [containerWidth, setContainerWidth] = useState(0);

  const plans = useMemo<Plan[]>(
    () => [
      {
        id: "day",
        title: "Автоподборщик на день",
        intro: "Это услуга для тех, кто хочет доверить поиск и проверку автомобиля профессионалу.",
        listTitle: "В течение дня наш специалист:",
        bullets: [
          "Подбирает автомобили по вашим критериям: бюджет, марка, модель, комплектация",
          "Проверяет юридическую чистоту: отсутствие обременений, кредитов, ограничений",
          "Консультирует по каждой сделке и помогает принять окончательное решение",
        ],
        price: "12 000 ₽",
        Bg: ServiceBg1,
      },
      {
        id: "one",
        title: "Разовая диагностика",
        intro:
          "Это услуга для тех, кто хочет быстро и точно проверить состояние автомобиля перед покупкой.",
        listTitle: "В услугу включено:",
        bullets: [
          "Подборщик осматривает автомобиль и проверяет ключевые узлы",
          "Проверяет двигатель, подвеску и электронику, оценивая их работу и выявляя возможные проблемы.",
          "Проверяет скрытые поломки и проблемы, которые могут проявиться в будущем.",
        ],
        price: "12 000 ₽",
        Bg: ServiceBg2,
      },
      {
        id: "mileage",
        title: "Подбор авто с пробегом под ключ",
        intro: "Для тех, кто хочет купить подержанный автомобиль без забот.",
        listTitle: "В услуге:",
        bullets: [
          "Подбор автомобиля с пробегом по вашим критериям: марка, модель, комплектация, цена",
          "Проверка юридической чистоты и сопровождение сделки",
          "Передача автомобиля с полным пакетом документов и рекомендациями по эксплуатации",
        ],
        price: "12 000 ₽",
        Bg: ServiceBg3,
      },
    ],
    [],
  );

  const GAP = 12;
  const w = containerWidth || screenWidth;
  // Card should be narrower, while keeping enough vertical space for longer copy.
  const cardWidth = Math.round(w * 0.72);
  const snapInterval = cardWidth + GAP;

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Стоимость услуг подборщика</Text>

      <View
        onLayout={(e) => {
          setContainerWidth(e.nativeEvent.layout.width);
        }}
      >
        <FlatList
          data={plans}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToAlignment="start"
          decelerationRate="fast"
          snapToInterval={snapInterval}
          contentContainerStyle={{ paddingRight: 16 }}
          renderItem={({ item, index }) => {
            const marginRight = index === plans.length - 1 ? 0 : GAP;

            return (
              <View style={{ marginRight }}>
                <View style={[styles.card, { width: cardWidth }]}>
                  {/* Decorative background */}
                  <View style={[styles.cardBg, { pointerEvents: "none" }]}>
                    <item.Bg
                      width="100%"
                      height="100%"
                      // Ensure the SVG fully fills the card container without leaving “empty” margins.
                      preserveAspectRatio="none"
                    />
                  </View>

                  {/* Content above bg */}
                  <View style={styles.cardContent}>
                    <ScrollView
                      style={styles.textScroll}
                      contentContainerStyle={styles.textScrollContent}
                      showsVerticalScrollIndicator={false}
                    >
                      <View style={styles.titleWrap}>
                        <Text style={styles.cardTitle}>{item.title}</Text>
                      </View>
                      <View style={styles.introWrap}>
                        <Text style={styles.cardText}>{item.intro}</Text>
                      </View>
                      <View style={styles.listTitleWrap}>
                        <Text style={styles.listTitle}>{item.listTitle}</Text>
                      </View>
                      <View style={styles.bullets}>
                        {item.bullets.map((t, i) => (
                          <View key={`${item.id}-b-${i}`} style={styles.bulletRow}>
                            <Text style={styles.bulletMark}>•</Text>
                            <Text style={styles.bulletText}>{t}</Text>
                          </View>
                        ))}
                      </View>
                    </ScrollView>

                    <View style={styles.bottom}>
                      <Text style={styles.price}>{item.price}</Text>

                      <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Заказать</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            );
          }}
        />
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

  card: {
    borderRadius: 12,
    overflow: "hidden",
    minHeight: 420,
    backgroundColor: "#F1F1F1", // fallback под подложку
    position: "relative",
  },

  cardBg: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },

  cardContent: {
    flex: 1,
    padding: 12,
    position: "relative",
    zIndex: 1,
    justifyContent: "space-between",
  },

  textScroll: {
    flex: 1,
  },
  textScrollContent: {
    paddingBottom: 8,
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E1E1E",
    lineHeight: 20,
  },
  titleWrap: {
    minHeight: 40,
    marginBottom: 6,
  },

  cardText: {
    fontSize: 15,
    color: "#666",
    lineHeight: 20,
  },
  introWrap: {
    minHeight: 64,
    marginBottom: 10,
  },

  listTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E1E1E",
    lineHeight: 20,
  },
  listTitleWrap: {
    minHeight: 24,
    marginBottom: 8,
  },
  bullets: {
    gap: 10,
  },
  bulletRow: {
    flexDirection: "row",
  },
  bulletMark: {
    width: 16,
    fontSize: 15,
    lineHeight: 20,
    color: "#1E1E1E",
  },
  bulletText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
    color: "#1E1E1E",
  },

  bottom: {
    marginTop: 12,
  },

  price: {
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
    justifyContent: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    fontFamily: FONT_FAMILY.button,
  },
});
