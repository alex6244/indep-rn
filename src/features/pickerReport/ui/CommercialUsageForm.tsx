import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { RadioIcon } from "./internal/RadioIcon";

export type CommercialUsageState = {
  taxiPermission: boolean; // такси
  carSharing: boolean; // каршеринг
  leasing: boolean; // лизинг
};

type Props = {
  value: CommercialUsageState;
  onChange: (next: CommercialUsageState) => void;
};

function RadioQuestion({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <View style={styles.question}>
      <Text style={styles.questionLabel}>{label}</Text>
      <View style={styles.radioRow}>
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.radioCell}
          onPress={() => onChange(true)}
        >
          <RadioIcon checked={value} />
          <Text style={value ? styles.radioTextActive : styles.radioText}>Есть</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.radioCell}
          onPress={() => onChange(false)}
        >
          <RadioIcon checked={!value} />
          <Text style={!value ? styles.radioTextActive : styles.radioText}>Нет</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export function CommercialUsageForm({ value, onChange }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Коммерческое использование</Text>

      <RadioQuestion
        label="Разрешение на работу в такси"
        value={value.taxiPermission}
        onChange={(v) => onChange({ ...value, taxiPermission: v })}
      />
      <RadioQuestion
        label="Регистрировался для работы в каршеринге"
        value={value.carSharing}
        onChange={(v) => onChange({ ...value, carSharing: v })}
      />
      <RadioQuestion
        label="Обнаружен в договорах лизинга"
        value={value.leasing}
        onChange={(v) => onChange({ ...value, leasing: v })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1E1E1E",
    marginBottom: 12,
  },
  question: {
    marginBottom: 16,
  },
  questionLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E1E1E",
    marginBottom: 8,
  },
  radioRow: {
    flexDirection: "row",
    gap: 22,
  },
  radioCell: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  radioText: {
    color: "#6B757C",
    fontSize: 14,
    fontWeight: "700",
  },
  radioTextActive: {
    color: "#DB4431",
    fontSize: 14,
    fontWeight: "800",
  },
});

