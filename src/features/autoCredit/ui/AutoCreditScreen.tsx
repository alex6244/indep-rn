import Slider from "@react-native-community/slider";
import { useRouter } from "expo-router";
import React, { useCallback, useMemo, useRef, useState } from "react";
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
import { colors } from "../../../shared/theme/colors";
import { acText, acTitle } from "./autoCredit.styles";
import { radius } from "../../../shared/theme/radius";
import { spacing } from "../../../shared/theme/spacing";
import { AppButton } from "../../../shared/ui/AppButton";
import { AppCard } from "../../../shared/ui/AppCard";
import {
  adjustTermMonths,
  calcLoanPrincipal,
  calcMonthlyPayment,
  canAdjustTermMonths,
  clampDownPayment,
  clampTermMonths,
  formatRub,
  formatTermMonths,
  snapCreditStep,
} from "../lib/autoCreditCalculations";
import { AutoCreditBanksStrip } from "./AutoCreditBanksStrip";
import { AutoCreditContactForm } from "./AutoCreditContactForm";
import { AutoCreditOfferCard } from "./AutoCreditOfferCard";
import { AutoCreditPercentChips } from "./AutoCreditPercentChips";
import {
  AUTO_CREDIT_BANKS,
  AUTO_CREDIT_WHY_US,
  CREDIT_AMOUNT_MAX,
  CREDIT_AMOUNT_MIN,
  CREDIT_AMOUNT_STEP,
  CREDIT_TERM_MONTHS_MAX,
  CREDIT_TERM_MONTHS_MIN,
  CREDIT_TERM_MONTH_PRESETS,
  DEFAULT_CREDIT_AMOUNT,
  DEFAULT_DOWN_PAYMENT,
  DEFAULT_TERM_MONTHS,
} from "./autoCredit.content";

function formatAmountShort(value: number): string {
  if (value >= 1_000_000) {
    const millions = value / 1_000_000;
    return Number.isInteger(millions) ? `${millions} млн` : `${millions.toFixed(1)} млн`;
  }
  return `${Math.round(value / 1000)} тыс.`;
}

