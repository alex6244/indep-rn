import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { colors } from "../../../shared/theme/colors";
import { PR_TYPO } from "./pickerReport.styles";

type Props = {
  value: string;
  onChange: (next: string) => void;
};

export function MileageSection({ value, onChange }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Заполните пробег</Text>

      <View style={styles.field}>
        <Text style={styles.label}>Пробег авто</Text>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChange}
          placeholder="000 000 км"
          keyboardType="numeric"
          placeholderTextColor="rgba(0,0,0,0.25)"
        />
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
});

