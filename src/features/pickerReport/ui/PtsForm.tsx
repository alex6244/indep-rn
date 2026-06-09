import React, { useCallback, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DropdownIcon from "../../../assets/icons/dropdown.svg";
import { colors } from "../../../shared/theme/colors";
import {
  formatEngineVolumeInput,
  formatVinInput,
  validateEngineVolume,
  validateVin,
  validateYear,
} from "../../../shared/validation/ptsValidation";
import { YearBottomSheet } from "./YearBottomSheet";
import { PR_TYPO } from "./pickerReport.styles";

export type PtsType = "original" | "nonOriginal";

export type PtsFormState = {
  vin: string;
  brand: string;
  model: string;
  year: string;
  color: string;
  engineVolume: string;
  ptsType: PtsType;
  hasElectronicPts: boolean;
};

type PtsFieldErrors = {
  vin?: string;
  year?: string;
  engineVolume?: string;
};

type Props = {
  value: PtsFormState;
  onChange: (next: PtsFormState) => void;
};

function Radio({
  checked,
  label,
  onPress,
}: {
  checked: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={styles.radioRowItem}>
      <View
        style={[
          styles.radioOuter,
          checked ? { borderColor: colors.brand.primary } : { borderColor: colors.text.tertiary },
        ]}
      >
        {checked ? <View style={styles.radioInner} /> : null}
      </View>
      <Text style={checked ? styles.radioLabelActive : styles.radioLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

export function PtsForm({ value, onChange }: Props) {
  const [fieldErrors, setFieldErrors] = useState<PtsFieldErrors>({});
  const [yearSheetVisible, setYearSheetVisible] = useState(false);

  const clearFieldError = useCallback((field: keyof PtsFieldErrors) => {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const setFieldError = useCallback((field: keyof PtsFieldErrors, message: string | undefined) => {
    setFieldErrors((prev) => {
      if (!message) {
        if (!prev[field]) return prev;
        const next = { ...prev };
        delete next[field];
        return next;
      }
      return { ...prev, [field]: message };
    });
  }, []);

  const handleVinBlur = useCallback(() => {
    const result = validateVin(value.vin);
    setFieldError("vin", result.ok ? undefined : result.message);
  }, [setFieldError, value.vin]);

  const handleEngineBlur = useCallback(() => {
    const result = validateEngineVolume(value.engineVolume);
    setFieldError("engineVolume", result.ok ? undefined : result.message);
  }, [setFieldError, value.engineVolume]);

  const yearLabel = value.year.trim() || "Укажите год выпуска";

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Заполните данные из ПТС</Text>

      <View style={styles.field}>
        <Text style={styles.label}>VIN</Text>
        <TextInput
          style={[styles.input, fieldErrors.vin ? styles.inputError : null]}
          value={value.vin}
          onChangeText={(t) => {
            clearFieldError("vin");
            onChange({ ...value, vin: formatVinInput(t) });
          }}
          onBlur={handleVinBlur}
          placeholder="Введите VIN"
          placeholderTextColor={colors.text.muted}
          autoCapitalize="characters"
          autoCorrect={false}
          maxLength={20}
        />
        {fieldErrors.vin ? <Text style={styles.errorText}>{fieldErrors.vin}</Text> : null}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Марка</Text>
        <TextInput
          style={styles.input}
          value={value.brand}
          onChangeText={(t) => onChange({ ...value, brand: t })}
          placeholder="Укажите марку"
          placeholderTextColor={colors.text.muted}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Модель</Text>
        <TextInput
          style={styles.input}
          value={value.model}
          onChangeText={(t) => onChange({ ...value, model: t })}
          placeholder="Укажите модель"
          placeholderTextColor={colors.text.muted}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Год выпуска</Text>
        <Pressable
          onPress={() => setYearSheetVisible(true)}
          accessibilityRole="button"
          accessibilityLabel={`Год выпуска: ${yearLabel}`}
        >
          <View style={styles.dropdownWrap} pointerEvents="none">
            <TextInput
              style={[
                styles.dropdownInput,
                fieldErrors.year ? styles.inputError : null,
                !value.year.trim() && styles.dropdownPlaceholder,
              ]}
              value={value.year}
              placeholder="Укажите год выпуска"
              placeholderTextColor={colors.text.muted}
              editable={false}
            />
            <View style={styles.dropdownIconWrap}>
              <DropdownIcon width={14} height={14} />
            </View>
          </View>
        </Pressable>
        {fieldErrors.year ? <Text style={styles.errorText}>{fieldErrors.year}</Text> : null}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Цвет</Text>
        <View style={styles.dropdownWrap}>
          <TextInput
            style={styles.dropdownInput}
            value={value.color}
            onChangeText={(t) => onChange({ ...value, color: t })}
            placeholder="Укажите цвет"
            placeholderTextColor={colors.text.muted}
          />
          <View style={styles.dropdownIconWrap}>
            <DropdownIcon width={14} height={14} />
          </View>
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Объём двигателя</Text>
        <TextInput
          style={[styles.input, fieldErrors.engineVolume ? styles.inputError : null]}
          value={value.engineVolume}
          onChangeText={(t) => {
            clearFieldError("engineVolume");
            onChange({ ...value, engineVolume: formatEngineVolumeInput(t) });
          }}
          onBlur={handleEngineBlur}
          placeholder="1.6"
          placeholderTextColor={colors.text.muted}
          keyboardType="decimal-pad"
          maxLength={3}
        />
        {fieldErrors.engineVolume ? (
          <Text style={styles.errorText}>{fieldErrors.engineVolume}</Text>
        ) : null}
      </View>

      <View style={styles.radioGroup}>
        <Text style={styles.label}>ПТС</Text>
        <View style={styles.radioRow}>
          <Radio
            checked={value.ptsType === "original"}
            label="Оригинал"
            onPress={() => onChange({ ...value, ptsType: "original" })}
          />
          <Radio
            checked={value.ptsType === "nonOriginal"}
            label="Дубликат"
            onPress={() => onChange({ ...value, ptsType: "nonOriginal" })}
          />
        </View>
      </View>

      <View style={styles.radioGroup}>
        <Text style={styles.label}>Электронный ПТС</Text>
        <View style={styles.radioRow}>
          <Radio
            checked={value.hasElectronicPts === true}
            label="Есть"
            onPress={() => onChange({ ...value, hasElectronicPts: true })}
          />
          <Radio
            checked={value.hasElectronicPts === false}
            label="Нет"
            onPress={() => onChange({ ...value, hasElectronicPts: false })}
          />
        </View>
      </View>

      <YearBottomSheet
        visible={yearSheetVisible}
        yearText={value.year}
        onApply={(year) => {
          clearFieldError("year");
          const yearResult = validateYear(year);
          if (!yearResult.ok) {
            setFieldError("year", yearResult.message);
            return;
          }
          onChange({ ...value, year: yearResult.normalized });
        }}
        onReset={() => {
          clearFieldError("year");
          onChange({ ...value, year: "" });
        }}
        onClose={() => setYearSheetVisible(false)}
      />
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
  field: {
    marginBottom: 12,
  },
  label: {
    ...PR_TYPO.fieldLabel,
    marginBottom: 6,
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
  dropdownWrap: {
    position: "relative",
  },
  dropdownInput: {
    ...PR_TYPO.input,
    height: 46,
    borderRadius: 10,
    backgroundColor: colors.surface.neutral,
    paddingHorizontal: 14,
    paddingRight: 32,
    color: colors.text.primary,
  },
  dropdownPlaceholder: {
    color: colors.text.muted,
  },
  dropdownIconWrap: {
    position: "absolute",
    right: 12,
    top: 16,
    opacity: 0.7,
  },
  radioGroup: {
    marginTop: 12,
    marginBottom: 4,
  },
  radioRow: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "flex-start",
  },
  radioRowItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 999,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: colors.brand.primary,
  },
  radioLabel: PR_TYPO.radio,
  radioLabelActive: PR_TYPO.radioActive,
});
