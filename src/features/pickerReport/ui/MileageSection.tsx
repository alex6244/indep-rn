import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { colors } from "../../../shared/theme/colors";
import {
  formatMileageInput,
  validateMileage,
} from "../../../shared/validation/mileageValidation";
import { PR_TYPO } from "./pickerReport.styles";

type Props = {
  value: string;
  onChange: (next: string) => void;
  externalError?: string;
  submitAttempt?: number;
};

export function MileageSection({
  value,
  onChange,
  externalError,
  submitAttempt = 0,
}: Props) {
  const [fieldError, setFieldError] = useState<string | undefined>();

  useEffect(() => {
    if (externalError) {
      setFieldError(externalError);
    }
  }, [externalError, submitAttempt]);

  const handleBlur = useCallback(() => {
    const result = validateMileage(value);
    setFieldError(result.ok ? undefined : result.message);
  }, [value]);

  const displayError = fieldError ?? externalError;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Заполните пробег</Text>

      <View style={styles.field}>
        <Text style={styles.label}>Пробег авто</Text>
        <TextInput
          style={[styles.input, displayError ? styles.inputError : null]}
          value={value}
          onChangeText={(text) => {
            setFieldError(undefined);
            onChange(formatMileageInput(text));
          }}
          onBlur={handleBlur}
          placeholder="000 000"
          keyboardType="number-pad"
          placeholderTextColor={colors.text.muted}
          maxLength={9}
        />
        {displayError ? <Text style={styles.errorText}>{displayError}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface.card,
    borderRadius: 18,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
  },
  title: {
    ...PR_TYPO.sectionTitle,
    marginBottom: 12,
  },
  field: {},
  label: {
    ...PR_TYPO.bodyMuted,
    marginBottom: 8,
  },
  input: {
    ...PR_TYPO.input,
    height: 46,
    borderRadius: 10,
    backgroundColor: colors.surface.neutral,
    paddingHorizontal: 14,
  },
  inputError: {
    borderWidth: 1,
    borderColor: colors.brand.primary,
  },
  errorText: {
    ...PR_TYPO.caption,
    color: colors.text.warning,
    marginTop: 6,
  },
});

