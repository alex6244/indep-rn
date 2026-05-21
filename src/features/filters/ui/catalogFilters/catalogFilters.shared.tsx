import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { catalogFilterStyles as styles } from "./catalogFilters.styles";

export function onlyDigits(s: string): string {
  return String(s ?? "").replace(/\D/g, "");
}

type SectionHeaderProps = {
  label: string;
  onReset?: () => void;
  showReset?: boolean;
};

export function SectionHeader({ label, onReset, showReset }: SectionHeaderProps) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.filterLabel}>{label}</Text>
      {showReset && onReset ? (
        <TouchableOpacity onPress={onReset} hitSlop={8}>
          <Text style={styles.resetLink}>Сбросить</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

export function FilterBlock({ children }: { children: React.ReactNode }) {
  return <View style={styles.filterBlock}>{children}</View>;
}
