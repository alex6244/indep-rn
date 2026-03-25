import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { RadioIcon } from "./internal/RadioIcon";

export type LegalCleanlinessState = {
  pledge: boolean; // залог
  registrationRestrictions: boolean; // ограничения на рег. действия
  wanted: boolean; // розыск
};

type Props = {
  value: LegalCleanlinessState;
  onChange: (next: LegalCleanlinessState) => void;
};

function Question({
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

export function LegalCleanlinessForm({ value, onChange }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Юридическая чистота автомобиля</Text>

      <Question
        label="Сведения о нахождении в залоге"
        value={value.pledge}
        onChange={(v) => onChange({ ...value, pledge: v })}
      />
      <Question
        label="Ограничения на регистрационные действия"
        value={value.registrationRestrictions}
        onChange={(v) =>
          onChange({ ...value, registrationRestrictions: v })
        }
      />
      <Question
        label="Сведения о нахождении в розыске"
        value={value.wanted}
        onChange={(v) => onChange({ ...value, wanted: v })}
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
    marginBottom: 14,
  },
  questionLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E1E1E",
    marginBottom: 6,
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

