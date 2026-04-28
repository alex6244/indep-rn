import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import EmptyIllustration from "../../assets/profile/empty.svg";
import { FONT_FAMILY } from "../../shared/theme/fonts";
import { colors } from "../../shared/theme/colors";
import { radius } from "../../shared/theme/radius";
import { spacing } from "../../shared/theme/spacing";

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
      <TouchableOpacity
        style={styles.button}
        onPress={onOpenCatalog}
        accessibilityRole="button"
        accessibilityLabel="Смотреть автомобили в каталоге"
      >
        <Text style={styles.buttonText}>Смотреть авто</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.xxxl,
    paddingTop: 40,
    alignItems: "center",
  },
  illustration: {
    width: 140,
    height: 160,
    borderRadius: radius.lg + 8,
    borderWidth: 2,
    borderColor: colors.border.soft,
    marginBottom: spacing.xxl,
  },
  illustrationSvg: {
    marginBottom: 24,
    alignSelf: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text.primary,
    textAlign: "center",
  },
  subtitle: {
    marginTop: 8,
    fontSize: 13,
    color: colors.text.subtle,
    textAlign: "center",
  },
  button: {
    marginTop: spacing.xxl,
    width: "100%",
    borderRadius: radius.lg,
    backgroundColor: colors.brand.primary,
    minHeight: 44,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: colors.text.inverse,
    fontSize: 16,
    fontWeight: "600",
    fontFamily: FONT_FAMILY.button,
  },
});
