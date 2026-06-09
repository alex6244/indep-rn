import React from "react";
import { Text, TextInput, View } from "react-native";
import { AppButton } from "../../../shared/ui/AppButton";
import { colors } from "../../../shared/theme/colors";
import { LEAD_SUGGEST_HINT } from "../hooks/aiPickerUtils";
import { aiPickerStyles as styles } from "./aiPicker.styles";

type AiPickerLeadFormProps = {
  selectedCount: number;
  phone: string;
  onPhoneChange: (value: string) => void;
  leadSent: boolean;
  leadSubmitting: boolean;
  phoneOk: boolean;
  showLeadCta: boolean;
  onSubmit: () => void;
};

export function AiPickerLeadForm({
  selectedCount,
  phone,
  onPhoneChange,
  leadSent,
  leadSubmitting,
  phoneOk,
  showLeadCta,
  onSubmit,
}: AiPickerLeadFormProps) {
  return (
    <View style={styles.leadBox}>
      <Text style={styles.leadTitle}>Оставить заявку</Text>
      <Text style={styles.selectedHint}>
        Выбрано: {selectedCount} — укажите телефон, менеджер перезвонит
      </Text>
      {showLeadCta ? (
        <Text style={styles.selectedHint}>{LEAD_SUGGEST_HINT}</Text>
      ) : null}
      <TextInput
        style={styles.input}
        placeholder="+7 (999) 123-45-67"
        placeholderTextColor={colors.text.muted}
        keyboardType="phone-pad"
        value={phone}
        onChangeText={onPhoneChange}
        editable={!leadSent}
      />
      <AppButton
        label={leadSubmitting ? "Отправляем…" : "Отправить заявку"}
        onPress={onSubmit}
        disabled={!phoneOk || leadSubmitting}
      />
    </View>
  );
}
