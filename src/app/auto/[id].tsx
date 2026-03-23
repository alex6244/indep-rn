import { Link, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import Auto from "../../screens/Auto";

export default function AutoRoute() {
  const { id } = useLocalSearchParams<{ id?: string }>();

  return (
    <View style={styles.container}>
      <Auto />
      {id ? (
        <Text style={styles.debug}>ID: {id}</Text>
      ) : (
        <Text style={styles.debug}>ID не указан</Text>
      )}
      {!id && (
        <Link href="../" style={styles.backLink}>
          <Text>← Назад</Text>
        </Link>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backLink: {
    position: "absolute",
    left: 12,
    top: 12,
    zIndex: 10,
  },
  debug: {
    position: "absolute",
    right: 12,
    bottom: 12,
    fontSize: 12,
    color: "#888",
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
});
