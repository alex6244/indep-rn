import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "./PickerReportCreatePage.styles";

type Props = {
  onGoToProfile: () => void;
};

export function CreateRoleGate({ onGoToProfile }: Props) {
  return (
    <View style={styles.center}>
      <Text style={styles.noticeTitle}>Этот раздел доступен только подборщикам</Text>
      <Text style={styles.noticeText}>
        Чтобы создать отчет, нужно перейти в роль подборщика.
      </Text>
      <TouchableOpacity
        style={styles.primaryBtn}
        onPress={onGoToProfile}
        activeOpacity={0.9}
      >
        <Text style={styles.primaryBtnText}>Перейти в профиль</Text>
      </TouchableOpacity>
    </View>
  );
}

