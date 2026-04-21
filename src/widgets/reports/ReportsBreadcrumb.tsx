import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useRouter, type Href } from "expo-router";
import { colors } from "../../shared/theme/colors";

type Props = {
  active: string;
};

export function ReportsBreadcrumb({ active }: Props) {
  const router = useRouter();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginBottom: 8,
        marginHorizontal: 16,
      }}
    >
      <TouchableOpacity onPress={() => router.push("/(tabs)/profile" as Href)}>
        <Text style={{ fontSize: 12, color: colors.text.subtle }}>Профиль</Text>
      </TouchableOpacity>
      <Text style={{ fontSize: 12, color: colors.text.subtle }}>{">"}</Text>
      <Text style={{ fontSize: 12, color: colors.brand.primary }}>{active}</Text>
    </View>
  );
}

