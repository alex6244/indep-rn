import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { spacing } from "../../shared/theme/spacing";
import { AppButton } from "../../shared/ui/AppButton";
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
          "Подберите автомобиль с учётом всех пожеланий клиента: бюджета, марки, модели, комплектации и состояния. Для удобства выбора клиента заполните чек-лист по авто.",
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
    [],
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

      <AppButton
        label="Зарегистрироваться"
        style={styles.registerButton}
        onPress={onPressRegister}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    marginTop: spacing.md,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: spacing.lg + 2,
  },
  registerButton: {
    marginTop: spacing.xxl,
    marginBottom: spacing.sm,
    minHeight: 52,
  },
});
