import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import EmptyIllustration from "../../assets/profile/empty.svg";
import { FONT_FAMILY } from "../../shared/theme/fonts";

type Props = {
  onOpenCatalog: () => void;
};

export function ClientEmptyState({ onOpenCatalog }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        У вас еще нет ни одного купленного отчёта
      </Text>
      <Text style={styles.subtitle}>
        Выберите автомобиль и получите первый отчёт.
      </Text>
      <EmptyIllustration
        style={styles.illustrationSvg}
        width={160}
        height={180}
      />
      <TouchableOpacity style={styles.button} onPress={onOpenCatalog}>
        <Text style={styles.buttonText}>Смотреть авто</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 32,
    paddingTop: 40,
    alignItems: "center",
  },
  illustration: {
    width: 140,
    height: 160,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#E5E5E5",
    marginBottom: 24,
  },
  illustrationSvg: {
    marginBottom: 24,
    alignSelf: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E1E1E",
    textAlign: "center",
  },
  subtitle: {
    marginTop: 8,
    fontSize: 13,
    color: "#777",
    textAlign: "center",
  },
  button: {
    marginTop: 24,
    width: "100%",
    borderRadius: 16,
    backgroundColor: "#DB4431",
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: FONT_FAMILY.button,
  },
});
