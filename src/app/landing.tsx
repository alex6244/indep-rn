import { type Href, useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Logo from "../assets/logo.svg";
import { useProtected } from "../hooks/useProtected";
import { InlineMessage } from "../shared/ui/InlineMessage";
import { FONT_FAMILY } from "../shared/theme/fonts";
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
    <View style={styles.screen}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Logo width={120} height={32} />
          <View style={styles.searchContainer}>
            <Text style={styles.searchPlaceholder}>Поиск по объявлениям</Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.push("/(tabs)/catalog" as Href)}
          >
            <Text style={styles.headerLink}>Каталог</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.push("/selection" as Href)}
          >
            <Text style={styles.headerLink}>Подбор авто</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => {
              if (!user) {
                router.push("/(auth)" as Href);
                return;
              }
              router.push("/(tabs)/profile" as Href);
            }}
          >
            <Text style={styles.headerLink}>{user ? "Профиль" : "Войти"}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {infoMessage ? (
          <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
            <InlineMessage tone="info" message={infoMessage} />
          </View>
        ) : null}
        <LandingHeroSection styles={styles} onOpenCatalog={() => router.push("/(tabs)/catalog" as Href)} />
        <LandingBenefitsSection styles={styles} />
        <LandingStepsSection styles={styles} />
        <LandingPricingSection
          styles={styles}
          onOpenAuto={() => router.push("/auto/1" as Href)}
          onOpenCatalog={() => router.push("/(tabs)/catalog" as Href)}
          onBuyReport={() => {
            if (!checkAuth({ message: "Авторизуйтесь, чтобы купить отчёт по авто" })) return;
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

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    paddingTop: 16,
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#DEDEDE",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logo: {
    height: 32,
    width: 120,
  },
  searchContainer: {
    backgroundColor: "#F8F8F8",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  searchPlaceholder: {
    fontSize: 12,
    color: "#979797",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerLink: {
    fontSize: 14,
    color: "#080717",
    fontFamily: FONT_FAMILY.button,
  },
  iconButton: {
    paddingHorizontal: 4,
    paddingVertical: 2,
  },

  heroContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  heroBackground: {
    height: 320,
    borderRadius: 16,
    overflow: "hidden",
  },
  heroBackgroundImage: {
    borderRadius: 16,
  },
  heroOverlay: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  heroTitle: {
    fontSize: 28,
    color: "#FFFFFF",
    fontWeight: "600",
    marginBottom: 12,
  },
  heroTitleAccent: {
    color: "#DB4431",
  },
  heroSubtitle: {
    fontSize: 13,
    color: "#F5F5F5",
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: "#DB4431",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "500",
    fontSize: 14,
    fontFamily: FONT_FAMILY.button,
  },

  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
    color: "#1E1E1E",
  },

  horizontalCards: {
    gap: 12,
  },
  benefitCard: {
    width: 220,
    backgroundColor: "#F7F7F7",
    borderRadius: 12,
    padding: 12,
  },
  benefitIcon: {
    height: 32,
    width: 32,
    marginBottom: 8,
  },
  benefitTitle: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  benefitText: {
    fontSize: 11,
    color: "#555",
  },

  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#F7F7F7",
    padding: 4,
    borderRadius: 18,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: "center",
  },
  toggleButtonActive: {
    backgroundColor: "#080717",
  },
  toggleButtonText: {
    fontSize: 14,
    color: "#080717",
    fontFamily: FONT_FAMILY.button,
  },
  toggleButtonTextActive: {
    color: "#FFFFFF",
  },

  stepsGrid: {
    marginTop: 16,
    gap: 12,
  },
  stepCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#F5F5F5",
  },
  stepImage: {
    height: 120,
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    backgroundColor: "#F7F7F7",
  },
  stepNumber: {
    backgroundColor: "#F3E4E2",
    color: "#DB4431",
    width: 24,
    height: 24,
    borderRadius: 12,
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 12,
    marginBottom: 8,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  stepText: {
    fontSize: 11,
    color: "#555",
  },

  carsGrid: {
    marginTop: 12,
    gap: 16,
  },
  carCard: {
    backgroundColor: "#F7F7F7",
    borderRadius: 16,
    padding: 12,
  },
  carImagesRow: {
    gap: 8,
  },
  carImage: {
    height: 140,
    width: 200,
    borderRadius: 12,
  },
  carInfo: {
    marginTop: 8,
    gap: 4,
  },
  carPriceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  carPrice: {
    fontSize: 20,
    fontWeight: "600",
  },
  carMileage: {
    fontSize: 11,
    color: "#FFFFFF",
    backgroundColor: "#DB4431",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  carName: {
    fontSize: 13,
    fontWeight: "500",
    color: "#1E1E1E",
  },
  carDetails: {
    fontSize: 11,
    color: "#777",
  },
  carButtonsRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    marginTop: 8,
  },
  favButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#EFEFEF",
    alignItems: "center",
    justifyContent: "center",
  },
  carAddressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  carAddress: {
    fontSize: 10,
    color: "#555",
  },
});
