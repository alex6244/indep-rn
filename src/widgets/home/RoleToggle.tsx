import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { UserRole } from "../../types/user";
import { colors } from "../../shared/theme/colors";

type Props = {
  value: UserRole;
  onChange: (role: UserRole) => void;
};

export function RoleToggle({ value, onChange }: Props) {
  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={[styles.option, value === "picker" && styles.optionActive]}
        onPress={() => onChange("picker")}
      >
        <Text style={[styles.optionText, value === "picker" && styles.optionTextActive]}>
          Я подборщик
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.option, value === "client" && styles.optionActive]}
        onPress={() => onChange("client")}
      >
        <Text style={[styles.optionText, value === "client" && styles.optionTextActive]}>
          Ищу авто
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 12,
    backgroundColor: "#EFEFEF",
    borderRadius: 14,
    padding: 4,
    flexDirection: "row",
    gap: 4,
  },
  option: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
  },
  optionActive: {
    backgroundColor: colors.buttonDark,
  },
  optionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#777",
  },
  optionTextActive: {
    color: colors.onDark,
  },
});

