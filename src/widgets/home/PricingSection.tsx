import React, { useMemo, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

import ServiceBg1 from "../../assets/mainpage/services/1.svg";
import ServiceBg2 from "../../assets/mainpage/services/2.svg";
import ServiceBg3 from "../../assets/mainpage/services/3.svg";

type BgComponent = typeof ServiceBg1;

type Plan = {
  id: string;
  title: string;
  text: string;
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
        text: "Это услуга для тех, кто хочет доверить поиск авто профессионалу.",
        price: "12 000 ₽",
        Bg: ServiceBg1,
      },
      {
        id: "one",
        title: "Разовая диагностика",
        text: "Это услуга для тех, кто хочет точечную проверку перед покупкой.",
        price: "12 000 ₽",
        Bg: ServiceBg2,
      },
      {
        id: "mileage",
        title: "Подбор авто с пробегом под ключ",
        text: "Для тех, кто хочет купить поддержанный автомобиль без забот.",
        price: "12 000 ₽",
        Bg: ServiceBg3,
      },
    ],
    [],
  );

  const GAP = 12;
  const w = containerWidth || screenWidth;
  const cardWidth = Math.round(w * 0.9);
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
                  <View pointerEvents="none" style={styles.cardBg}>
                    <item.Bg width="100%" height="100%" />
                  </View>

                  {/* Content above bg */}
                  <View style={styles.cardContent}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <Text style={styles.cardText}>{item.text}</Text>

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
    minHeight: 280,
    backgroundColor: "#F1F1F1", // fallback под подложку
    position: "relative",
  },

  cardBg: {
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },

  cardContent: {
    flex: 1,
    padding: 12,
    position: "relative",
    zIndex: 1,
    justifyContent: "space-between",
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
  },
});
