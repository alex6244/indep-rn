import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { UserRole } from "../../types/user";
import { colors } from "../../shared/theme/colors";
import { radius } from "../../shared/theme/radius";
import { spacing } from "../../shared/theme/spacing";

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
    marginTop: spacing.md,
    backgroundColor: colors.surface.placeholder,
    borderRadius: radius.md + 2,
    padding: spacing.xs,
    flexDirection: "row",
    gap: spacing.xs,
  },
  option: {
    flex: 1,
    borderRadius: radius.md,
    paddingVertical: spacing.sm + 2,
    alignItems: "center",
  },
  optionActive: {
    backgroundColor: colors.brand.dark,
  },
  optionText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text.secondary,
  },
  optionTextActive: {
    color: colors.text.inverse,
  },
});

