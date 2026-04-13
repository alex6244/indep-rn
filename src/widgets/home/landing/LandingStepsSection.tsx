import React from "react";
import { Text, View } from "react-native";
import { PickerOnboardingIllustration1 } from "../pickerOnboardingIllustrations";

import type { landingStyles } from "../../../shared/styles/landing.styles";

type Props = {
  styles: typeof landingStyles;
};

export function LandingStepsSection({ styles }: Props) {
  return (
    <View style={styles.section}>
      <View style={styles.toggleContainer}>
        <View style={[styles.toggleButton, styles.toggleButtonActive]}>
          <Text style={[styles.toggleButtonText, styles.toggleButtonTextActive]}>Хочу продать авто</Text>
        </View>
        <View style={styles.toggleButton}>
          <Text style={styles.toggleButtonText}>Хочу купить авто</Text>
        </View>
      </View>
      <View style={styles.stepsGrid}>
        <View style={styles.stepCard}>
          <View style={styles.stepImage}>
            <PickerOnboardingIllustration1 />
          </View>
          <Text style={styles.stepNumber}>1</Text>
          <Text style={styles.stepTitle}>Оставьте заявку на оценку автомобиля</Text>
          <Text style={styles.stepText}>Специалист свяжется с вами для согласования времени.</Text>
        </View>
      </View>
    </View>
  );
}

