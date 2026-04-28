import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import LogoutIcon from "../../assets/icons/burger/logout.svg";
import { FONT_FAMILY } from "../../shared/theme/fonts";
import { colors } from "../../shared/theme/colors";
import { spacing } from "../../shared/theme/spacing";

type Props = {
  onPress: () => void;
};

export function ProfileLogoutRow({ onPress }: Props) {
  return (
    <TouchableOpacity
      style={{ padding: spacing.lg }}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Выйти из аккаунта"
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <LogoutIcon width={22} height={22} />
        <Text
          style={{
            fontSize: 14,
            fontWeight: "600",
            color: colors.text.secondary,
            fontFamily: FONT_FAMILY.button,
          }}
        >
          Выйти из аккаунта
        </Text>
      </View>
    </TouchableOpacity>
  );
}
