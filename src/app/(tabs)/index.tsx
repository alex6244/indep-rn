import { BurgerMenu } from "@/src/shared/ui/BurgerMenu";
import {
  getMainBurgerMenuItems,
  MainBurgerMenuFooter,
} from "@/src/shared/config/mainBurgerMenu";
import { useRouter, type Href } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { BenefitsRow } from "../../widgets/home/BenefitsRow";
import { BestOffersSection } from "../../widgets/home/BestOffersSection";
import { ChecksGridSection } from "../../widgets/home/ChecksGridSection";
import { HowItWorksSection } from "../../widgets/home/HowItWorksSection";
import { PickedCarsSection } from "../../widgets/home/PickedCarsSection";
import { PickerOnboardingSection } from "../../widgets/home/PickerOnboardingSection";
import { PricingSection } from "../../widgets/home/PricingSection";
import { RoleToggle } from "../../widgets/home/RoleToggle";
import { WelcomeHero } from "../../widgets/home/WelcomeHero";

export default function HomeTab() {
  const router = useRouter();
  const { logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [roleView, setRoleView] = useState<"picker" | "client">("client");

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <WelcomeHero
          onOpenBurger={() => setMenuOpen(true)}
          onOpenCatalog={() => router.push("/(tabs)/catalog" as Href)}
        />
        {roleView === "picker" ? (
          <>
            <BenefitsRow />
            <RoleToggle value={roleView} onChange={setRoleView} />
            <PickerOnboardingSection
              onPressRegister={() => router.push("/(auth)/register" as Href)}
            />
          </>
        ) : (
          <>
            <BenefitsRow />
            <RoleToggle value={roleView} onChange={setRoleView} />
            <HowItWorksSection />
            <TouchableOpacity
              style={styles.catalogCtaButton}
              onPress={() => router.push("/(tabs)/catalog" as Href)}
              accessibilityRole="button"
            >
              <Text style={styles.catalogCtaText}>Перейти в каталог авто</Text>
            </TouchableOpacity>
            <ChecksGridSection />
            <PickedCarsSection />
            <PricingSection />
            <BestOffersSection />
          </>
        )}
      </ScrollView>

      <BurgerMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        items={getMainBurgerMenuItems()}
        footer={<MainBurgerMenuFooter onLogout={logout} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 30,
  },
  catalogCtaButton: {
    marginTop: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#DB4431",
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  catalogCtaText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
  },
});
