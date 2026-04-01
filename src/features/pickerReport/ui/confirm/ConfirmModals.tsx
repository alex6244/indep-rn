import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { styles } from "./PickerReportConfirmPage.styles";

type Props = {
  vinExistsVisible: boolean;
  onCloseVinExists: () => void;
};

export function ConfirmModals({ vinExistsVisible, onCloseVinExists }: Props) {
  return (
    <Modal
      transparent
      visible={vinExistsVisible}
      animationType="fade"
      onRequestClose={onCloseVinExists}
    >
      <TouchableOpacity
        style={styles.vinModalBackdrop}
        activeOpacity={1}
        onPress={onCloseVinExists}
      >
        <View style={styles.vinModalCard} onStartShouldSetResponder={() => true}>
          <Text style={styles.vinModalTitle}>Такой VIN-номер уже существует</Text>
          <Text style={styles.vinModalSubtitle}>
            Проверьте корректность введенных данных или укажите другой VIN.
          </Text>
          <TouchableOpacity style={styles.vinModalButton} onPress={onCloseVinExists}>
            <Text style={styles.vinModalButtonText}>Понятно</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
