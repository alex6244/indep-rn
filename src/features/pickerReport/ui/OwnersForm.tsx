import React, { useCallback, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import OrangePlusIcon from "../../../assets/icons/orange-plus.svg";
import { colors } from "../../../shared/theme/colors";
import {
  DD_MM_YYYY_MAX_LENGTH,
  DD_MM_YYYY_PLACEHOLDER,
  formatDdMmYyyyInput,
  type OwnerDateField,
  validateOwnerDates,
} from "../../../shared/validation/formatDdMmYyyy";
import { PR_TYPO } from "./pickerReport.styles";

export type OwnerType = "jur" | "phys";

export type OwnerDraft = {
  id: string;
  type: OwnerType;
  startDate: string;
  endDate: string;
};

type OwnerFieldErrors = Partial<Record<OwnerDateField, string>>;

type Props = {
  value: OwnerDraft[];
  onChange: (next: OwnerDraft[]) => void;
};

function RadioOption({
  checked,
  label,
  onPress,
}: {
  checked: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.radioItem}
      onPress={onPress}
    >
      <View
        style={[
          styles.radioOuter,
          checked ? { borderColor: colors.brand.primary } : { borderColor: colors.text.tertiary },
        ]}
      >
        {checked ? <View style={styles.radioInner} /> : null}
      </View>
      <Text style={checked ? styles.radioLabelActive : styles.radioLabel}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function validateOwnerFieldErrors(owner: OwnerDraft): OwnerFieldErrors {
  const rowError = validateOwnerDates(owner);
  if (!rowError) return {};
  return { [rowError.field]: rowError.message };
}

export function OwnersForm({ value, onChange }: Props) {
  const [fieldErrors, setFieldErrors] = useState<Record<string, OwnerFieldErrors>>({});

  const setOwnerErrors = useCallback((ownerId: string, errors: OwnerFieldErrors) => {
    setFieldErrors((prev) => {
      const next = { ...prev };
      if (Object.keys(errors).length === 0) {
        delete next[ownerId];
      } else {
        next[ownerId] = errors;
      }
      return next;
    });
  }, []);

  const clearOwnerFieldError = useCallback(
    (ownerId: string, field: OwnerDateField) => {
      setFieldErrors((prev) => {
        const current = prev[ownerId];
        if (!current?.[field]) return prev;
        const nextForOwner = { ...current };
        delete nextForOwner[field];
        const next = { ...prev };
        if (Object.keys(nextForOwner).length === 0) {
          delete next[ownerId];
        } else {
          next[ownerId] = nextForOwner;
        }
        return next;
      });
    },
    [],
  );

  const addOwner = useCallback(() => {
    const next: OwnerDraft[] = [
      ...value,
      {
        id: `${Date.now()}_${Math.random().toString(16).slice(2)}`,
        type: (value[0]?.type ?? "jur") as OwnerType,
        startDate: "",
        endDate: "",
      },
    ];
    onChange(next);
  }, [onChange, value]);

  const updateOwner = useCallback(
    (ownerId: string, patch: Partial<OwnerDraft>) => {
      onChange(value.map((owner) => (owner.id === ownerId ? { ...owner, ...patch } : owner)));
      if (patch.startDate !== undefined) {
        clearOwnerFieldError(ownerId, "startDate");
      }
      if (patch.endDate !== undefined) {
        clearOwnerFieldError(ownerId, "endDate");
      }
    },
    [clearOwnerFieldError, onChange, value],
  );

  const handleDateBlur = useCallback(
    (owner: OwnerDraft) => {
      setOwnerErrors(owner.id, validateOwnerFieldErrors(owner));
    },
    [setOwnerErrors],
  );

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Заполните сведения о владельцах по ПТС</Text>

      {value.map((owner, idx) => {
        const errors = fieldErrors[owner.id] ?? {};

        return (
          <View key={owner.id} style={styles.ownerBlock}>
            <Text style={styles.sectionLabel}>Тип владельца</Text>
            <View style={styles.radioRow}>
              <RadioOption
                checked={owner.type === "jur"}
                label="Юридическое лицо"
                onPress={() => updateOwner(owner.id, { type: "jur" })}
              />
              <RadioOption
                checked={owner.type === "phys"}
                label="Физическое лицо"
                onPress={() => updateOwner(owner.id, { type: "phys" })}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.inputLabel}>Дата начала владения</Text>
              <TextInput
                style={[styles.input, errors.startDate ? styles.inputInvalid : null]}
                value={owner.startDate}
                onChangeText={(t) =>
                  updateOwner(owner.id, { startDate: formatDdMmYyyyInput(t) })
                }
                onBlur={() => handleDateBlur(owner)}
                placeholder={DD_MM_YYYY_PLACEHOLDER}
                placeholderTextColor={colors.text.muted}
                keyboardType="number-pad"
                maxLength={DD_MM_YYYY_MAX_LENGTH}
              />
              {errors.startDate ? (
                <Text style={styles.fieldError}>{errors.startDate}</Text>
              ) : null}
            </View>

            <View style={styles.field}>
              <Text style={styles.inputLabel}>Дата окончания владения</Text>
              <TextInput
                style={[styles.input, errors.endDate ? styles.inputInvalid : null]}
                value={owner.endDate}
                onChangeText={(t) =>
                  updateOwner(owner.id, { endDate: formatDdMmYyyyInput(t) })
                }
                onBlur={() => handleDateBlur(owner)}
                placeholder={DD_MM_YYYY_PLACEHOLDER}
                placeholderTextColor={colors.text.muted}
                keyboardType="number-pad"
                maxLength={DD_MM_YYYY_MAX_LENGTH}
              />
              {errors.endDate ? (
                <Text style={styles.fieldError}>{errors.endDate}</Text>
              ) : null}
            </View>

            {idx === value.length - 1 ? (
              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.addMoreBtn}
                onPress={addOwner}
              >
                <OrangePlusIcon width={14} height={14} />
                <Text style={styles.addMoreText}>Добавить ещё владельца</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        );
      })}
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
    marginBottom: 14,
  },
  ownerBlock: {
    backgroundColor: colors.surface.neutral,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  sectionLabel: {
    ...PR_TYPO.fieldLabel,
    marginBottom: 10,
  },
  radioRow: {
    flexDirection: "row",
    gap: 18,
    marginBottom: 14,
  },
  radioItem: {
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
  field: {
    marginBottom: 12,
  },
  inputLabel: {
    ...PR_TYPO.fieldLabelMuted,
    marginBottom: 8,
  },
  input: {
    ...PR_TYPO.input,
    height: 46,
    borderRadius: 10,
    backgroundColor: colors.surface.primary,
    paddingHorizontal: 14,
  },
  inputInvalid: {
    borderWidth: 1,
    borderColor: colors.brand.primary,
  },
  fieldError: {
    ...PR_TYPO.caption,
    color: colors.text.warning,
    marginTop: 6,
  },
  addMoreBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 10,
    marginTop: 10,
  },
  addMoreText: PR_TYPO.link,
});
