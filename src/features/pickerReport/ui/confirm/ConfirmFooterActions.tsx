import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "./PickerReportConfirmPage.styles";

type Props = {
  bottomPadding: number;
  onEdit: () => void;
  onConfirm: () => void;
};

export function ConfirmFooterActions({ bottomPadding, onEdit, onConfirm }: Props) {
  return (
    <View style={[styles.bottomBar, { paddingBottom: bottomPadding }]}>
      <TouchableOpacity
        style={[styles.bottomBtn, styles.editBtn]}
        activeOpacity={0.9}
        onPress={onEdit}
      >
        <Text style={styles.bottomBtnTextEdit}>Исправить</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.bottomBtn, styles.confirmBtn]}
        activeOpacity={0.9}
        onPress={onConfirm}
      >
        <Text style={styles.bottomBtnTextConfirm}>Подтвердить</Text>
      </TouchableOpacity>
    </View>
  );
}
