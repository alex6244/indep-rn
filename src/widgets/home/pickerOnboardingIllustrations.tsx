import React from "react";
import type { ImageSourcePropType } from "react-native";
import { StyleSheet } from "react-native";
import { Image } from "expo-image";
import SellerStep1 from "../../assets/mainpage/manual/seller/1.svg";
import BuyerStep1 from "../../assets/mainpage/manual/buyer/1.svg";
import SellerStep4 from "../../assets/mainpage/manual/seller/4.svg";

/** Единый источник ассетов для 2×2 онбординга «Я подборщик». */
export const PICKER_ONBOARDING_CAR_IMAGE =
  require("../../assets/cars1.jpg") as ImageSourcePropType;

const imageStyle = StyleSheet.create({
  cover: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
});

export function PickerOnboardingIllustration1() {
  return <SellerStep1 width="100%" height="100%" />;
}

export function PickerOnboardingIllustration2() {
  return <BuyerStep1 width="100%" height="100%" />;
}

export function PickerOnboardingIllustration3() {
  return (
    <Image
      source={PICKER_ONBOARDING_CAR_IMAGE}
      style={imageStyle.cover}
      contentFit="cover"
    />
  );
}

export function PickerOnboardingIllustration4() {
  return <SellerStep4 width="100%" height="100%" />;
}
