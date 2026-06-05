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
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Logo from "../../assets/logo.svg";
import { useAuth } from "../../contexts/AuthContext";
import { scrollBottomPaddingBelowTabBar } from "../../shared/navigation/tabBarMetrics";
import { colors } from "../../shared/theme/colors";
import { spacing } from "../../shared/theme/spacing";
import { AppButton } from "../../shared/ui/AppButton";
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
import { ReportsPackageSelectModal } from "../../widgets/reports/ReportsPackageSelectModal";
import { useReportsPackagePurchaseModal } from "../../widgets/reports/useReportsPackagePurchaseModal";

export default function HomeTab() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const reportsPackageModal = useReportsPackagePurchaseModal();
  const [roleView, setRoleView] = useState<UserRole>(
    user?.role === "picker" ? "picker" : "client",
  );

  React.useEffect(() => {
    setRoleView(user?.role === "picker" ? "picker" : "client");
  }, [user?.role]);

  const contentPadBottom = scrollBottomPaddingBelowTabBar(insets.bottom);

  return (
    <View style={styles.screen}>
      <View testID="home-top-bar" style={[styles.topBar, { paddingTop: insets.top + 6 }]}>
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
        <BenefitsRow />
        <RoleToggle value={roleView} onChange={setRoleView} />
        {roleView === "picker" ? (
          <PickerOnboardingSection
            onPressRegister={() => router.push("/(auth)/register" as Href)}
          />
        ) : (
          <>
            <HowItWorksSection />
            <AppButton
              label="Перейти в каталог авто"
              onPress={() => router.push("/(tabs)/catalog" as Href)}
              style={styles.catalogCtaButton}
            />
            <ChecksGridSection />
            <PickedCarsSection />
            <PricingSection />
            <BestOffersSection onBuyReport={reportsPackageModal.open} />
          </>
        )}

      </ScrollView>

      <BurgerMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        items={getMainBurgerMenuItems(user?.role)}
        footer={<MainBurgerMenuFooter onLogout={logout} />}
      />

      <ReportsPackageSelectModal
        visible={reportsPackageModal.visible}
        onClose={reportsPackageModal.close}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surface.primary,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  topBar: {
    backgroundColor: colors.surface.primary,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  catalogCtaButton: {
    marginTop: spacing.lg,
  },
});
