import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { AppButton } from "../../../shared/ui/AppButton";
import { colors } from "../../../shared/theme/colors";
import { acText, acTitle } from "./autoCredit.styles";
import { radius } from "../../../shared/theme/radius";
import { spacing } from "../../../shared/theme/spacing";
import { formatRub, formatTermMonths } from "../lib/autoCreditCalculations";
import { AUTO_CREDIT_DISCLAIMER } from "./autoCredit.content";

type Props = {
  monthlyPayment: number;
  termMonths: number;
  canDecreaseTerm: boolean;
  canIncreaseTerm: boolean;
  onDecreaseTerm: () => void;
  onIncreaseTerm: () => void;
  onGetOffer: () => void;
};

export function AutoCreditOfferCard({
  monthlyPayment,
  termMonths,
  canDecreaseTerm,
  canIncreaseTerm,
  onDecreaseTerm,
  onIncreaseTerm,
  onGetOffer,
}: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Наше предложение</Text>
      <Text style={styles.termHint}>Срок: {formatTermMonths(termMonths)}</Text>

      <View style={styles.paymentRow}>
        <Pressable
          style={[styles.stepBtn, !canDecreaseTerm && styles.stepBtnDisabled]}
          onPress={onDecreaseTerm}
          disabled={!canDecreaseTerm}
          accessibilityRole="button"
          accessibilityLabel="Уменьшить срок на 1 месяц"
        >
          <Text style={styles.stepBtnText}>−</Text>
        </Pressable>

        <Text style={styles.payment}>{formatRub(monthlyPayment)}</Text>

        <Pressable
          style={[styles.stepBtn, !canIncreaseTerm && styles.stepBtnDisabled]}
          onPress={onIncreaseTerm}
          disabled={!canIncreaseTerm}
          accessibilityRole="button"
          accessibilityLabel="Увеличить срок на 1 месяц"
        >
          <Text style={styles.stepBtnText}>+</Text>
        </Pressable>
      </View>

      <Text style={styles.disclaimer}>{AUTO_CREDIT_DISCLAIMER}</Text>

      <AppButton label="Получить предложение" onPress={onGetOffer} style={styles.cta} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface.inverse,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  title: {
    ...acTitle,
    fontSize: 18,
    color: colors.text.inverse,
    marginBottom: spacing.xs,
  },
  termHint: {
    ...acText,
    fontSize: 13,
    color: "rgba(255,255,255,0.65)",
    marginBottom: spacing.md,
  },
  paymentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  payment: {
    ...acTitle,
    fontSize: 32,
    lineHeight: 38,
    color: colors.text.inverse,
    minWidth: 160,
    textAlign: "center",
  },
  stepBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.brand.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  stepBtnDisabled: {
    opacity: 0.35,
  },
  stepBtnText: {
    ...acTitle,
    fontSize: 24,
    lineHeight: 28,
    color: colors.text.inverse,
  },
  disclaimer: {
    ...acText,
    fontSize: 11,
    lineHeight: 15,
    color: "rgba(255,255,255,0.55)",
    marginBottom: spacing.lg,
  },
  cta: {
    alignSelf: "stretch",
  },
});
