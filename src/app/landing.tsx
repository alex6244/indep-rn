import { type Href, useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Logo from "../assets/logo.svg";
import { useProtected } from "../hooks/useProtected";
import { InlineMessage } from "../shared/ui/InlineMessage";
import { landingStyles } from "../shared/styles/landing.styles";
import { LandingBenefitsSection } from "../widgets/home/landing/LandingBenefitsSection";
import { LandingHeroSection } from "../widgets/home/landing/LandingHeroSection";
import { LandingPricingSection } from "../widgets/home/landing/LandingPricingSection";
import { LandingStepsSection } from "../widgets/home/landing/LandingStepsSection";

/** Legacy full-page marketing layout (formerly root `/`). Open via `/landing`. */
export default function LandingPage() {
  const router = useRouter();
  const { user, checkAuth } = useProtected();
  const [infoMessage, setInfoMessage] = React.useState<string | null>(null);

  return (
    <View style={landingStyles.screen}>
      {/* HEADER */}
      <View style={landingStyles.header}>
        <View style={landingStyles.headerLeft}>
          <Logo width={120} height={32} />
          <View style={landingStyles.searchContainer}>
            <Text style={landingStyles.searchPlaceholder}>Поиск по объявлениям</Text>
          </View>
        </View>

        <View style={landingStyles.headerRight}>
          <TouchableOpacity
            style={landingStyles.iconButton}
            onPress={() => router.push("/(tabs)/catalog" as Href)}
          >
            <Text style={landingStyles.headerLink}>Каталог</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={landingStyles.iconButton}
            onPress={() => router.push("/selection" as Href)}
          >
            <Text style={landingStyles.headerLink}>Подбор авто</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={landingStyles.iconButton}
            onPress={() => {
              if (!user) {
                router.push("/(auth)" as Href);
                return;
              }
              router.push("/(tabs)/profile" as Href);
            }}
          >
            <Text style={landingStyles.headerLink}>{user ? "Профиль" : "Войти"}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={landingStyles.scrollContent}>
        {infoMessage ? (
          <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
            <InlineMessage tone="info" message={infoMessage} />
          </View>
        ) : null}
        <LandingHeroSection
          styles={landingStyles}
          onOpenCatalog={() => router.push("/(tabs)/catalog" as Href)}
        />
        <LandingBenefitsSection styles={landingStyles} />
        <LandingStepsSection styles={landingStyles} />
        <LandingPricingSection
          styles={landingStyles}
          onOpenAuto={() => router.push("/auto/1" as Href)}
          onOpenCatalog={() => router.push("/(tabs)/catalog" as Href)}
          onBuyReport={() => {
            if (!checkAuth()) return;
            setInfoMessage("Оплата и выдача отчёта появятся позже.");
          }}
        />

        {/* Дальше можно адаптировать блоки "Что проверяют подборщики",
            "Как выглядит результат подбора", "Стоимость услуг" и т.д.
            — по тому же принципу: View + Text + Image + ScrollView */}
      </ScrollView>
    </View>
  );
}
