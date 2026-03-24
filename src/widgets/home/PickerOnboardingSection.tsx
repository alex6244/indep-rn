import React, { useMemo } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type ImageSourcePropType,
} from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Logo from "../../assets/logo.svg";
import SellerStep1 from "../../assets/mainpage/manual/seller/1.svg";
import BuyerStep1 from "../../assets/mainpage/manual/buyer/1.svg";
import SellerStep4 from "../../assets/mainpage/manual/seller/4.svg";
import { PickerOnboardingStepCard } from "./PickerOnboardingStepCard";

type Props = {
  toggle: React.ReactNode;
  onOpenBurger: () => void;
  onPressRegister: () => void;
};

type Step = {
  id: string;
  title: string;
  description: string;
  illustration: React.ReactNode;
};

export function PickerOnboardingSection({
  toggle,
  onOpenBurger,
  onPressRegister,
}: Props) {
  const insets = useSafeAreaInsets();
  const steps = useMemo<Step[]>(
    () => [
      {
        id: "1",
        title: "Зарегистрируйтесь",
        description:
          "Регистрация позволит вам получать заказы от клиентов и размещать объявления для дальнейшей работы.",
        illustration: <SellerStep1 width="100%" height="100%" />,
      },
      {
        id: "2",
        title: "Получите заказ",
        description:
          "Мы направим вам данные по заказу и контакты клиента, чтобы вы могли приступить к подбору автомобиля.",
        illustration: <BuyerStep1 width="100%" height="100%" />,
      },
      {
        id: "3",
        title: "Подберите авто клиенту",
        description:
          "Подберите автомобиль с учётом всех пожеланий клиента: бюджета, марки, модели, комплектации и состояния.",
        illustration: (
          <Image
            source={require("../../assets/cars1.jpg") as ImageSourcePropType}
            style={styles.photoPreview}
            contentFit="cover"
          />
        ),
      },
      {
        id: "4",
        title: "Разместите объявление",
        description:
          "За каждое опубликованное объявление вы получаете вознаграждение в виде 1000 рублей.",
        illustration: <SellerStep4 width="100%" height="100%" />,
      },
    ],
    []
  );

  return (
    <View>
      <View style={[styles.topBar, { paddingTop: insets.top + 6 }]}>
        <Logo width={82} height={22} />
        <TouchableOpacity
          accessibilityRole="button"
          onPress={onOpenBurger}
          style={styles.burgerButton}
        >
          <View style={styles.burgerLine} />
          <View style={styles.burgerLine} />
          <View style={styles.burgerLine} />
        </TouchableOpacity>
      </View>

      {toggle}

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
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  burgerButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  burgerLine: {
    width: 22,
    height: 2.5,
    borderRadius: 2,
    backgroundColor: "#DB4431",
  },
  grid: {
    marginTop: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 18,
  },
  photoPreview: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
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
