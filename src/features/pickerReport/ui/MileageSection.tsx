import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { colors } from "../../../shared/theme/colors";

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
          placeholderTextColor="#00000040"
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
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 12,
    color: colors.text.primary,
  },
  field: {},
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: 8,
  },
  input: {
    height: 46,
    borderRadius: 10,
    backgroundColor: colors.surface.neutral,
    paddingHorizontal: 14,
    color: colors.text.primary,
    fontSize: 14,
  },
});

