import React from "react";
import { Text } from "react-native";
import { colors } from "../../shared/theme/colors";

export function ReportsHeader({ title }: { title: string }) {
  return (
    <Text
      style={{
        fontSize: 24,
        fontWeight: "600",
        marginHorizontal: 16,
        marginBottom: 16,
        color: colors.text.primary,
      }}
    >
      {title}
    </Text>
  );
}

