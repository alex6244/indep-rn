import { View, Text, StyleSheet } from "react-native";

export default function SelectionRoute() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Подбор авто</Text>
      <Text style={styles.subtitle}>
        Экран в разработке. Здесь будет форма подбора и процесс заказа.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 12,
    color: "#1E1E1E",
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
});

