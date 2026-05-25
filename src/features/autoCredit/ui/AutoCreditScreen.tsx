import Slider from "@react-native-community/slider";
import { useLocalSearchParams, useRouter, type Href } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BackCaretIcon from "../../../assets/icons/backCaret.svg";
import { cars as mockCars } from "../../../data/cars";
import { colors } from "../../../shared/theme/colors";
import { acText } from "./autoCredit.styles";
import { radius } from "../../../shared/theme/radius";
import { spacing } from "../../../shared/theme/spacing";
import { AppButton } from "../../../shared/ui/AppButton";
import { AppCard } from "../../../shared/ui/AppCard";
import {
  calcDownPayment,
  calcLoanAmount,
  calcMonthlyPayment,
  formatRub,
  formatTermYears,
} from "../lib/autoCreditCalculations";
import { mapCarToCreditVehicle } from "../lib/mapCarToCreditVehicle";
import { AutoCreditBanksStrip } from "./AutoCreditBanksStrip";
import { AutoCreditCarSummaryCard } from "./AutoCreditCarSummaryCard";
import { AutoCreditContactForm } from "./AutoCreditContactForm";
import { AutoCreditPercentChips } from "./AutoCreditPercentChips";
import {
  AUTO_CREDIT_BANKS,
  AUTO_CREDIT_WHY_US,
  CREDIT_TERM_YEARS,
  DEFAULT_DOWN_PAYMENT_PERCENT,
  DEFAULT_TERM_YEARS,
  DOWN_PAYMENT_PERCENTS,
  type AutoCreditVehicle,
} from "./autoCredit.content";