export function AutoCreditScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [creditAmount, setCreditAmount] = useState(DEFAULT_CREDIT_AMOUNT);
  const [downPayment, setDownPayment] = useState(DEFAULT_DOWN_PAYMENT);
  const [termMonths, setTermMonths] = useState(DEFAULT_TERM_MONTHS);

  const loanPrincipal = useMemo(
    () => calcLoanPrincipal(creditAmount, downPayment),
    [creditAmount, downPayment],
  );
  const monthlyPayment = useMemo(
    () => calcMonthlyPayment(loanPrincipal, termMonths),
    [loanPrincipal, termMonths],
  );

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleSubmit = useCallback(async (_payload: { name: string; phone: string }) => {
    await new Promise((resolve) => {
      setTimeout(resolve, 500);
    });
  }, []);

  const handleCreditAmountChange = useCallback((value: number) => {
    const snapped = snapCreditStep(value, CREDIT_AMOUNT_STEP, CREDIT_AMOUNT_MIN, CREDIT_AMOUNT_MAX);
    setCreditAmount(snapped);
    setDownPayment((prev) => clampDownPayment(prev, snapped));
  }, []);

  const handleDownPaymentChange = useCallback(
    (value: number) => {
      const snapped = snapCreditStep(value, CREDIT_AMOUNT_STEP, 0, creditAmount);
      setDownPayment(clampDownPayment(snapped, creditAmount));
    },
    [creditAmount],
  );

  const handleDecreaseTerm = useCallback(() => {
    setTermMonths((current) => adjustTermMonths(current, -1));
  }, []);

  const handleIncreaseTerm = useCallback(() => {
    setTermMonths((current) => adjustTermMonths(current, 1));
  }, []);

  const handleTermMonthsChange = useCallback((value: number) => {
    setTermMonths(clampTermMonths(value));
  }, []);

  const scrollRef = useRef<ScrollView>(null);
  const formSectionY = useRef(0);

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

          <Text style={styles.sectionLabel}>Сумма кредита</Text>
          <Text style={styles.sectionValue}>{formatRub(creditAmount)}</Text>
          <Slider
            style={styles.slider}
            minimumValue={CREDIT_AMOUNT_MIN}
            maximumValue={CREDIT_AMOUNT_MAX}
            step={CREDIT_AMOUNT_STEP}
            value={creditAmount}
            minimumTrackTintColor={colors.brand.primary}
            maximumTrackTintColor={colors.icon.placeholder}
            thumbTintColor={colors.brand.primary}
            onValueChange={handleCreditAmountChange}
            accessibilityLabel="Сумма кредита"
          />
          <View style={styles.sliderRange}>
            <Text style={styles.sliderRangeText}>{formatAmountShort(CREDIT_AMOUNT_MIN)}</Text>
            <Text style={styles.sliderRangeText}>{formatAmountShort(CREDIT_AMOUNT_MAX)}</Text>
          </View>

          <Text style={[styles.sectionLabel, styles.sectionLabelSpaced]}>
            Первоначальный взнос
          </Text>
          <Text style={styles.sectionValue}>{formatRub(downPayment)}</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={creditAmount}
            step={CREDIT_AMOUNT_STEP}
            value={downPayment}
            minimumTrackTintColor={colors.brand.primary}
            maximumTrackTintColor={colors.icon.placeholder}
            thumbTintColor={colors.brand.primary}
            onValueChange={handleDownPaymentChange}
            accessibilityLabel="Первоначальный взнос"
          />
          <View style={styles.sliderRange}>
            <Text style={styles.sliderRangeText}>0 ₽</Text>
            <Text style={styles.sliderRangeText}>{formatRub(creditAmount)}</Text>
          </View>

          <Text style={[styles.sectionLabel, styles.sectionLabelSpaced]}>Срок кредита</Text>
          <Text style={styles.sectionValue}>{formatTermMonths(termMonths)}</Text>
          <Slider
            style={styles.slider}
            minimumValue={CREDIT_TERM_MONTHS_MIN}
            maximumValue={CREDIT_TERM_MONTHS_MAX}
            step={1}
            value={termMonths}
            minimumTrackTintColor={colors.brand.primary}
            maximumTrackTintColor={colors.icon.placeholder}
            thumbTintColor={colors.brand.primary}
            onValueChange={handleTermMonthsChange}
            accessibilityLabel="Срок кредита"
          />
          <View style={styles.sliderRange}>
            <Text style={styles.sliderRangeText}>{formatTermMonths(CREDIT_TERM_MONTHS_MIN)}</Text>
            <Text style={styles.sliderRangeText}>{formatTermMonths(CREDIT_TERM_MONTHS_MAX)}</Text>
          </View>
          <AutoCreditPercentChips
            values={CREDIT_TERM_MONTH_PRESETS}
            selected={termMonths}
            onSelect={handleTermMonthsChange}
            formatLabel={(months) => `${months}`}
            getAccessibilityLabel={(months) => `${months} месяцев`}
          />

          <AutoCreditOfferCard
            monthlyPayment={monthlyPayment}
            termMonths={termMonths}
            canDecreaseTerm={canAdjustTermMonths(termMonths, -1)}
            canIncreaseTerm={canAdjustTermMonths(termMonths, 1)}
            onDecreaseTerm={handleDecreaseTerm}
            onIncreaseTerm={handleIncreaseTerm}
            onGetOffer={scrollToForm}
          />

          <AutoCreditBanksStrip banks={AUTO_CREDIT_BANKS} />

          <View
            style={styles.formSection}
            onLayout={(event) => {
              formSectionY.current = event.nativeEvent.layout.y;
            }}
          >
            <AutoCreditContactForm onSubmit={handleSubmit} />
          </View>

          <View style={styles.whySection}>
            <Text style={styles.whyTitle}>Почему мы?</Text>
            {AUTO_CREDIT_WHY_US.map((item) => (
              <AppCard key={item.id} style={styles.whyCard} muted padded>
                <Text style={styles.whyCardTitle}>{item.title}</Text>
                <Text style={styles.whyCardText}>{item.text}</Text>
              </AppCard>
            ))}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={[styles.stickyBar, { paddingBottom: stickyBarPadding }]}>
        <View style={styles.stickyTextWrap}>
          <Text style={styles.stickyLabel}>Платёж</Text>
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
    ...acTitle,
    fontSize: 17,
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
    color: colors.brand.primary,
  },
  pageTitle: {
    ...acTitle,
    fontSize: 26,
    lineHeight: 30,
    color: colors.text.primary,
    marginBottom: spacing.xl,
  },
  sectionLabel: {
    ...acTitle,
    fontSize: 16,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  sectionLabelSpaced: {
    marginTop: spacing.md,
  },
  sectionValue: {
    ...acText,
    fontSize: 18,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  slider: {
    width: "100%",
    minHeight: 40,
    marginBottom: spacing.xs,
  },
  sliderRange: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },
  sliderRangeText: {
    ...acText,
    fontSize: 12,
    color: colors.text.muted,
  },
  formSection: {
    marginBottom: spacing.xxl,
    zIndex: 0,
  },
  whySection: {
    paddingTop: spacing.md,
    zIndex: 1,
  },
  whyTitle: {
    ...acTitle,
    fontSize: 22,
    lineHeight: 30,
    color: colors.text.primary,
    marginBottom: spacing.md,
    includeFontPadding: false,
  },
  whyCard: {
    marginBottom: spacing.md,
  },
  whyCardTitle: {
    ...acTitle,
    fontSize: 15,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  whyCardText: {
    ...acText,
    fontSize: 14,
    lineHeight: 20,
    color: colors.text.secondary,
  },
});
