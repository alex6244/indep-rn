import React, { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  PickerOnboardingIllustration1,
  PickerOnboardingIllustration2,
  PickerOnboardingIllustration3,
  PickerOnboardingIllustration4,
} from "./pickerOnboardingIllustrations";
import { PickerOnboardingStepCard } from "./PickerOnboardingStepCard";

type Props = {
  onPressRegister: () => void;
};

type Step = {
  id: string;
  title: string;
  description: string;
  illustration: React.ReactNode;
};

export function PickerOnboardingSection({ onPressRegister }: Props) {
  const steps = useMemo<Step[]>(
    () => [
      {
        id: "1",
        title: "Зарегистрируйтесь",
        description:
          "Регистрация позволит вам получать заказы от клиентов и размещать объявления для дальнейшей работы.",
        illustration: <PickerOnboardingIllustration1 />,
      },
      {
        id: "2",
        title: "Получите заказ",
        description:
          "Мы направим вам данные по заказу и контакты клиента, чтобы вы могли приступить к подбору автомобиля.",
        illustration: <PickerOnboardingIllustration2 />,
      },
      {
        id: "3",
        title: "Подберите авто клиенту",
        description:
          "Подберите автомобиль с учётом всех пожеланий клиента: бюджета, марки, модели, комплектации и состояния.",
        illustration: <PickerOnboardingIllustration3 />,
      },
      {
        id: "4",
        title: "Разместите объявление",
        description:
          "За каждое опубликованное объявление вы получаете вознаграждение в виде 1000 рублей.",
        illustration: <PickerOnboardingIllustration4 />,
      },
    ],
    []
  );

  return (
    <View>
      <View style={styles.grid}>
        {steps.map((step) => (
          <PickerOnboardingStepCard
            key={step.id}
            step={step.id}
            title={step.title}
            description={step.description}
            illustration={step.illustration}
          />
        ))}
      </View>

      <TouchableOpacity
        style={styles.registerButton}
        onPress={onPressRegister}
        accessibilityRole="button"
      >
        <Text style={styles.registerButtonText}>Зарегистрироваться</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    marginTop: 14,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 18,
  },
  registerButton: {
    marginTop: 24,
    marginBottom: 8,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#DB4431",
    alignItems: "center",
    justifyContent: "center",
  },
  registerButtonText: {
    color: "#FFFFFF",
    fontSize: 24 / 2,
    lineHeight: 16,
    fontWeight: "600",
  },
});
