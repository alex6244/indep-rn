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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Logo from "../../assets/logo.svg";
import { useAuth } from "../../contexts/AuthContext";
import { scrollBottomPaddingBelowTabBar } from "../../shared/navigation/tabBarMetrics";
import { colors } from "../../shared/theme/colors";
import { BurgerButton } from "../../shared/ui/BurgerButton";
import type { UserRole } from "../../types/user";
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
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [roleView, setRoleView] = useState<UserRole>(
    user?.role === "picker" ? "picker" : "client",
  );

  React.useEffect(() => {
    setRoleView(user?.role === "picker" ? "picker" : "client");
  }, [user?.role]);

  const contentPadBottom = scrollBottomPaddingBelowTabBar(insets.bottom);

  return (
    <View style={styles.screen}>
      <View style={[styles.topBar, { paddingTop: insets.top + 6 }]}>
        <Logo width={82} height={22} />
        <BurgerButton onPress={() => setMenuOpen(true)} hitSlop={8} />
      </View>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: contentPadBottom }]}
      >
        <WelcomeHero
          showTopBar={false}
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
              accessibilityLabel="Перейти в каталог авто"
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
    backgroundColor: colors.surfacePrimary,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  topBar: {
    backgroundColor: colors.surfacePrimary,
    paddingHorizontal: 16,
    paddingBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  catalogCtaButton: {
    marginTop: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.brandPrimary,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  catalogCtaText: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.onDark,
  },
});