export function AutoCreditScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ carId?: string | string[] }>();
  const rawCarId = params.carId;
  const carId = Array.isArray(rawCarId) ? rawCarId[0] : rawCarId;

  const [vehicle, setVehicle] = useState<AutoCreditVehicle>(() =>
    mapCarToCreditVehicle(mockCars[0]),
  );
  const [downPaymentPercent, setDownPaymentPercent] = useState(
    DEFAULT_DOWN_PAYMENT_PERCENT,
  );
  const [termYears, setTermYears] = useState(DEFAULT_TERM_YEARS);

  useEffect(() => {
    if (!carId) return;
    const fromCatalog = mockCars.find((car) => String(car.id) === carId);
    if (fromCatalog) {
      setVehicle(mapCarToCreditVehicle(fromCatalog));
    }
  }, [carId]);

  const downPayment = useMemo(
    () => calcDownPayment(vehicle.price, downPaymentPercent),
    [vehicle.price, downPaymentPercent],
  );
  const loanAmount = useMemo(
    () => calcLoanAmount(vehicle.price, downPaymentPercent),
    [vehicle.price, downPaymentPercent],
  );
  const monthlyPayment = useMemo(
    () => calcMonthlyPayment(loanAmount, termYears),
    [loanAmount, termYears],
  );
  const monthlyFrom = useMemo(() => {
    const maxTerm = CREDIT_TERM_YEARS[CREDIT_TERM_YEARS.length - 1];
    const minDownPercent = DOWN_PAYMENT_PERCENTS[0];
    const minLoan = calcLoanAmount(vehicle.price, minDownPercent);
    return calcMonthlyPayment(minLoan, maxTerm);
  }, [vehicle.price]);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleOpenCatalog = useCallback(() => {
    router.push("/(tabs)/catalog" as Href);
  }, [router]);

  const handleSubmit = useCallback(
    async (_payload: { name: string; phone: string }) => {
      await new Promise((resolve) => {
        setTimeout(resolve, 500);
      });
    },
    [],
  );

  const snapDownPaymentPercent = useCallback((value: number) => {
    const snapped = DOWN_PAYMENT_PERCENTS.reduce((prev, curr) =>
      Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev,
    );
    setDownPaymentPercent(snapped);
  }, []);

  const snapTermYears = useCallback((value: number) => {
    const snapped = CREDIT_TERM_YEARS.reduce((prev, curr) =>
      Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev,
    );
    setTermYears(snapped);
  }, []);

  const scrollRef = React.useRef<ScrollView>(null);
  const formSectionY = React.useRef(0);

  const scrollToForm = useCallback(() => {
    scrollRef.current?.scrollTo({ y: Math.max(0, formSectionY.current - spacing.lg), animated: true });
  }, []);

  const stickyBarPadding = insets.bottom + spacing.sm;

  return (
    <View style={styles.screen}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={insets.top}
      >
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingTop: insets.top + spacing.sm,
              paddingBottom: stickyBarPadding + 72,
            },
          ]}
          keyboardShouldPersistTaps="handled"
        >
        <Pressable
          style={styles.backRow}
          onPress={handleBack}
          accessibilityRole="button"
          accessibilityLabel="Назад"
        >
          <BackCaretIcon width={18} height={18} />
          <Text style={styles.backLabel}>Назад</Text>
        </Pressable>

        <Text style={styles.pageTitle}>Подбор выгодного автокредита</Text>

        <Text style={styles.sectionLabel}>Выберите автомобиль</Text>
        <Pressable
          style={styles.carPicker}
          onPress={handleOpenCatalog}
          accessibilityRole="button"
          accessibilityLabel="Выберите автомобиль из каталога"
        >
          <View style={styles.carPickerText}>
            <Text style={styles.carPickerTitle}>{vehicle.title}</Text>
            <Text style={styles.carPickerSubtitle}>
              {vehicle.brand} {vehicle.model} · {vehicle.year} г.
            </Text>
          </View>
          <Text style={styles.carPickerAction}>Изменить</Text>
        </Pressable>

        <Text style={styles.sectionLabel}>Первоначальный взнос</Text>
        <Text style={styles.sectionValue}>
          {formatRub(downPayment)} ({downPaymentPercent}%)
        </Text>
        <Slider
          style={styles.slider}
          minimumValue={DOWN_PAYMENT_PERCENTS[0]}
          maximumValue={DOWN_PAYMENT_PERCENTS[DOWN_PAYMENT_PERCENTS.length - 1]}
          step={10}
          value={downPaymentPercent}
          minimumTrackTintColor={colors.brand.primary}
          maximumTrackTintColor={colors.icon.placeholder}
          thumbTintColor={colors.brand.primary}
          onValueChange={snapDownPaymentPercent}
          accessibilityLabel="Первоначальный взнос"
        />
        <AutoCreditPercentChips
          values={DOWN_PAYMENT_PERCENTS}
          selected={downPaymentPercent}
          onSelect={setDownPaymentPercent}
        />

        <Text style={[styles.sectionLabel, styles.sectionLabelSpaced]}>
          Срок кредита
        </Text>
        <Text style={styles.sectionValue}>{formatTermYears(termYears)}</Text>
        <Slider
          style={styles.slider}
          minimumValue={CREDIT_TERM_YEARS[0]}
          maximumValue={CREDIT_TERM_YEARS[CREDIT_TERM_YEARS.length - 1]}
          step={1}
          value={termYears}
          minimumTrackTintColor={colors.brand.primary}
          maximumTrackTintColor={colors.icon.placeholder}
          thumbTintColor={colors.brand.primary}
          onValueChange={snapTermYears}
          accessibilityLabel="Срок кредита"
        />
        <View style={styles.termChipsWrap}>
          <AutoCreditPercentChips
            values={CREDIT_TERM_YEARS}
            selected={termYears}
            onSelect={setTermYears}
            formatLabel={formatTermYears}
            getAccessibilityLabel={formatTermYears}
          />
        </View>

        <AutoCreditBanksStrip banks={AUTO_CREDIT_BANKS} />

        <AutoCreditCarSummaryCard
          vehicle={vehicle}
          monthlyFrom={monthlyFrom}
          downPayment={downPayment}
          termYears={termYears}
          monthlyPayment={monthlyPayment}
        />

        <View
          onLayout={(event) => {
            formSectionY.current = event.nativeEvent.layout.y;
          }}
        >
          <AutoCreditContactForm onSubmit={handleSubmit} />
        </View>

        <Text style={styles.whyTitle}>Почему мы?</Text>
        {AUTO_CREDIT_WHY_US.map((item) => (
          <AppCard key={item.id} style={styles.whyCard} muted padded>
            <Text style={styles.whyCardTitle}>{item.title}</Text>
            <Text style={styles.whyCardText}>{item.text}</Text>
          </AppCard>
        ))}
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={[styles.stickyBar, { paddingBottom: stickyBarPadding }]}>
        <View style={styles.stickyTextWrap}>
          <Text style={styles.stickyLabel}>Платёж от</Text>
          <Text style={styles.stickyAmount}>{formatRub(monthlyPayment)} / мес</Text>
        </View>
        <AppButton label="Оставить заявку" onPress={scrollToForm} style={styles.stickyBtn} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surface.neutral,
  },
  flex: {
    flex: 1,
  },
  stickyBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border.subtle,
    backgroundColor: colors.surface.primary,
  },
  stickyTextWrap: {
    flex: 1,
    minWidth: 0,
  },
  stickyLabel: {
    ...acText,
    fontSize: 12,
    color: colors.text.muted,
  },
  stickyAmount: {
    ...acText,
    fontSize: 17,
    fontWeight: "700",
    color: colors.text.primary,
  },
  stickyBtn: {
    minWidth: 148,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
  },
  backRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    minHeight: 44,
    marginBottom: spacing.md,
  },
  backLabel: {
    ...acText,
    fontSize: 16,
    fontWeight: "600",
    color: colors.brand.primary,
  },
  pageTitle: {
    ...acText,
    fontSize: 26,
    lineHeight: 30,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: spacing.xl,
  },
  sectionLabel: {
    ...acText,
    fontSize: 16,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  sectionLabelSpaced: {
    marginTop: spacing.md,
  },
  sectionValue: {
    ...acText,
    fontSize: 18,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  carPicker: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surface.primary,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  carPickerText: {
    flex: 1,
  },
  carPickerTitle: {
    ...acText,
    fontSize: 16,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 4,
  },
  carPickerSubtitle: {
    ...acText,
    fontSize: 13,
    color: colors.text.secondary,
  },
  carPickerAction: {
    ...acText,
    fontSize: 14,
    fontWeight: "600",
    color: colors.brand.primary,
  },
  slider: {
    width: "100%",
    minHeight: 40,
    marginBottom: spacing.xs,
  },
  termChipsWrap: {
    marginBottom: spacing.lg,
  },
  whyTitle: {
    ...acText,
    fontSize: 22,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  whyCard: {
    marginBottom: spacing.md,
  },
  whyCardTitle: {
    ...acText,
    fontSize: 15,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  whyCardText: {
    ...acText,
    fontSize: 14,
    lineHeight: 20,
    color: colors.text.secondary,
  },
  disclaimer: {
    ...acText,
    fontSize: 12,
    lineHeight: 17,
    color: colors.text.muted,
    marginTop: spacing.sm,
  },
});
