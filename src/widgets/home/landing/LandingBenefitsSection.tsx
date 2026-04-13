import React from "react";
import { ScrollView, Text, View } from "react-native";
import ParameterIcon from "../../../assets/mainpage/carousel/parameter.svg";
import ReportIcon from "../../../assets/mainpage/carousel/report.svg";
import TimeIcon from "../../../assets/mainpage/carousel/time.svg";

import type { landingStyles } from "../../../shared/styles/landing.styles";

type Props = {
  styles: typeof landingStyles;
};

export function LandingBenefitsSection({ styles }: Props) {
  return (
    <View style={styles.section}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalCards}
      >
        <View style={styles.benefitCard}>
          <ParameterIcon width={32} height={32} />
          <Text style={styles.benefitTitle}>Проверка по 100+ параметрам</Text>
          <Text style={styles.benefitText}>Тщательно проверяем состояние, документы и историю.</Text>
        </View>
        <View style={styles.benefitCard}>
          <TimeIcon width={32} height={32} />
          <Text style={styles.benefitTitle}>Экономия времени и денег</Text>
          <Text style={styles.benefitText}>Берём на себя поиск, переговоры и торг.</Text>
        </View>
        <View style={styles.benefitCard}>
          <ReportIcon width={32} height={32} />
          <Text style={styles.benefitTitle}>Прозрачные отчёты</Text>
          <Text style={styles.benefitText}>Фото и видеоотчёт с понятными рекомендациями.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

