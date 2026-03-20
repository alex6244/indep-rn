import React from "react";
import { Text } from "react-native";

export function ReportsHeader({ title }: { title: string }) {
  return (
    <Text
      style={{
        fontSize: 24,
        fontWeight: "600",
        marginHorizontal: 16,
        marginBottom: 16,
        color: "#1E1E1E",
      }}
    >
      {title}
    </Text>
  );
}

