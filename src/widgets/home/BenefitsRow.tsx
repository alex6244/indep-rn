import React from "react";
import { StyleSheet, Text, View } from "react-native";
import ParameterIcon from "../../assets/mainpage/carousel/parameter.svg";
import TimeIcon from "../../assets/mainpage/carousel/time.svg";

export function BenefitsRow() {
  return (
    <View style={styles.row}>
      <View style={styles.card}>
        <ParameterIcon width={18} height={18} />
        <Text style={styles.title}>Проверка по 100+ параметрам</Text>
        <Text style={styles.text}>
          Проверяем состояние, документы и прошлую эксплуатацию.
        </Text>
      </View>
      <View style={styles.card}>
        <TimeIcon width={18} height={18} />
        <Text style={styles.title}>Экономия времени и денег</Text>
        <Text style={styles.text}>Берем на себя поиск, переговоры и торг.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    marginTop: 12,
    flexDirection: "row",
    gap: 10,
  },
  card: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: "#F1F1F1",
    padding: 12,
    gap: 6,
  },
  title: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1E1E1E",
  },
  text: {
    fontSize: 12,
    color: "#777",
    lineHeight: 16,
  },
});

