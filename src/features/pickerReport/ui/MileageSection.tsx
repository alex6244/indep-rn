import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

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
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 12,
    color: "#1E1E1E",
  },
  field: {},
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E1E1E",
    marginBottom: 8,
  },
  input: {
    height: 46,
    borderRadius: 10,
    backgroundColor: "#F7F7F7",
    paddingHorizontal: 14,
    color: "#1E1E1E",
    fontSize: 14,
  },
});

