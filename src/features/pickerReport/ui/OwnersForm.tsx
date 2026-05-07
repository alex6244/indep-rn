import React, { useCallback } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import OrangePlusIcon from "../../../assets/icons/orange-plus.svg";
import { colors } from "../../../shared/theme/colors";

export type OwnerType = "jur" | "phys";

export type OwnerDraft = {
  id: string;
  type: OwnerType;
  startDate: string;
  endDate: string;
};

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

export function OwnersForm({ value, onChange }: Props) {
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
    },
    [onChange, value],
  );

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Заполните сведения о владельцах по ПТС</Text>

      {value.map((owner, idx) => (
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
              style={styles.input}
              value={owner.startDate}
              onChangeText={(t) => updateOwner(owner.id, { startDate: t })}
              placeholder="дд мм.мммм"
              placeholderTextColor={colors.text.muted}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.inputLabel}>Дата окончания владения</Text>
            <TextInput
              style={styles.input}
              value={owner.endDate}
              onChangeText={(t) => updateOwner(owner.id, { endDate: t })}
              placeholder="дд мм.мммм"
              placeholderTextColor={colors.text.muted}
            />
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
      ))}
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
    fontSize: 18,
    fontWeight: "800",
    color: colors.text.primary,
    marginBottom: 14,
  },
  ownerBlock: {
    backgroundColor: colors.surface.neutral,
    borderRadius: 12,
    padding: 14,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text.primary,
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
  radioLabel: {
    color: colors.text.tertiary,
    fontWeight: "600",
    fontSize: 14,
  },
  radioLabelActive: {
    color: colors.brand.primary,
    fontWeight: "700",
    fontSize: 14,
  },
  field: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.text.tertiary,
    marginBottom: 8,
  },
  input: {
    height: 46,
    borderRadius: 10,
    backgroundColor: colors.surface.primary,
    paddingHorizontal: 14,
    color: colors.text.primary,
    fontSize: 14,
  },
  addMoreBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 10,
    marginTop: 10,
  },
  addMoreText: {
    color: colors.brand.primary,
    fontSize: 14,
    fontWeight: "700",
  },
});

