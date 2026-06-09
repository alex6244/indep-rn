import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../../../../shared/theme/colors";
import { styles } from "./PickerReportConfirmPage.styles";

type Props = {
  bottomPadding: number;
  onEdit: () => void;
  onConfirm: () => void;
  submitting?: boolean;
};

export function ConfirmFooterActions({
  bottomPadding,
  onEdit,
  onConfirm,
  submitting = false,
}: Props) {
  return (
    <View style={[styles.bottomBar, { paddingBottom: bottomPadding }]}>
      <TouchableOpacity
        style={[styles.bottomBtn, styles.editBtn]}
        activeOpacity={0.9}
        onPress={onEdit}
        disabled={submitting}
      >
        <Text style={styles.bottomBtnTextEdit}>Исправить</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.bottomBtn, styles.confirmBtn, submitting ? styles.confirmBtnDisabled : null]}
        activeOpacity={0.9}
        onPress={onConfirm}
        disabled={submitting}
      >
        {submitting ? (
          <ActivityIndicator size="small" color={colors.text.inverse} />
        ) : (
          <Text style={styles.bottomBtnTextConfirm}>Подтвердить</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
